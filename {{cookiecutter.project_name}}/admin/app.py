import os
import importlib
import base64
import logging
from logging.handlers import TimedRotatingFileHandler
import sys
import asyncio

from cryptography import fernet
from wtforms import form, fields, validators
from flask import Flask, url_for, redirect, request, flash
import flask_admin as admin
from flask_admin import expose, helpers
import flask_login as login
from flask_admin.babel import gettext
from flask_admin.form import Select2Widget
from flask_session import Session
{%- if cookiecutter.database == 'mongodb' %}
from bson.objectid import ObjectId
from flask_mongoengine.wtf.fields import DictField
from flask_admin.contrib.pymongo import ModelView
{%- else %}
from flask_admin.contrib.sqla import ModelView
from flask_sqlalchemy import SQLAlchemy
from wtforms.ext.sqlalchemy.fields import QuerySelectField
{%- endif %}

# PATH

HERE = os.path.abspath(os.path.dirname(__file__))
ROOT = os.path.join(HERE, '..')
sys.path.append(ROOT)

from server.model.user import User  # noqa
from server.utils import DbSessionContext, get_client  # noqa
from server.settings import config  # noqa
from server import exceptions  # noqa
{%- if cookiecutter.database != 'mongodb' %}
from server.database import init_db, get_connection_url  # noqa
from server.model.notification import Notification  # noqa
from server.model.emailconfirmationtoken import Emailconfirmationtoken  # noqa
from server.model.resetpasswordtoken import Resetpasswordtoken  # noqa
{%- endif %}


# LOOP

loop = asyncio.get_event_loop()
asyncio.set_event_loop(loop)

# CONFIG

config_path = os.path.join(ROOT, 'configs', 'server.json')
config.configure(config_path)

# LOGGING

# DISABLE werkzeug
werkzeug_logger = logging.getLogger('werkzeug')
werkzeug_logger.setLevel(logging.ERROR)

# {{cookiecutter.project_name|upper}} ADMIN
logger = logging.getLogger('{{cookiecutter.project_name|lower}}_admin')
logger.setLevel(getattr(logging, config.get('admin').get('log_level', 'INFO')))

formatter = logging.Formatter(
    '[L:%(lineno)d]# %(levelname)-8s [%(asctime)s]  %(message)s',
    datefmt='%d-%m-%Y %H:%M:%S'
)

# StreamHandler
sh = logging.StreamHandler()
sh.setFormatter(formatter)
logger.addHandler(sh)

# FileHandler
fh = TimedRotatingFileHandler(
    os.path.join(ROOT, 'logs', 'admin_server.log'),
    when="midnight"
)
fh.setFormatter(formatter)
logger.addHandler(fh)

{%- if cookiecutter.database == 'mongodb' %}
# MONGO
pymongo_client = get_client(config)
db = pymongo_client[config.get('db_name')]
{%- endif %}

# APP
app = Flask(__name__)

{%- if cookiecutter.database != 'mongodb' %}
app.config['SQLALCHEMY_DATABASE_URI'] = get_connection_url(config)
{%- endif %}

# SECRET KEY
fernet_key = fernet.Fernet.generate_key()
secret_key = base64.urlsafe_b64decode(fernet_key)
app.config['SECRET_KEY'] = secret_key

# SESSION
app.config['SESSION_TYPE'] = 'redis'
sess = Session()
sess.init_app(app)


class BaseView(ModelView):

    def is_accessible(self):
        return login.current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('index'))

    def create_model(self, form):
        model = form.data
        self.on_model_change(form, model, True)
        return True

    def update_model(self, form, model):
        self.on_model_change(form, model, False)
        return True

    def on_model_change(self, form, model, is_created):
        logger.info("on_model_change")
        with DbSessionContext(config) as session:
            try:
                data = form.data.copy()
                m = importlib.import_module(
                    'server.model.{model}'
                    .format(model=self.name.lower())
                )
                model_class = getattr(m, self.name)

                if not is_created:
                    model_obj = session.query(model_class)\
                        .filter(model_class.id == model.id)\
                        .one()
                else:
                    model_obj = model_class()

                {%- if cookiecutter.database != 'mongodb' %}
                if 'user' in data:
                    data['user_uid'] = form.data['user'].get_uid()
                {%- endif %}

                context = {}
                context['db_session'] = session
                context['author'] = login.current_user
                context['data'] = data
                context['save'] = True

                loop.run_until_complete(model_obj.validate_and_save(context))

                {%- if cookiecutter.database == 'mongodb' %}
                pk = model_obj.get_uid()
                self.coll.update({'_id': pk}, model)
                {%- endif %}

            except Exception as e:
                if isinstance(e, exceptions.ServerBaseException):
                    flash(
                      gettext(
                        'Failed to update record. %(exception)s(%(error)s)',
                        exception=e.get_name(),
                        error=e
                      ),
                      'error'
                    )
                else:
                    flash(
                        gettext(
                            'Failed to update record. %(error)s',
                            error=e
                        ),
                        'error'
                    )
                return False
            else:
                self.after_model_change(form, model, True)

            return True


{%- if cookiecutter.database == 'mongodb' %}
# TODO refactor and make it more general
# currently only support the mapping between
# model.user_uid to user.email
class UidToEmailView(BaseView):
    def get_list(self, *args, **kwargs):
        count, data = super(UidToEmailView, self).get_list(*args, **kwargs)

        query = {'_id': {'$in': [x['user_uid'] for x in data]{{"}}"}}
        users = db.User.find(query, projection=['email'])

        users_map = dict((x['_id'], x['email']) for x in users)

        for item in data:
            item['user_email'] = users_map.get(item['user_uid'])

        return count, data

    def _feed_user_choices(self, form):
        users = db.User.find(projection=['email'])
        form.user_uid.choices = [(str(x['_id']), x['email']) for x in users]
        return form

    def create_form(self):
        form = super(UidToEmailView, self).create_form()
        return self._feed_user_choices(form)

    def edit_form(self, obj):
        form = super(UidToEmailView, self).edit_form(obj)
        return self._feed_user_choices(form)

    def on_model_change(self, form, model, is_created):
        user_uid = model.get('user_uid')
        model['user_uid'] = ObjectId(user_uid)

        return super(UidToEmailView, self).on_model_change(
            form,
            model,
            is_created
        )

    def _search(self, query, search_term):
        m = importlib.import_module(
            'server.model.{model}'.format(model=self.name.lower())
        )
        model_class = getattr(m, self.name)
        with DbSessionContext(config) as session:
            user_query = session.query(User)\
                .filter(User.email == search_term)
            if user_query.count():
                user = user_query.one()
                query_model = session.query(model_class)\
                    .filter(model_class.user_uid == user.get_uid())
                query = query_model.query

        return query
{%- endif %}


class EmailConfirmationTokenForm(form.Form):
    {%- if cookiecutter.database == 'mongodb' %}
    user_uid = fields.SelectField('User', widget=Select2Widget())
    {%- else %}
    user = QuerySelectField(
        get_label=lambda x: x.email,
        query_factory=lambda: db.session.query(User).all(),
        widget=Select2Widget()
    )
    {%- endif %}
    token = fields.TextField()
    used = fields.BooleanField()


{%- if cookiecutter.database == 'mongodb' %}
class EmailConfirmationTokenView(UidToEmailView):
{% else %}
class EmailConfirmationTokenView(BaseView):
{% endif %}
    {%- if cookiecutter.database == 'mongodb' %}
    column_list = ('token', 'user_email', 'used')
    column_sortable_list = ('token', 'user_email', 'used')
    column_searchable_list = ('user_uid')
    {%- else %}
    column_list = ('token', 'used', 'user.email')
    column_sortable_list = ('token', 'used')
    column_searchable_list = ('user.email',)
    {%- endif %}

    form = EmailConfirmationTokenForm


class ResetPasswordTokenForm(form.Form):
    {%- if cookiecutter.database == 'mongodb' %}
    user_uid = fields.SelectField('User', widget=Select2Widget())
    {%- else %}
    user = QuerySelectField(
        get_label=lambda x: x.email,
        query_factory=lambda: db.session.query(User).all(),
        widget=Select2Widget()
    )
    {%- endif %}
    token = fields.TextField()
    expiration_datetime = fields.TextField()
    used = fields.BooleanField()
    password_reset = fields.BooleanField()


{% if cookiecutter.database == 'mongodb' %}
class ResetPasswordTokenView(UidToEmailView):
{% else %}
class ResetPasswordTokenView(BaseView):
{% endif %}
    {%- if cookiecutter.database == 'mongodb' %}
    column_list = ('token', 'user_email', 'used')
    column_sortable_list = ('token', 'user_email', 'used')
    column_searchable_list = ('user_uid')
    {%- else %}
    column_list = ('token', 'used', 'user.email')
    column_sortable_list = ('token', 'used')
    column_searchable_list = ('user.email',)
    {%- endif %}

    form = ResetPasswordTokenForm


class NotificationForm(form.Form):
    {%- if cookiecutter.database == 'mongodb' %}
    user_uid = fields.SelectField('User', widget=Select2Widget())
    template_data = DictField()
    {%- else %}
    user = QuerySelectField(
        get_label=lambda x: x.email,
        query_factory=lambda: db.session.query(User).all(),
        widget=Select2Widget()
    )
    template_data = fields.TextField()
    {%- endif %}
    message = fields.TextField()
    seen = fields.BooleanField()
    target_url = fields.TextField()


{% if cookiecutter.database == 'mongodb' %}
class NotificationView(UidToEmailView):
{% else %}
class NotificationView(BaseView):
{% endif %}
    {%- if cookiecutter.database == 'mongodb' %}
    column_list = ('user_email', 'message')
    column_sortable_list = ('user_email', 'message', 'seen_timestamp')
    column_searchable_list = ('user_uid')
    {%- else %}
    column_list = ('message', 'user.email')
    column_sortable_list = ('message', 'seen_timestamp')
    column_searchable_list = ('user.email',)
    {%- endif %}

    form = NotificationForm


class UserForm(form.Form):
    name = fields.TextField('Name', [validators.DataRequired()])
    email = fields.TextField(
        'Email',
        [validators.DataRequired(), validators.Email()]
    )
    role = fields.SelectField(
        'Role',
        choices=[('admin', 'admin'), ('user', 'user')]
    )
    enable = fields.BooleanField('Enable')
    email_confirmed = fields.BooleanField('Email confirmed')
    password = fields.PasswordField('Password')


class UserView(BaseView):
    column_list = ('_id', 'name', 'email', 'role', 'enable', 'email_confirmed')
    column_sortable_list = (
        'name',
        'email',
        'role',
        'enable',
        'email_confirmed'
    )
    column_searchable_list = ('name', 'email')

    form = UserForm


class Admin(object):

    username = config.get('admin').get('username')
    password = config.get('admin').get('password')
    role = 'admin'

    def __repr__(self):
        return "Admin"

    def is_authenticated(self):
        # logger.debug('Admin.is_authenticated')
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.username

    def __unicode__(self):
        return self.username


class LoginForm(form.Form):
    login = fields.TextField(validators=[validators.required()])
    password = fields.PasswordField(validators=[validators.required()])

    def validate_login(self, field):
        user = self.get_user()

        if user is None:
            raise validators.ValidationError('Invalid user')

        if user.password != self.password.data:
            raise validators.ValidationError('Invalid password')

    def get_user(self):
        if self.login.data == config.get('admin').get('username'):
            return Admin()
        else:
            return None


def init_login():
    login_manager = login.LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        if user_id == config.get('admin').get('username'):
            return Admin()
        else:
            return None


class MyAdminIndexView(admin.AdminIndexView):

    @expose('/')
    def index(self):
        if not login.current_user.is_authenticated:
            # logger.debug('not login.current_user.is_authenticated
            # redirect to login_view')
            return redirect(url_for('.login_view'))
        return super(MyAdminIndexView, self).index()

    @expose('/login/', methods=('GET', 'POST'))
    def login_view(self):
        form = LoginForm(request.form)
        if helpers.validate_form_on_submit(form):
            user = form.get_user()
            login.login_user(user)

        if login.current_user.is_authenticated:
            # logger.debug('login.current_user.is_authenticated
            # redirect to index')
            return redirect(url_for('.index'))
        self._template_args['form'] = form
        return super(MyAdminIndexView, self).index()

    @expose('/logout/')
    def logout_view(self):
        login.logout_user()
        return redirect(url_for('.index'))


@app.route('/')
def index():
    return redirect(url_for('admin.index'))


init_login()

admin = admin.Admin(
    app,
    '{{cookiecutter.project_name}} - admin',
    index_view=MyAdminIndexView(),
    base_template='my_master.html'
)
{%- if cookiecutter.database == 'mongodb' %}
admin.add_view(UserView(db.User, 'User'))
admin.add_view(NotificationView(db.Notification, 'Notification'))
admin.add_view(
    EmailConfirmationTokenView(
        db.Emailconfirmationtoken,
        'Emailconfirmationtoken'
    )
)
admin.add_view(
    ResetPasswordTokenView(
        db.Resetpasswordtoken,
        'Resetpasswordtoken'
    )
)
{%- else %}
db = SQLAlchemy(app)
init_db(config)

admin.add_view(UserView(User, db.session))
admin.add_view(NotificationView(Notification, db.session))
admin.add_view(
    EmailConfirmationTokenView(
        Emailconfirmationtoken,
        db.session
    )
)
admin.add_view(
    ResetPasswordTokenView(
        Resetpasswordtoken,
        db.session
    )
)
{%- endif %}

if __name__ == '__main__':
    host = config.get('admin').get('host')
    port = config.get('admin').get('port')
    debug = config.get('admin').get('debug')
    app.run(host=host, port=port, debug=debug)

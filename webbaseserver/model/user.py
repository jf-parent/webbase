import urllib
import hashlib

import bcrypt
from mongoalchemy.document import Index
from mongoalchemy.fields import *  # noqa
from validate_email import validate_email

from jobs.send_email import send_email
from webbaseserver.utils import SafeStringField
from webbaseserver.model.base_model import BaseModel
from webbaseserver.model.notification import Notification
from webbaseserver.prometheus_instruments import active_user_gauge
from webbaseserver.settings import config
from webbaseserver.exceptions import *  # noqa
from webbaseserver.model.email_confirmation_token import EmailConfirmationToken

NAME_MIN_LEN = 2  # e.g.: Ed
NAME_MAX_LEN = 60  # e.g.: Hubert Blaine Wolfeschlegelsteinhausenbergerdorff, Sr. # noqa


class User(BaseModel):
    name = SafeStringField(required=True, min_length=NAME_MIN_LEN, max_length=NAME_MAX_LEN)  # noqa
    email = SafeStringField(required=True)
    role = EnumField(StringField(), 'admin', 'user', default="user")
    enable = BoolField(default=True)
    email_confirmed = BoolField(default=False)
    gravatar_url = StringField(default="")
    # settings =
    # social_id =
    # social_provider =

    # PASSWORD
    hashed_password = StringField(required=True)
    salt = StringField(required=True)

    # INDEX
    i_email = Index().ascending('email').unique()

    def __eq__(self, target):
        return target.get_uid() == self.get_uid()

    def __repr__(self):
        try:
            _repr = "User <uid: '{uid}'><name:'{name}'><email:'{email}'><role:'{role}'><enable:'{enable}'>"  # noqa
            return _repr.format(
                    name=self.name,
                    uid=self.get_uid(),
                    email=self.email,
                    enable=self.enable,
                    role=self.role
                )
        except AttributeError:
            return "User uninitialized"

##############################################################################
# FUNC
##############################################################################

    async def check_password(self, target_password):
        target_hashed_password, _ = await self.gen_hashed_password(
            target_password,
            self.salt
        )

        if target_hashed_password == self.hashed_password:
            return True
        else:
            return False

    async def gen_hashed_password(self, raw_password, salt_str=False):
        master_secret_key = config.get("MASTER_PASSWORD")
        if not salt_str:
            salt = bcrypt.gensalt()
            salt_str = salt.decode('utf-8')
        else:
            salt = bytes(salt_str.encode('utf-8'))

        mixed_password = raw_password + salt_str + master_secret_key
        hashed_password = bcrypt.hashpw(
            mixed_password.encode('utf-8'),
            salt
        ).decode('utf-8')
        return hashed_password, salt_str

    async def sanitize_data(self, context):
        author = context.get('author')
        data = context.get('data')

        if author:
            if author.role == 'admin':
                return data
            else:
                editable_fields = [
                    'name',
                    'email',
                    'old_password',
                    'new_password'
                ]
        else:
            editable_fields = ['name', 'email', 'password']

        return {k: data[k] for k in data if k in editable_fields}

    async def validate_and_save(self, context):
        queue = context.get('queue')
        data = context.get('data')
        db_session = context.get('db_session')
        save = context.get('save', True)

        is_new = await self.is_new()

        # EMAIL CONFIRMED
        email_confirmed = data.get('email_confirmed')
        if email_confirmed is not None:
            self.email_confirmed = email_confirmed
            if email_confirmed:
                notification_data = {
                    'message': 'notification.YourEmailHasBeenConfirmed'
                }
                await self.add_notification(
                    db_session,
                    notification_data
                )

        # NAME
        name = data.get('name')
        if name:
            if len(name) < NAME_MIN_LEN or len(name) > NAME_MAX_LEN:
                raise InvalidNameException(name)

            self.name = name
        else:
            if is_new:
                raise InvalidNameException('empty name')

        # ROLE
        role = data.get('role')
        if role:
            self.role = role

        # ENABLE
        enable = data.get('enable')
        if enable is not None:
            self.enable = enable

        # PASSWORD
        password = data.get('password')
        if password:
            await self.set_password(data.get('password'))
        else:
            if is_new:
                raise InvalidPasswordException('empty password')

        # NEW PASSWORD
        new_password = data.get('new_password')
        if new_password:
            old_password = data.get('old_password')
            if old_password:
                is_password_valid = await self.check_password(old_password)
                if is_password_valid:
                    await self.set_password(new_password)
                else:
                    raise WrongEmailOrPasswordException()
            else:
                raise InvalidRequestException('Missing old password')

        # EMAIL
        email = data.get('email')
        if email:
            if is_new or self.email != email:
                is_email_valid = validate_email(email)
                if not is_email_valid:
                    raise InvalidEmailException(email)

                email_uniqueness_query = db_session.query(User)\
                    .filter(User.email == email)
                if not is_new:
                    email_uniqueness_query = email_uniqueness_query\
                        .filter(User.mongo_id != self.get_uid())

                if email_uniqueness_query.count():
                    raise EmailAlreadyExistsException(email)

                self.email = email
                self.email_confirmed = False

                # NOTIFICATON FOR CONFIRMATION EMAIL
                if not is_new:
                    notification_data = {
                        'message': 'notification.PleaseConfirmYourEmail',
                        'template_data': {'email': email}
                    }
                    await self.add_notification(db_session, notification_data)

                # GRAVATAR
                gravatar_url = "{base_url}{md5_hash}?{params}".format(
                    base_url="https://www.gravatar.com/avatar/",
                    md5_hash=hashlib.md5(
                        email.lower().encode('utf')
                    ).hexdigest(),
                    params=urllib.parse.urlencode(
                        {'d': "identicon", 's': '40'}
                    )
                )
                self.gravatar_url = gravatar_url

        else:
            if is_new:
                raise InvalidEmailException('empty email')

        if save:
            db_session.save(self, safe=True)

        if not self.email_confirmed and queue:
            email_confirmation_token = EmailConfirmationToken()
            context['user'] = self
            email_confirmation_token.init(context)
            if config.get('ENV', 'production') == 'production':
                self.send_email_confirmation_email(
                    queue,
                    email_confirmation_token
                )

    async def set_password(self, password):
        if await self.is_password_valid(password):
            hashed_password, salt = await self.gen_hashed_password(password)
            self.hashed_password = hashed_password
            self.salt = salt
        else:
            raise InvalidPasswordException(password)

    async def is_password_valid(self, password):
        if len(password) < 6:
            return False
        else:
            return True

    async def method_autorized(self, context):
        method = context.get('method')
        author = context.get('author')

        if method in ['create', 'delete']:
            if author.role == 'admin':
                return True
            else:
                return False
        elif method in ['update', 'read']:
            if author == self:
                return True
            elif author.role == 'admin':
                return True
            else:
                return False

    async def serialize(self, context):
        data = {}
        data['uid'] = self.get_uid()
        data['name'] = self.name
        data['email'] = self.email
        data['email_confirmed'] = self.email_confirmed
        data['gravatar_url'] = self.gravatar_url
        return data

    async def add_notification(self, db_session, data):
        data['user_uid'] = self.get_uid()
        context = {
            'data': data,
            'db_session': db_session
        }
        notification = Notification()
        await notification.validate_and_save(context)

    def send_email_confirmation_email(self, queue, email_confirmation_token):
        # FORMAT EMAIL TEMPLATE
        email = config.get('email_confirmation_email')
        email = email.copy()
        email['text'] = email['text'].format(
            email_validation_token=self.email_validation_token.token
        )
        email['html'] = email['html'].format(
            email_validation_token=self.email_validation_token.token
        )
        email['to'][0]['email'] = email['to'][0]['email'].format(
            user_email=self.email
        )
        email['to'][0]['name'] = email['to'][0]['name'].format(
            user_name=self.name
        )

        # ADD THE SEND EMAIL TO THE QUEUE
        queue.enqueue(
            send_email,
            config.get('REST_API_ID'),
            config.get('REST_API_SECRET'),
            email
        )

    def logout(self, session):
        del session['uid']
        active_user_gauge.dec()

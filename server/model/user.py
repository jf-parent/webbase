import urllib
import hashlib

import bcrypt
from mongoalchemy.document import Document, Index
from mongoalchemy.fields import *  # noqa
from validate_email import validate_email

from server.prometheus_instruments import active_user_gauge
from server.settings import config
from server.exceptions import *  # noqa
from server.utils import generate_token

NAME_MIN_LEN = 2  # e.g.: Ed
NAME_MAX_LEN = 60  # e.g.: Hubert Blaine Wolfeschlegelsteinhausenbergerdorff, Sr. # noqa


class User(Document):
    name = StringField(required=True, min_length=NAME_MIN_LEN, max_length=NAME_MAX_LEN)  # noqa
    email = StringField(required=True)
    role = EnumField(StringField(), 'admin', 'user', default="user")
    enable = BoolField(default=True)
    email_validation_token = StringField(default="")
    email_confirmed = BoolField(default=False)
    reset_password_token = StringField(default="")
    gravatar_url = StringField(default="")
    # settings =
    # social_id =
    # social_provider =

    # PASSWORD
    hashed_password = StringField(required=True)
    salt = StringField(required=True)

    # TIMESTAMP
    created_ts = CreatedField()
    modified_ts = ModifiedField()

    # INDEX
    i_email = Index().ascending('email').unique()

    def __repr__(self):
        _repr = "User <name:'{name}'><email:'{email}'><role:'{role}'><enable:'{enable}'>"  # noqa
        return _repr.format(
                name=self.name,
                email=self.email,
                enable=self.enable,
                role=self.role
            )

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

    def get_editable_user_fields(self):
        return ['name', 'email', 'old_password', 'new_password']

    async def sanitize_data(self, data, user):
        if user.role == 'admin':
            return data
        else:
            editable_fields = self.get_editable_user_fields()
            return {k: data[k] for k in data if k in editable_fields}

    async def validate_and_save(self, db_session, data):

        # EMAIL
        email = data.get('email')
        if email is not None:
            is_email_valid = validate_email(email)
            if not is_email_valid:
                raise InvalidEmailException(email)

            email_uniqueness_query = db_session.query(User)\
                .filter(User.email == email)
            if hasattr(self, 'mongo_id'):
                email_uniqueness_query = email_uniqueness_query\
                    .filter(User.mongo_id != self.get_uid())

            if email_uniqueness_query.count():
                raise EmailAlreadyExistsException(email)

            self.email = email
            self.email_confirmed = False

            # GRAVATAR
            gravatar_url = "{base_url}{md5_hash}?{params}".format(
                base_url="https://www.gravatar.com/avatar/",
                md5_hash=hashlib.md5(email.lower().encode('utf')).hexdigest(),
                params=urllib.parse.urlencode({'d': "identicon", 's': '40'})
            )
            self.gravatar_url = gravatar_url

            # EMAIL VALIDATION TOKEN
            email_validation_token = data.get('email_validation_token')
            if email_validation_token is not None:
                self.email_validation_token = email_validation_token
            else:
                self.email_validation_token = generate_token(20)

        # EMAIL CONFIRMED
        email_confirmed = data.get('email_confirmed')
        if email_confirmed is not None:
            self.email_confirmed = email_confirmed

        # NAME
        name = data.get('name')
        if name is not None:
            if len(name) < NAME_MIN_LEN or len(name) > NAME_MAX_LEN:
                raise InvalidNameException(name)

            self.name = name

        # ROLE
        role = data.get('role')
        if role is not None:
            self.role = role

        # ENABLE
        enable = data.get('enable')
        if enable is not None:
            self.enable = enable

        # PASSWORD
        password = data.get('password')
        if password is not None:
            await self.set_password(data.get('password'))

        # NEW PASSWORD
        new_password = data.get('new_password')
        if new_password is not None:
            old_password = data.get('old_password')
            if old_password is not None:
                is_password_valid = await self.check_password(old_password)
                if is_password_valid:
                    await self.set_password(new_password)
                else:
                    raise WrongEmailOrPasswordException()
            else:
                raise InvalidRequestException('Missing old password')

        # RESET PASSWORD TOKEN
        reset_password_token = data.get('reset_password_token')
        if reset_password_token is not None:
            self.reset_password_token = reset_password_token

        db_session.save(self, safe=True)

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

    async def edition_autorized(self, user):
        if user == self:
            return True
        elif user.role == 'admin':
            return True
        else:
            return False

    async def serialize(self):
        data = {}
        data['name'] = self.name
        data['email'] = self.email
        data['uid'] = str(self.mongo_id)
        data['gravatar_url'] = self.gravatar_url
        return data

    def get_uid(self):
        return str(self.mongo_id)

    @staticmethod
    def logout(session):
        del session['uid']
        active_user_gauge.dec()

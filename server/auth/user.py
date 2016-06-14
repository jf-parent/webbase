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
    role = EnumField(StringField(), 'admin', 'user')
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

    async def init_and_validate(self, db_session, data):
        # EMAIL
        email = data.get('email', '')
        is_email_valid = validate_email(email)
        if not is_email_valid:
            raise InvalidEmailException(email)

        if db_session.query(User).filter(User.email == email).count():
            raise EmailAlreadyExistsException(email)

        self.email = email

        # NAME
        name = data.get('name', '')
        if len(name) < NAME_MIN_LEN or len(name) > NAME_MAX_LEN:
            raise InvalidNameException(name)

        self.name = name

        self.role = data.get('role', 'user')

        # GRAVATAR
        default_url = "/static/img/default_profile_icon.jpg"
        gravatar_url = "{base_url}{md5_hash}?{params}".format(
            base_url="https://www.gravatar.com/avatar/",
            md5_hash=hashlib.md5(self.email.lower().encode('utf')).hexdigest(),
            params=urllib.parse.urlencode({'d': default_url, 's': '40'})
        )
        self.gravatar_url = gravatar_url

        if data.get('email_validation_token'):
            self.email_validation_token = data.get('email_validation_token')
        else:
            self.email_validation_token = generate_token(20)

        self.enable = data.get('enable', True)

        await self.set_password(data.get('password'))

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

    async def serialize(self):
        data = {}
        data['name'] = self.name
        data['email'] = self.email
        data['role'] = self.role
        data['enable'] = self.enable
        return data

    @staticmethod
    def logout(session):
        del session['email']
        active_user_gauge.dec()

import bcrypt
from mongoalchemy.document import Document, Index
from mongoalchemy.fields import *  # noqa
from validate_email import validate_email

from server.settings import config
from server.exceptions import *  # noqa

NAME_MIN_LEN = 2  # e.g.: Ed
NAME_MAX_LEN = 60  # e.g.: Hubert Blaine Wolfeschlegelsteinhausenbergerdorff, Sr. # noqa


class User(Document):
    name = StringField(required=True, min_length=NAME_MIN_LEN, max_length=NAME_MAX_LEN)  # noqa
    email = StringField(required=True)
    role = EnumField(StringField(), 'admin', 'user')
    enable = BoolField(default=True)

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
            raise Invalidname(name)

        self.name = name

        self.role = data.get('role', 'user')

        # PASSWORD
        password = data.get('password', '')
        if len(password) < 6:
            raise InvalidPasswordException(password)

        # HASHED PASSWORD
        hashed_password, salt = await self.gen_hashed_password(password)
        self.hashed_password = hashed_password
        self.salt = salt

    async def serialize(self):
        data = {}
        data['name'] = self.name
        data['email'] = self.email
        data['role'] = self.role
        data['enable'] = self.enable
        return data

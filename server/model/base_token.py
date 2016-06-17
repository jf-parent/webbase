from mongoalchemy.document import Document
from mongoalchemy.fields import *  # noqa

from server.utils import generate_token
from server.exceptions import *  # noqa


class BaseToken(Document):
    token = StringField(required=True)
    used = BoolField(default=False)

    def init(self, db_session, user):
        self.token = generate_token(20)

    def __eq__(self, target):
        return target == self.token

    def use(self, db_session, user, target):
        if self.used:
            raise TokenAlreadyUsedException(self.token)

        if target == self:
            if self.is_expire():
                raise TokenExpiredException()

            if self.is_belonging_to_user(user):
                self.used = True

                db_session.save(self, safe=True)

                return True
            else:
                raise TokenViolationException(
                    "{user} has not the right to the use the {token})".format(
                        user=user,
                        token=self.token
                    ))
        else:
            raise TokenInvalidException("{token} != {user_token}".format(
                        token=self.token,
                        user_token=target
                    ))

    def is_belonging_to_user(self, user):
        return True

    def is_expire(self):
        return False

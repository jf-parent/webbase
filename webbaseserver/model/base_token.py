from mongoalchemy.document import Document, Index
from mongoalchemy.fields import *  # noqa

from webbaseserver.utils import generate_token
from webbaseserver.exceptions import *  # noqa


class BaseToken(Document):
    token = StringField(required=True)
    used = BoolField(default=False)

    i_token = Index().ascending('token').unique()

    def init(self, context):
        self.token = generate_token(20)

    def __eq__(self, target):
        return target == self.token

    def use(self, context):
        target = context.get('target')
        user = context.get('user')
        db_session = context.get('db_session')

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

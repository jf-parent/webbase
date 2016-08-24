from mongoalchemy.document import Index
from mongoalchemy.fields import (
    StringField,
    BoolField,
    ObjectIdField
)

from server.utils import generate_token
from server import exceptions
from server.model.basemodel import BaseModel


class BaseToken(BaseModel):
    token = StringField(required=True)
    used = BoolField(default=False)
    user_uid = ObjectIdField(required=True)

    i_token = Index().ascending('token').unique()
    i_user_uid = Index().ascending('user_uid')

    def __eq__(self, target):
        return target == self.token

    async def sanitize_data(self, context):
        author = context.get('author')
        data = context.get('data')

        if author:
            if author.role == 'admin':
                return data
            else:
                return []
        else:
            return []

    async def serialize(self, context):
        data = {}
        data['token'] = self.token
        data['user_uid'] = str(self.user_uid)
        data['used'] = self.used
        return data

    async def method_autorized(self, context):
        author = context.get('author')

        if author.role == 'admin':
            return True
        else:
            return False

    async def validate_and_save(self, context):
        data = context.get('data')
        db_session = context.get('db_session')
        save = context.get('save', True)

        is_new = await self.is_new()

        # USED
        used = data.get('used')
        if used is not None:
            self.used = used

        # TOKEN
        token = data.get('token')
        if token:
            self.token = token
        else:
            self.token = generate_token(20)

        # USER UID
        user_uid = data.get('user_uid')
        if user_uid:
            self.user_uid = user_uid
        else:
            if is_new:
                raise exceptions.InvalidRequestException('Missing user_uid')

        if save:
            db_session.save(self, safe=True)

    def use(self, context):
        target = context.get('target')
        user = context.get('user')
        db_session = context.get('db_session')

        if self.used:
            raise exceptions.TokenAlreadyUsedException(self.token)

        if target == self:
            if self.is_expire():
                raise exceptions.TokenExpiredException()

            if self.is_belonging_to_user(user):
                self.used = True

                db_session.save(self, safe=True)

                return True
            else:
                raise exceptions.TokenViolationException(
                    "{user} has not the right to the use the {token})".format(
                        user=user,
                        token=self.token
                    ))
        else:
            raise exceptions.TokenInvalidException(
                "{token} != {user_token}"
                .format(
                    token=self.token,
                    user_token=target
                )
            )

    def is_belonging_to_user(self, user):
        return True

    def is_expire(self):
        return False

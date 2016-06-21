from mongoalchemy.fields import *  # noqa

from server.model.base_token import BaseToken


class EmailConfirmationToken(BaseToken):
    user_uid = StringField(required=True)

    def init(self, context):
        db_session = context.get('db_session')
        user = context.get('user')
        BaseToken.init(self, context)

        self.user_uid = user.get_uid()

        db_session.save(self, safe=True)

    def is_belonging_to_user(self, user):
        return self.user_uid == user.get_uid()

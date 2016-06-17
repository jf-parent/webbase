from mongoalchemy.document import Index
from mongoalchemy.fields import *  # noqa

from server.model.base_token import BaseToken


class EmailConfirmationToken(BaseToken):
    user_id = StringField(required=True)

    i_token = Index().ascending('token').unique()

    def init(self, db_session, user):
        BaseToken.init(self, db_session, user)

        self.user_id = user.get_uid()

        db_session.save(self, safe=True)

    def is_belonging_to_user(self, user):
        return self.user_id == user.get_uid()

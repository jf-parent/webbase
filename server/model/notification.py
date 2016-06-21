from datetime import datetime

from mongoalchemy.fields import *  # noqa

from server.model.base_model import BaseModel
from server.exceptions import *  # noqa


class Notification(BaseModel):
    user_uid = StringField(required=True)
    message = StringField()
    seen = BoolField(default=False)
    seen_timestamp = DateTimeField(default=None)

    def __repr__(self):
        try:
            _repr = "Notification <message:'{message}'><user_uid:'{user_uid}'>"  # noqa
            return _repr.format(
                    message=self.message,
                    user_uid=self.user_uid
                )
        except AttributeError:
            return "Notification uninitialized"

##############################################################################
# FUNC
##############################################################################

    async def sanitize_data(self, context):
        user = context.get('user')
        data = context.get('data')
        if user:
            if user.role == 'admin':
                return data
            else:
                editable_fields = ['seen']
                return {k: data[k] for k in data if k in editable_fields}

        return []

    async def validate_and_save(self, context):
        data = context.get('data')
        db_session = context.get('db_session')

        is_new = await self.is_new()

        # USER UID
        user_uid = data.get('user_uid')
        if is_new and not user_uid:
            raise InvalidRequestException(
                'Missing user_uid; cannot save Notification'
            )

        if user_uid:
            self.user_uid = user_uid

        # SEEN
        seen = data.get('seen')
        if seen:
            self.seen_timestamp = datetime.now()
            self.seen = seen

        # MESSAGE
        message = data.get('message')
        if message:
            self.message = message

        db_session.save(self, safe=True)

    async def method_autorized(self, context):
        method = context.get('method')
        user = context.get('user')

        # CREATE
        if method == 'create':
            if user.role == 'admin':
                return True
            else:
                return False

        # READ
        elif method == 'read':
            if user.get_uid() == self.user_uid:
                return True
            elif user.role == 'admin':
                return True
            else:
                return False

        # UPDATE
        elif method == 'update':
            if user.get_uid() == self.user_uid:
                return True
            elif user.role == 'admin':
                return True
            else:
                return False

        # DELETE
        elif method == 'delete':
            if user.role == 'admin':
                return True
            else:
                return False

        # ERROR
        else:
            raise Exception('Invalid method name: {method}'.format(
                    method=method
                )
            )

    async def serialize(self, context):
        data = {}

        data['uid'] = self.get_uid()
        data['message'] = self.message
        data['seen'] = self.seen
        if self.seen_timestamp:
            data['seen_timestamp'] = self.seen_timestamp.isoformat()
        else:
            data['seen_timestamp'] = None

        return data

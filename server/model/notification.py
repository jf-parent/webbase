from datetime import datetime

from mongoalchemy.fields import (
    ObjectIdField,
    DictField,
    DateTimeField,
    BoolField
)

from server.model.basemodel import BaseModel
from server import exceptions
from server.utils import SafeStringField


class Notification(BaseModel):
    user_uid = ObjectIdField(required=True)
    message = SafeStringField()
    template_data = DictField(SafeStringField(), default_empty=True)
    seen = BoolField(default=False)
    target_url = SafeStringField(default='')
    seen_timestamp = DateTimeField(default=None)

    def __repr__(self):
        try:
            _repr = "Notification <message:'{message}'><user_uid:'{user_uid}'><template_data:'{template_data}'>"  # noqa
            return _repr.format(
                    message=self.message,
                    template_data=self.template_data,
                    user_uid=self.user_uid
                )
        except AttributeError:
            return "Notification uninitialized"

##############################################################################
# FUNC
##############################################################################

    async def sanitize_data(self, context):
        author = context.get('author')
        data = context.get('data')
        if author:
            if author.role == 'admin':
                return data
            else:
                editable_fields = ['seen']
                return {k: data[k] for k in data if k in editable_fields}

        return []

    async def validate_and_save(self, context):
        data = context.get('data')
        db_session = context.get('db_session')
        save = context.get('save', True)

        is_new = await self.is_new()

        # USER UID
        user_uid = data.get('user_uid')
        if is_new and not user_uid:
            raise exceptions.InvalidRequestException(
                'Missing user_uid; cannot save Notification'
            )

        if user_uid:
            self.user_uid = user_uid

        # TARGET URL
        target_url = data.get('target_url')
        if target_url:
            self.target_url = target_url

        # SEEN
        seen = data.get('seen')
        if seen:
            self.seen_timestamp = datetime.now()
            self.seen = seen

        # MESSAGE
        message = data.get('message')
        if message:
            self.message = message
        else:
            if is_new:
                raise exceptions.InvalidRequestException(
                    'Missing message; cannot create Notification'
                )

        # TEMPLATE DATA
        template_data = data.get('template_data')
        if template_data:
            self.template_data = template_data

        if save:
            db_session.save(self, safe=True)

    async def method_autorized(self, context):
        method = context.get('method')
        author = context.get('author')

        # CREATE
        if method == 'create':
            if author.role == 'admin':
                return True
            else:
                return False

        # READ
        elif method == 'read':
            if author.get_uid() == str(self.user_uid):
                return True
            elif author.role == 'admin':
                return True
            else:
                return False

        # UPDATE
        elif method == 'update':
            if author.get_uid() == str(self.user_uid):
                return True
            elif author.role == 'admin':
                return True
            else:
                return False

        # DELETE
        elif method == 'delete':
            if author.role == 'admin':
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
        data['template_data'] = self.template_data
        data['target_url'] = self.target_url
        data['seen'] = self.seen
        if self.seen_timestamp:
            data['seen_timestamp'] = self.seen_timestamp.isoformat()
        else:
            data['seen_timestamp'] = None

        return data

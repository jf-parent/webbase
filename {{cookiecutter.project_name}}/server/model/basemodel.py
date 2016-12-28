# from abc import ABCMeta, abstractmethod

from mongoalchemy.document import Document
from mongoalchemy.fields import (
    CreatedField,
    ModifiedField
)


# TODO make it a meta class
class BaseModel(Document):

    # TIMESTAMP
    created_ts = CreatedField()
    modified_ts = ModifiedField()

    # @abstractmethod
    async def sanitize_data(self, context):
        raise NotImplemented()

    # @abstractmethod
    async def serialize(self, context):
        raise NotImplemented()

    # @abstractmethod
    async def method_autorized(self, context):
        raise NotImplemented()

    # @abstractmethod
    async def validate_and_save(self, context):
        raise NotImplemented()

    async def is_new(self):
        return not hasattr(self, 'mongo_id')

    def get_uid(self):
        return str(self.mongo_id)

    async def before_create(self, context):
        pass

    async def after_create(self, context):
        pass

    async def before_update(self, context):
        pass

    async def after_update(self, context):
        pass

    async def before_delete(self, context):
        pass

    async def after_delete(self, context):
        pass

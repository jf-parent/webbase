# from abc import ABCMeta, abstractmethod

from mongoalchemy.document import Document
from mongoalchemy.fields import *  # noqa


# TODO make it a meta class
class BaseModel(Document):

    # TIMESTAMP
    created_ts = CreatedField()
    modified_ts = ModifiedField()

    # @abstractmethod
    async def sanitize_data(self, method, data, user=False):
        raise NotImplemented()

    # @abstractmethod
    async def serialize(self, method, user=False):
        raise NotImplemented()

    # @abstractmethod
    async def method_autorized(self, method, user=False):
        raise NotImplemented()

    # @abstractmethod
    async def validate_and_save(self, db_session, data, **kwargs):
        raise NotImplemented()

    async def is_new(self):
        return not hasattr(self, 'mongo_id')

    def get_uid(self):
        return str(self.mongo_id)

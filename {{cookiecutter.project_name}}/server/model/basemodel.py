{% if cookiecutter.database == 'mongodb' %}
from mongoalchemy.document import Document
from mongoalchemy.fields import (
    CreatedField,
    ObjectIdField,
    ModifiedField
)
{%- else %}
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer
{%- endif %}

{% if cookiecutter.database == 'mongodb' %}
class BaseModel(Document):
{% else %}
class BaseModel(object):
{% endif %}
    # TIMESTAMP
    {%- if cookiecutter.database == 'mongodb' %}
    id = ObjectIdField(required=False, db_field='_id', on_update='ignore')
    created_ts = CreatedField()
    modified_ts = ModifiedField()
    {%- else %}
    id = Column(Integer, primary_key=True)
    created_ts = Column(DateTime, default=datetime.utcnow)
    modified_ts = Column(DateTime, onupdate=datetime.utcnow)
    {%- endif %}

    async def sanitize_data(self, context):
        raise NotImplemented()

    async def serialize(self, context):
        raise NotImplemented()

    async def method_autorized(self, context):
        raise NotImplemented()

    async def validate_and_save(self, context):
        raise NotImplemented()

    async def is_new(self):
        return not hasattr(self, 'id') \
            or getattr(self, 'id') is None

    def get_uid(self):
        return str(self.id)

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

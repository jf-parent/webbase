from mongoalchemy.fields import (
    StringField,
    IntField
)

from server.model.basemodel import BaseModel


class MigrationDummy(BaseModel):

    # field_1 = IntField()
    field_1 = StringField()

    # field_2 = StringField()
    # field_4 = IntField()

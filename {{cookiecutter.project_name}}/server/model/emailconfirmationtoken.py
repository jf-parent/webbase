from server.model.basetoken import BaseToken
{%- if cookiecutter.database != 'mongodb' %}
from server.database import Base
{%- endif %}

{% if cookiecutter.database == 'mongodb' %}
class Emailconfirmationtoken(BaseToken):
{% else %}
class Emailconfirmationtoken(Base, BaseToken):

    __tablename__ = 'email_confirmation_token'
{% endif %}
    def is_belonging_to_user(self, user):
        return str(self.user_uid) == user.get_uid()

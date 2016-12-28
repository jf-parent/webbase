import os
import sys

HERE = os.path.abspath(os.path.dirname(__file__))
ROOT = os.path.join(HERE, '..')
sys.path.append(ROOT)

from jobs.send_email import PySendPulse  # noqa
from server.utils import generate_token  # noqa
from server.settings import config  # noqa
from server.auth.user import User  # noqa

config.configure(False)
user = User()
user.name = ''  # CHANGEME
user.email = ''  # CHANGEME

# SEND EMAIL VALIDATION TOKEN
email_validation_token = generate_token(20)
user.email_validation_token = email_validation_token

# FORMAT EMAIL TEMPLATE
email = config.get('email_confirmation_email')
email['text'] = email['text'].format(
    email_validation_token=email_validation_token
)
email['html'] = email['html'].format(
    email_validation_token=email_validation_token
)
email['to'][0]['email'] = email['to'][0]['email'].format(
    user_email=user.email
)
email['to'][0]['name'] = email['to'][0]['name'].format(
    user_name=user.name
)

SPApiProxy = PySendPulse(
    config.get('REST_API_ID'),
    config.get('REST_API_SECRET')
)
SPApiProxy.smtp_send_mail(email)

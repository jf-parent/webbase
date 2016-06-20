from datetime import datetime

from dateutil.relativedelta import relativedelta
from mongoalchemy.document import Index
from mongoalchemy.fields import *  # noqa

from server.model.base_token import BaseToken
from server.settings import config
from jobs.send_email import send_email


class ResetPasswordToken(BaseToken):
    user_id = StringField(required=True)
    expiration_datetime = DateTimeField(required=True)

    def init(self, db_session, user, **kwargs):
        queue = kwargs.get('queue', False)

        BaseToken.init(self, db_session, user)

        NOW = datetime.now()
        # FOR TEST ONLY
        if config.get('ENV', 'production') == 'test':
            mock_expiration_date = kwargs.get('mock_expiration_date', NOW)
            NOW = mock_expiration_date

        TOMORROW = NOW + relativedelta(days=+1)

        self.user_id = user.get_uid()
        self.expiration_datetime = TOMORROW

        db_session.save(self, safe=True)

        if config.get('ENV', 'production') == 'production' and queue:
            # FORMAT EMAIL TEMPLATE
            email = config.get('reset_password_email')
            email['text'] = email['text'].format(
                reset_password_token=self.token
            )
            email['html'] = email['html'].format(
                reset_password_token=self.token
            )
            email['to'][0]['email'] = email['to'][0]['email'].format(
                user_email=user.email
            )
            email['to'][0]['name'] = email['to'][0]['name'].format(
                user_name=user.name
            )

            # ADD THE SEND EMAIL TO THE QUEUE
            queue.enqueue(
                send_email,
                config.get('REST_API_ID'),
                config.get('REST_API_SECRET'),
                email
            )

    def is_belonging_to_user(self, user):
        return self.user_id == user.get_uid()

    def is_expire(self):
        NOW = datetime.now()
        if self.expiration_datetime < NOW:
            return True
        else:
            return False

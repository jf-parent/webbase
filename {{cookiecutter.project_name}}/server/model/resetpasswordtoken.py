from datetime import datetime

from dateutil.relativedelta import relativedelta
import dateutil.parser
from mongoalchemy.fields import (
    BoolField,
    DateTimeField
)

from server.model.basetoken import BaseToken
from server.settings import config
from jobs.send_email import send_email


class Resetpasswordtoken(BaseToken):
    expiration_datetime = DateTimeField(required=True)
    password_reset = BoolField(default=False)

    async def validate_and_save(self, context):
        NOW = datetime.now()

        queue = context.get('queue')
        data = context.get('data')
        user = context.get('user')
        db_session = context.get('db_session')
        save = context.get('save', True)

        # BaseToken validate_and_save
        new_context = context.copy()
        new_context['save'] = False
        await super(Resetpasswordtoken, self).validate_and_save(new_context)

        # FOR TEST ONLY
        if config.get('env', 'production') == 'test':
            mock_expiration_date = context.get('mock_expiration_date', NOW)
            NOW = mock_expiration_date

        # EXPIRATION DATETIME
        expiration_datetime = data.get('expiration_datetime')
        if expiration_datetime:
            self.expiration_datetime = dateutil.parser.parse(
                expiration_datetime
            )
        else:
            TOMORROW = NOW + relativedelta(days=+1)
            self.expiration_datetime = TOMORROW

        # PASSWORD RESET
        password_reset = data.get('password_reset')
        if password_reset is not None:
            self.password_reset = password_reset

        # SAVE
        if save:
            db_session.save(self, safe=True)

        # FORMAT EMAIL TEMPLATE
        if config.get('env', 'production') == 'production' \
                and hasattr(queue, 'enqueue'):
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
                config.get('rest_api_id'),
                config.get('rest_api_secret'),
                email
            )

    async def serialize(self, context):
        data = {}
        data['token'] = self.token
        data['user_uid'] = str(self.user_uid)
        data['expiration_datetime'] = self.expiration_datetime.isoformat()
        data['used'] = self.used
        return data

    def is_belonging_to_user(self, user):
        return str(self.user_uid) == user.get_uid()

    def is_expire(self):
        NOW = datetime.now()
        if self.expiration_datetime < NOW:
            return True
        else:
            return False

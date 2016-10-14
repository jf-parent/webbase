from server.model.migrationbase import MigrationBase
from server.model.migrationdummy import MigrationDummy


class Migration(MigrationBase):
    def create_dummy_data(self, session):
        print('creating dummy data...')
        for i in range(20):
            dummy = MigrationDummy()
            dummy.field_1 = 'test %s' % i
            session.save(dummy, safe=True)

    def update(self, session):
        # self.create_dummy_data(session)

        print('updated')

        session.query(MigrationDummy)\
            .find_and_modify()\
            .set(MigrationDummy.field_1, 'test new')\
            .upsert()\
            .execute()

    def roll_back(self, session):
        print('rolled back')

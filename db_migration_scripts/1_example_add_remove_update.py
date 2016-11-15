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

        self.add_field('MigrationDummy', 'field_2', '')

    def roll_back(self, session):
        self.remove_field('MigrationDummy', 'field_2')

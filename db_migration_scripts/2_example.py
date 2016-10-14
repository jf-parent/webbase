from server.model.migrationbase import MigrationBase


class Migration(MigrationBase):
    def update(self, session):
        print('updated')

    def roll_back(self, session):
        print('rolled back')

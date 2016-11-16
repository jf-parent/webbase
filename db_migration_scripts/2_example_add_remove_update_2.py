from server.model.migrationbase import MigrationBase


class Migration(MigrationBase):
    def update(self, session):
        self.add_field('MigrationDummy', 'field_3', '')

    def roll_back(self, session):
        self.remove_field('MigrationDummy', 'field_3')

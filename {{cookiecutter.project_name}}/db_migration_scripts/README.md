# MIGRATION SYSTEM FOR MONGO

```bash
./db_migrate --help
```

## CREATE A NEW MIGRATION SCRIPT

```bash
make new-migration-script
vim db_migration_scripts/1_name_describing_your_changes.py
```

## EXECUTING ALL MIGRATION SCRIPT THAT DID NOT RUN BEFORE

* the migration script that runned on the database are save in `db.migration_script_history`

```bash
./db_migrate.py all
```

## EXECUTING ONE MIGRATION SCRIPT

```bash
./db_migrate.py one "db_migration_scripts/1_name_describing_your_changes.py"
```

## FORCING THE EXECUTION OF A  MIGRATION SCRIPT

```bash
./db_migrate.py force "db_migration_scripts/1_name_describing_your_changes.py"
```

## MIGRATION SCRIPT

```python
from server.model.migrationbase import MigrationBase


class Migration(MigrationBase):
    def update(self, session):
        self.add_field('<Modelname>', '<new_field_name>', '<default_value>')

    def roll_back(self, session):
        self.remove_field('<Modelname>', '<new_field_name>')
```

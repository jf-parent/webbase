#!/usr/bin/env python

import importlib.util
from glob import glob
import os
import pickle

from server.settings import config

# CONFIGURE
config.configure()

# PATHS
ROOT = os.path.abspath(os.path.dirname(__file__))
migration_scripts_path = os.path.join(
    ROOT,
    'db_migration_scripts'
)
migration_history_path = os.path.join(
    ROOT,
    '.db-migration-history.pkl'
)

# LOADING HISTORY
migration_history = []
if os.path.exists(migration_history_path):
    with open(migration_history_path, 'rb') as fd:
        migration_history = pickle.load(fd)

# MIGRATION SCRIPTS
migration_scripts = glob(os.path.join(
    migration_scripts_path,
    "*.py"
))
new_migration_scripts = [m for m in migration_scripts if m not in migration_history]  # noqa
for migration_script in new_migration_scripts:
    name = migration_script.split(os.sep)[-1]
    spec = importlib.util.spec_from_file_location(
        "db_migration_scripts",
        migration_script
    )
    migration_cls = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration_cls)
    migration = migration_cls.Migration(
        name,
        config.get('mongo_database_name')
    )
    migration.run()
    migration_history.append(migration_script)
else:
    print('No more migration script to execute.')

# DUMPING HISTORY
with open(migration_history_path, 'wb') as fd:
    pickle.dump(migration_history, fd)

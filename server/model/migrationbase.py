import traceback
from datetime import datetime
import os
from tempfile import gettempdir
import subprocess

from dateutil import tz
from mongoalchemy.session import Session


class MigrationBase(object):
    def __init__(self, name, db_name):
        self.name = name
        self.db_name = db_name
        self.session = Session.connect(
            db_name,
            tz_aware=True,
            timezone=tz.gettz('UTC')
        )

    def run(self):
        try:
            print(
                "[*]Executing script: {name}..."
                .format(name=self.name)
            )
            self.backup_db()
            self.update(self.session)
            print("[*]Script executed.")
        except Exception as e:
            tb = traceback.format_exc()
            print("Exception in script: %s" % tb)
            print("Rolling back...")
            try:
                self.roll_back(self.session)
                print("Rolled back")
            except Exception as e:
                print("Exception in rolling back function: %s" % tb)
                print("Aborting...")
                self.restore_db()

    def backup_db(self):
        ts = datetime.now().isoformat()
        self.backup_path = os.path.join(
            gettempdir(),
            'mongodb-{name}-{ts}'
            .format(
                name=self.db_name,
                ts=ts
            )
        )
        print('Backing up database to path %s ...' % self.backup_path)
        mongodump_cmd = [
            'mongodump',
            '--db',
            self.db_name,
            '--out',
            self.backup_path
        ]
        process = subprocess.Popen(
            mongodump_cmd,
            stdout=subprocess.PIPE
        )
        output, error = process.communicate()

    def restore_db(self):
        print('Restoring up database to path %s ...' % self.backup_path)
        mongodump_cmd = [
            'mongorestore',
            '--db',
            self.db_name,
            self.backup_path
        ]
        process = subprocess.Popen(
            mongodump_cmd,
            stdout=subprocess.PIPE
        )
        output, error = process.communicate()

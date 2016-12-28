import traceback
from datetime import datetime
import os
from tempfile import gettempdir
import subprocess

from dateutil import tz
from mongoalchemy.session import Session
from pymongo import MongoClient


class MigrationBase(object):
    def __init__(self, name, db_name):
        self.name = name
        self.db_name = db_name
        # TODO get the mongoalchemy session
        # from server/utils:get_mongoalchemy_session
        self.session = Session.connect(
            db_name,
            tz_aware=True,
            timezone=tz.gettz('UTC')
        )
        # TODO get the mongo client from server/utils:get_mongo_client
        self.mongo_client = MongoClient()
        self.db = self.mongo_client[self.db_name]

    def validate_model_name(self, model_name):
        if model_name not in self.db.collection_names():
            raise Exception(
                "{model_name} not found in the database"
                .format(model_name=model_name)
            )

    def add_field(self, model_name, field_name, default_value):
        self.validate_model_name(model_name)

        cursor = self.db[model_name].find(
            {
                field_name: {
                    '$exists': False
                }
            }
        )
        count = cursor.count()
        if count:
            print(
                'Found {count} record to update'
                .format(count=count)
            )

            self.db[model_name].update_many(
                {field_name: {'$exists': False{{"}}"}},
                {"$set": {field_name: default_value{{"}}"}}
            )
        else:
            print('No record found WITHOUT the field to ADD: skipping operation...')  # noqa

    def remove_field(self, model_name, field_name):
        self.validate_model_name(model_name)

        cursor = self.db[model_name].find(
            {
                field_name: {
                    '$exists': True
                }
            }
        )
        count = cursor.count()
        if count:
            print(
                '[REMOVE_FIELD]Found {count} record to update'
                .format(count=count)
            )
            self.db[model_name].update_many(
               {field_name: {'$exists': True{{"}}"}},
               {"$unset": {field_name: ""}}
            )
        else:
            print('No record found WITH the field to REMOVE: skipping operation...')  # noqa

    def run(self):
        try:
            print(
                "[*]Executing script: {name}..."
                .format(name=self.name)
            )
            self.backup_db()
            self.update(self.session)
            print("[*]Script executed.")
            return True
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
        else:
            return False

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

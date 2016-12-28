#!/usr/bin/env python

import importlib.util
from glob import glob
import os

from pymongo import MongoClient
import click

from server.settings import config

# CONFIGURE
config.configure()

# PATHS
ROOT = os.path.abspath(os.path.dirname(__file__))
migration_scripts_path = os.path.join(
    ROOT,
    'db_migration_scripts'
)

# TODO get the mongo client from server/utils:get_mongo_client
mongo_client = MongoClient()
db = mongo_client[config.get('mongo_database_name')]


def run_migration_script(migration_script):
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
    ret = migration.run()
    if ret:
        click.echo(
            click.style(
                '{migration_script} succeeded!'
                .format(migration_script=migration_script),
                bg='green'
            )
        )
    else:
        click.echo(
            click.style(
                '{migration_script} failed!'
                .format(migration_script=migration_script),
                bg='red'
            )
        )

    return ret


def add_migration_script_to_history(migration_script):
    db['migration_script_history'].update(
        {'name': migration_script},
        {'name': migration_script},
        upsert=True
    )


def is_migration_script_in_history(migration_script):
    if 'migration_script_history' in db.collection_names():
        ret = db['migration_script_history'].find_one(
            {'name': migration_script}
        )
        if ret:
            return True
        else:
            return False
    else:
        return False


def to_int(value):
    try:
        return int(value)
    except ValueError:
        raise Exception(
            'Migration script should start with a number, e.g.: 1_whatever.py'
        )


@click.group()
def cli():
    pass


@click.command()
def all():
    click.echo('Migrating all...')
    # MIGRATION SCRIPTS
    migration_scripts = glob(os.path.join(
        migration_scripts_path,
        "*.py"
    ))
    migration_scripts.sort(
        key=lambda x: to_int(x.split(os.sep)[-1][0])
    )
    for migration_script in migration_scripts:
        if not is_migration_script_in_history(migration_script):
            ret = run_migration_script(migration_script)
            if ret:
                add_migration_script_to_history(migration_script)
            else:
                click.echo(
                    click.style(
                        'Aborting following migration script. Fix {migration_script} before continuing'  # noqa
                        .format(migration_script=migration_script),
                        bg='red'
                    )
                )
                exit(1)
    else:
        click.echo(
            click.style(
                'No migration script to execute.',
                bg='green'
            )
        )


@click.command()
@click.argument('migration_script_name')
def one(migration_script_name):
    click.echo(
        'Migration using script "{migration_script_name}"'
        .format(migration_script_name=migration_script_name)
    )

    migration_script = os.path.join(
        ROOT,
        migration_script_name
    )
    if os.path.exists(migration_script):
        if not is_migration_script_in_history(migration_script):
            run_migration_script(migration_script)
        else:
            click.echo(
                click.style(
                    'Migration script already runned. Skipping... Use `db_migrate.py force <script_name>` if you want to force this script.',  # noqa
                    bg='yellow'
                )
            )
    else:
        click.echo(
            click.style(
                '{migration_script} not found'
                .format(migration_script=migration_script),
                bg='red'
            )
        )


@click.command()
@click.argument('migration_script_name')
def force(migration_script_name):
    click.echo(
        'Migration forcing script "{migration_script_name}"'
        .format(migration_script_name=migration_script_name)
    )

    migration_script = os.path.join(
        ROOT,
        migration_script_name
    )
    if os.path.exists(migration_script):
        run_migration_script(migration_script)
    else:
        click.echo(
            click.style(
                '{migration_script} not found'
                .format(migration_script=migration_script),
                bg='red'
            )
        )

cli.add_command(all)
cli.add_command(force)
cli.add_command(one)

if __name__ == '__main__':
    cli()

from django.core.management.base import BaseCommand
from django.db import connection
from django.apps import apps

class Command(BaseCommand):
    help = 'Initializes the database schema for a new election database.'

    def add_arguments(self, parser):
        parser.add_argument('db_name', type=str, help='Database name to initialize')

    def handle(self, *args, **options):
        db_name = options['db_name']
        self.stdout.write(self.style.SUCCESS(f'Initializing database: {db_name}'))

        # Set the database alias temporarily
        connection.ensure_connection(alias=db_name)
        with connection.schema_editor(database=db_name) as schema_editor:
            for model in apps.get_models():
                if model._meta.app_label == 'electionData' and not model._meta.managed:
                    self.stdout.write(self.style.SUCCESS(f'Creating table for {model._meta.object_name}'))
                    schema_editor.create_model(model)

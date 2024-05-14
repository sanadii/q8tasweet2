from django.core.management.base import BaseCommand
from django.db import connection
from django.apps import apps
from apps.elections.models import Election
from contextlib import contextmanager

@contextmanager
def schema_context(slug):
    schema_name = slug.replace("-", "_")
    with connection.cursor() as cursor:
        cursor.execute(f'SET search_path TO "{schema_name}"')
        yield
        cursor.execute('SET search_path TO public')

class Command(BaseCommand):
    help = "Checks the election database and creates a schema with tables if has_schema is true."

    def handle(self, *args, **options):
        elections = Election.objects.filter(has_schema=True)
        for election in elections:
            self.create_schema(election.slug)
            self.create_tables(election.slug)

    def create_schema(self, slug):
        schema_name = slug.replace("-", "_")

        try:
            with connection.cursor() as cursor:
                # Check if schema already exists
                cursor.execute(
                    "SELECT schema_name FROM information_schema.schemata WHERE schema_name = %s",
                    [schema_name],
                )
                if cursor.fetchone():
                    self.stdout.write(self.style.SUCCESS(f"Schema '{schema_name}' already exists"))
                    return

                # Create new schema
                cursor.execute(f'CREATE SCHEMA "{schema_name}"')
                self.stdout.write(self.style.SUCCESS(f"Schema '{schema_name}' created successfully"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error creating schema '{schema_name}': {str(e)}"))

    def create_tables(self, slug):
        schema_name = slug.replace("-", "_")
        model_definitions = [
            {"model_name": "Area", "app_label": "areas"},
            {"model_name": "Committee", "app_label": "committees"},
            {"model_name": "CommitteeSite", "app_label": "committees"},
            {"model_name": "Elector", "app_label": "electors"},
        ]
        results = {}

        with schema_context(slug):
            with connection.schema_editor() as schema_editor:
                for model_def in model_definitions:
                    model_name = model_def["model_name"]
                    app_label = model_def["app_label"]
                    try:
                        Model = apps.get_model(app_label, model_name)
                    except LookupError:
                        self.stdout.write(self.style.ERROR(f"Model '{model_name}' not found in '{app_label}' app"))
                        continue

                    table_name = Model._meta.db_table
                    try:
                        if not self.table_exists(table_name):
                            schema_editor.create_model(Model)
                            results[table_name] = "Created successfully"
                        else:
                            results[table_name] = "Table already exists"
                    except Exception as e:
                        results[table_name] = f"Failed to create table: {str(e)}"

        for table, result in results.items():
            self.stdout.write(self.style.SUCCESS(f"Table '{table}': {result}"))

    def table_exists(self, table_name):
        """Check if a table exists in the current schema."""
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT to_regclass('{table_name}');")
            return cursor.fetchone()[0] is not None

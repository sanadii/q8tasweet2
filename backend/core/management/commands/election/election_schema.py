# core/management/commands/import_election_schema.py

from django.db import connection, transaction
from apps.schemas.views_helper import get_election, get_schema_models_to_add, create_schema_tables
from utils.schema import schema_context

def create_election_schema(file_name, command):
    schema_name = file_name.replace("-", "_")  # Format the schema name properly

    try:
        # Get the election object from the default schema
        election = get_election(file_name)
        if not election:
            command.stdout.write(command.style.ERROR(f"Election with slug '{file_name}' not found"))
            return

        command.stdout.write(command.style.SUCCESS(f"Election: {election}"))

        # Ensure the schema exists or create it
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT schema_name FROM information_schema.schemata WHERE schema_name = %s",
                [schema_name],
            )
            if cursor.fetchone():
                command.stdout.write(command.style.SUCCESS(f"Schema '{schema_name}' already exists"))
            else:
                cursor.execute(f'CREATE SCHEMA "{schema_name}"')
                command.stdout.write(command.style.SUCCESS(f"Schema '{schema_name}' created successfully"))

        # Add tables to the schema
        models = get_schema_models_to_add(election)
        election_category = election.category.id

        with schema_context(schema_name):
            with transaction.atomic():
                with connection.schema_editor() as schema_editor:
                    results = create_schema_tables(schema_editor, models)
                    for table, status in results.items():
                        command.stdout.write(command.style.SUCCESS(f"{table}: {status}"))

                    for Model in models:
                        if hasattr(Model, "add_dynamic_fields"):
                            instance = Model()
                            instance.add_dynamic_fields(election_category, schema_editor)

    except Exception as e:
        command.stdout.write(command.style.ERROR(f"Failed to create schema '{schema_name}' or add tables: {e}"))

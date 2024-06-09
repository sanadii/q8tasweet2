from django.core.management.base import BaseCommand
from django.db import connection
from apps.elections.models import Election
from rest_framework.response import Response

from contextlib import contextmanager
from utils.schema import schema_context
from apps.schemas.views_helper import (
    get_schema_models_to_add,
    create_schema_tables,
    get_election,
)

@contextmanager
def schema_context(schema_name):
    if schema_name:
        try:
            with connection.cursor() as cursor:
                cursor.execute(f"SET search_path TO {schema_name}")
            yield
        finally:
            with connection.cursor() as cursor:
                cursor.execute("SET search_path TO public")
    else:
        yield


class Command(BaseCommand):
    help = "Create schema and related tables for the given election."

    def add_arguments(self, parser):
        parser.add_argument("election", type=str, help="Election identifier")

    def create_schema(self, schema_name):
        with connection.cursor() as cursor:
            cursor.execute(f'CREATE SCHEMA IF NOT EXISTS "{schema_name}"')

    def handle(self, *args, **options):
        election_slug = options["election"]
        election = get_election(election_slug)
        print("election is: ", election)

        if not election_slug:
            return Response({"error": "Election not found"}, status=404)

        election_schema = election_slug.replace("-", "_")
        self.create_schema(election_schema)


        models = get_schema_models_to_add(election)
        election_category = election.category.id

        with schema_context(election_schema):
            with connection.schema_editor() as schema_editor:
                results = create_schema_tables(schema_editor, models)

                for Model in models:
                    if hasattr(Model, "add_dynamic_fields"):
                        instance = Model()
                        instance.add_dynamic_fields(election_category, schema_editor)


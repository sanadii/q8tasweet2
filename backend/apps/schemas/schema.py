from contextlib import contextmanager
from django.db import connection
from rest_framework.response import Response
from django.apps import apps


@contextmanager
def schema_context(schema):
    """
    3 main steps in the schema context
    if election exist: to check if election exist to fetch for the schema
    if schema existL to check if the schema exist to fetch for the tables
    if table exist: to check if the table exist to get the data from the tables
    """
    cursor = connection.cursor()
    schema_name = schema.replace(
        "-", "_"
    )  # Convert the slug to a valid schema name format using underscores.
    print("schema:: ", schema_name)

    try:
        # Check and set the schema
        cursor.execute("SHOW search_path;")
        old_schema = cursor.fetchone()[0]
        new_search_path = f'"{schema_name}", public'  # Quote the schema name to handle special characters.
        cursor.execute(f"SET search_path TO {new_search_path};")

        # Verify schema existence
        cursor.execute(
            "SELECT schema_name FROM information_schema.schemata WHERE schema_name = %s",
            [schema_name],
        )
        if cursor.fetchone() is None:
            yield Response({"error": "Schema does not exist"}, status=404)
            return

        # Check if the election exists within the context of the current schema
        try:
            election = apps.get_model(
                "elections", "Election"
            )  # Dynamically get the Election model
            yield election  # Yielding election object if it exists
        except election.DoesNotExist:
            yield Response({"error": "Election not found"}, status=404)
            return

    finally:
        # Restore the original search path
        cursor.execute(f"SET search_path TO {old_schema};")





def table_exists(table_name):
    """Check if a table exists in the current schema."""
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT to_regclass('{table_name}');")
        return cursor.fetchone()[0] is not None
    
    
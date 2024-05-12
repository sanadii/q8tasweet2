from contextlib import contextmanager
from django.db import connection
from apps.elections.models import Election
from rest_framework.response import Response


@contextmanager
def schema_context(request, schema):
    """
    3 main steps in the schema context
    if election exist: to check if election exist to fetch for the schema
    if schema existL to check if the schema exist to fetch for the tables
    if table exist: to check if the table exist to get the data from the tables
    """
    print("schema:: ", schema)
    cursor = connection.cursor()
    schema_name = schema.replace(
        "-", "_"
    )  # Convert the slug to a valid schema name format using underscores.
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
            election = Election.objects.get(slug=schema)
            yield election  # Yielding election object if it exists
        except Election.DoesNotExist:
            yield Response({"error": "Election not found"}, status=404)
            return

    finally:
        # Restore the original search path
        cursor.execute(f"SET search_path TO {old_schema};")


# from contextlib import contextmanager
# from django.db import connection
# from django.http import Http404
# from apps.elections.models import Election
# from rest_framework.response import Response

# @contextmanager
# def schema_context(request, slug):
#     cursor = connection.cursor()
#     schema_name = f'"{slug.replace("-", "_")}"'  # Transform slug into a schema name and quote it
#     try:
#         # Set the schema
#         cursor.execute("SHOW search_path;")
#         old_schema = cursor.fetchone()[0]
#         new_search_path = f'{schema_name}, public'
#         cursor.execute(f"SET search_path TO {new_search_path};")

#         # Check if the election exists
#         try:
#             election = Election.objects.get(slug=slug)
#         except Election.DoesNotExist:
#             request.response = Response({"error": "Election not found"}, status=404)
#             return  # Stop the context manager from yielding

#         yield election  # Optionally pass the election object to the caller

#     finally:
#         # Restore the original search path regardless of how the try block exits
#         cursor.execute(f"SET search_path TO {old_schema};")

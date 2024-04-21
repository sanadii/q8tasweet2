from contextlib import contextmanager
from django.db import connection
from django.http import Http404
from apps.elections.models import Election
from rest_framework.response import Response

@contextmanager
def schema_context(request, slug):
    cursor = connection.cursor()
    schema_name = f'"{slug.replace("-", "_")}"'  # Transform slug into a schema name and quote it
    try:
        # Set the schema
        cursor.execute("SHOW search_path;")
        old_schema = cursor.fetchone()[0]
        new_search_path = f'{schema_name}, public'
        cursor.execute(f"SET search_path TO {new_search_path};")

        # Check if the election exists
        try:
            election = Election.objects.get(slug=slug)
        except Election.DoesNotExist:
            request.response = Response({"error": "Election not found"}, status=404)
            return  # Stop the context manager from yielding

        yield election  # Optionally pass the election object to the caller

    finally:
        # Restore the original search path regardless of how the try block exits
        cursor.execute(f"SET search_path TO {old_schema};")

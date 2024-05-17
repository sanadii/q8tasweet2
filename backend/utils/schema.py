from contextlib import contextmanager
from django.db import connection
from apps.elections.models import Election
from rest_framework.response import Response
from psycopg2 import OperationalError, ProgrammingError

from apps.areas.models import Area
from apps.committees.models import CommitteeSite, Committee

# Schema Serializers
from apps.areas.serializers import AreaSerializer
from apps.committees.serializers import CommitteeSerializer, CommitteeSiteSerializer

from django.apps import apps


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


# Fetching model verbose_name_plural
model_verbose_names = {
    model._meta.db_table: model._meta.verbose_name_plural for model in apps.get_models()
}


def get_schema_details_and_content(context, request, slug, response_data):
    with schema_context(request, slug) as election:
        if isinstance(election, Response):
            return election

        try:
            schema_name = slug.replace("-", "_")
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT schemaname, tablename
                    FROM pg_catalog.pg_tables
                    WHERE schemaname = %s
                """,
                    [schema_name],
                )
                schema_tables = [
                    {
                        "schema": row[0],
                        "table": row[1],
                        "name": model_verbose_names.get(row[1], None),
                    }
                    for row in cursor.fetchall()
                ]

            response_data["schemaDetails"] = {
                "schemaName": schema_name,
                "schemaTables": schema_tables,
            }

        except (OperationalError, ProgrammingError) as e:
            response_data["schemaDetailsError"] = str(e)

        try:
            election_committee_sites = CommitteeSite.objects.prefetch_related('committee_site_committees').all()
            if election_committee_sites.exists():
                committees_data = CommitteeSiteSerializer(
                    election_committee_sites, many=True, context=context
                ).data
                response_data["election_committee_sites"] = committees_data
        except Exception as e:
            response_data["committeeDataError"] = str(e)

        try:
            election_committee_areas = Area.objects.all()
            if election_committee_areas.exists():
                areas_data = AreaSerializer(
                    election_committee_areas, many=True, context=context
                ).data
                response_data["election_areas"] = areas_data
        except Exception as e:
            response_data["areaDataError"] = str(e)

    return Response(response_data)

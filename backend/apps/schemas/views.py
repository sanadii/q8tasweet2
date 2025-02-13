from contextlib import contextmanager
from django.http import JsonResponse
from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Apps
from apps.elections.models import Election


from utils.schema import schema_context, table_exists
from apps.schemas.views_helper import (
    get_schema_models_to_add,
    create_schema_tables,
    get_election,
)


class AddElectionSchema(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        schema_name = slug.replace("-", "_")  # Format the schema name properly

        try:
            with connection.cursor() as cursor:
                # Check if schema already exists
                cursor.execute(
                    "SELECT schema_name FROM information_schema.schemata WHERE schema_name = %s",
                    [schema_name],
                )
                if cursor.fetchone():
                    return Response({"message": "Schema already exists"}, status=200)

                # Create new schema
                cursor.execute(f'CREATE SCHEMA "{schema_name}"')
            return Response({"message": "Schema created successfully"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# depends on ElectionMethod, ElectionResult
# Election Method
class AddSchemaTables(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        election = get_election(slug)

        if not election:
            return Response({"error": "Election not found"}, status=404)

        models = get_schema_models_to_add(election)
        election_category = election.category.id

        with schema_context(slug):
            with connection.schema_editor() as schema_editor:
                results = create_schema_tables(schema_editor, models)

                for Model in models:
                    if hasattr(Model, "add_dynamic_fields"):
                        instance = Model()
                        instance.add_dynamic_fields(election_category, schema_editor)

        return Response({"results": results}, status=200)


# class AddElectionSchemaTables(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")

#         with schema_context(slug) as election:
#             if hasattr(request, "response"):
#                 return request.response  # Return the early response if set

#             results = {}
#             try:
#                 with transaction.atomic(), connection.schema_editor() as schema_editor:
#                     models = [Committee, CommitteeSite, Elector]  # Make sure these models are imported
#                     for Model in models:
#                         table_name = Model._meta.db_table
#                         if not self.table_exists(table_name):
#                             schema_editor.create_model(Model)
#                             results[table_name] = "Created successfully"
#                         else:
#                             aligned, details = self.check_table_schema(Model, table_name, schema_editor)
#                             if aligned:
#                                 results[table_name] = "Table already exists and is up-to-date"
#                             else:
#                                 results[table_name] = f"Table schema mismatch: {details}"
#             except Exception as e:
#                 # Log error, Django will handle the transaction rollback
#                 results['error'] = str(e)

#             return Response({"results": results}, status=200)

#     def table_exists(self, table_name):
#         with connection.cursor() as cursor:
#             cursor.execute(f"SELECT to_regclass('{table_name}');")
#             return cursor.fetchone()[0] is not None

#     def check_table_schema(self, model, table_name, schema_editor):
#         """Check and update the table schema to match the model definition."""
#         ignored_columns = ['committee_site_id']  # List of columns to ignore for schema comparison

#         columns = self.get_table_columns(table_name)
#         model_fields = {field.name: (field, field.db_type(connection)) for field in model._meta.fields}
#         mismatches = {'missing_in_db': [], 'extra_in_db': [], 'type_mismatch': [], 'already_exists': []}

#         model_field_names = set(model_fields.keys()) - set(ignored_columns)
#         column_names = set(columns.keys()) - set(ignored_columns)

#         # Check for missing columns and add them
#         for field_name in model_field_names - column_names:
#             field = model_fields[field_name][0]
#             schema_editor.add_field(model, field)
#             mismatches['missing_in_db'].append(field_name)

#         # Check for columns that shouldn't be added again
#         for field_name in model_field_names & column_names:
#             field, expected_type = model_fields[field_name]
#             if columns[field_name] != expected_type:
#                 mismatches['type_mismatch'].append(field_name)
#             else:
#                 mismatches['already_exists'].append(field_name)

#         return False if mismatches['missing_in_db'] or mismatches['type_mismatch'] else True, mismatches

#     def get_table_columns(self, table_name):
#         """Retrieve column info from the table schema."""
#         with connection.cursor() as cursor:
#             cursor.execute("""
#                 SELECT column_name, data_type
#                 FROM information_schema.columns
#                 WHERE table_name = %s;
#             """, [table_name])
#             return {row[0]: row[1] for row in cursor.fetchall()}

#     def compare_field_type(self, field, column_type):
#         if isinstance(field, ForeignKey):
#             return column_type in ['integer', 'bigint']
#         return field.db_type(connection) in column_type


class GetElectionSchemaDetails(APIView):
    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        schema_name = slug.replace("-", "_")

        with schema_context(schema_name):
            try:
                tables = connection.introspection.table_names()
                return JsonResponse(
                    {"data": {"schemaName": schema_name, "schemaTables": tables}},
                    status=200,
                )
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)


# import os

# from django.conf import settings
# from django.http import JsonResponse
# from django.db import connections, connection
# from django.db.utils import ProgrammingError
# from django.views import View

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated

# import psycopg2
# from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# from apps.elections.models import Election
# from apps.schemas.committees.models import Committee, Committee
# from apps.schemas.electors.models import Elector


# class AddElectionSchema(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")

#         try:
#             # Check if the election exists
#             Election.objects.get(slug=slug)
#         except Election.DoesNotExist:
#             return Response({"error": "Election not found"}, status=404)

#         # Define the schema name with safe naming
#         schema_name = slug.replace("-", "_")

#         # Connect to the default database to execute creation of a new schema
#         try:
#             conn = psycopg2.connect(
#                 dbname=settings.DATABASES["default"]["NAME"],
#                 user=settings.DATABASES["default"]["USER"],
#                 password=settings.DATABASES["default"]["PASSWORD"],
#                 host=settings.DATABASES["default"]["HOST"],
#                 port=settings.DATABASES["default"]["PORT"],
#             )
#             conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
#             cur = conn.cursor()

#             # Check if the schema already exists
#             cur.execute(f"SELECT 1 FROM pg_namespace WHERE nspname = '{schema_name}'")
#             exists = cur.fetchone()
#             if exists:
#                 return Response({"message": "Schema already exists"}, status=200)

#             # Create the new schema
#             cur.execute(f'CREATE SCHEMA "{schema_name}"')
#             cur.close()
#             conn.close()

#             return Response({"message": "Schema created successfully"}, status=201)

#         except Exception as e:
#             return Response({"error": str(e)}, status=500)


# class GetElectionSchemaDetails(APIView):
#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")
#         schema_name = slug.replace("-", "_")  # Convert slug to schema name

#         try:
#             # Check if the schema exists
#             with connection.cursor() as cursor:
#                 cursor.execute(
#                     "SELECT schema_name FROM information_schema.schemata WHERE schema_name = %s",
#                     [schema_name],
#                 )
#                 schema_exists = cursor.fetchone()

#             if not schema_exists:
#                 return JsonResponse(
#                     {"error": f"Schema '{schema_name}' does not exist"}, status=404
#                 )

#             # Fetch tables belonging to the schema
#             with connection.cursor() as cursor:
#                 cursor.execute(
#                     """
#                     SELECT table_name
#                     FROM information_schema.tables
#                     WHERE table_schema = %s
#                 """,
#                     [schema_name],
#                 )
#                 tables = [row[0] for row in cursor.fetchall()]

#             response_data = {
#                 "data": {"schemaName": schema_name, "schemaTables": tables}
#             }

#             return JsonResponse(response_data, status=200)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)


# class AddElectionSchemaTables(View):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")
#         schema_name = slug.replace("-", "_")  # Ensure the schema name is safe

#         try:
#             # Ensure that the schema exists for the given slug
#             with connections["default"].cursor() as cursor:
#                 cursor.execute(f'CREATE SCHEMA IF NOT EXISTS "{schema_name}"')

#             # List of models to create tables for
#             models = [Committee, Committee, Elector]

#             for Model in models:
#                 # Construct the SQL query to create the table with the specified schema
#                 table_name = f'"{schema_name}"."{Model._meta.db_table}"'
#                 sql_query = f"CREATE TABLE {table_name} ("
#                 for field in Model._meta.fields:
#                     sql_query += (
#                         f"{field.column} {field.db_type(connections['default'])}, "
#                     )
#                 sql_query = sql_query.rstrip(", ") + ")"

#                 # Execute the SQL query to create the table
#                 with connections["default"].cursor() as cursor:
#                     try:
#                         cursor.execute(sql_query)
#                     except ProgrammingError as e:
#                         if "already exists" not in str(e):
#                             raise

#             return JsonResponse({"message": "Tables created successfully"}, status=200)

#         except ProgrammingError as e:
#             return JsonResponse({"error": str(e)}, status=500)

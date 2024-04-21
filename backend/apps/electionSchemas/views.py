from contextlib import contextmanager
from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from apps.elections.models import Election
from apps.committees.models import Committee, CommitteeSite
from apps.electors.models import Elector
from utils.schema import schema_context

class AddElectionSchema(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        schema_name = slug.replace("-", "_")  # Format the schema name properly

        try:
            with connection.cursor() as cursor:
                # Check if schema already exists
                cursor.execute("SELECT schema_name FROM information_schema.schemata WHERE schema_name = %s", [schema_name])
                if cursor.fetchone():
                    return Response({"message": "Schema already exists"}, status=200)

                # Create new schema
                cursor.execute(f"CREATE SCHEMA \"{schema_name}\"")
            return Response({"message": "Schema created successfully"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


from django.db import IntegrityError

class AddElectionSchemaTables(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")

        with schema_context(request, slug) as election:
            if hasattr(request, 'response'):
                return request.response  # Return the early response if set

            results = {}
            with connection.schema_editor() as schema_editor:
                models = [Committee, CommitteeSite, Elector]
                for Model in models:
                    try:
                        table_name = Model._meta.db_table
                        if not self.table_exists(table_name):
                            schema_editor.create_model(Model)
                            results[table_name] = "Created successfully"
                        else:
                            results[table_name] = "Table already exists"
                    except Exception as e:
                        results[table_name] = f"Failed to create table: {str(e)}"

            return Response({"results": results}, status=200)

    def table_exists(self, table_name):
        """ Check if a table exists in the current schema. """
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT to_regclass('{table_name}');")
            return cursor.fetchone()[0] is not None


class GetElectionSchemaDetails(APIView):
    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        schema_name = slug.replace("-", "_")

        with schema_context(request, schema_name):
            try:
                tables = connection.introspection.table_names()
                return JsonResponse({"data": {"schemaName": schema_name, "schemaTables": tables}}, status=200)
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
# from apps.committees.models import Committee, Committee
# from apps.electors.models import Elector


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

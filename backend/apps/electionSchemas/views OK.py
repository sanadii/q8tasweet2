# import os

# from django.conf import settings
# from django.apps import apps
# from django.http import JsonResponse
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from apps.elections.models import Election
# from apps.electionData.models import Elector, Committee, SubCommittee
# from django.db import connections

# from django.http import JsonResponse
# from backend.utils.electionSchemas import setup_election_database_connection
# import psycopg2
# from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
# from django.db import connection



# # GOOD
# class AddElectionDataSchema(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")

#         try:
#             # Check if the election exists
#             Election.objects.get(slug=slug)
#         except Election.DoesNotExist:
#             return Response({"error": "Election not found"}, status=404)

#         # Define the schema name with safe naming
#         schema_name = slug.replace('-', '_')

#         # Connect to the default database to execute creation of a new schema
#         try:
#             conn = psycopg2.connect(
#                 dbname=settings.DATABASES['default']['NAME'],  # Connect to the default database
#                 user=settings.DATABASES['default']['USER'],
#                 password=settings.DATABASES['default']['PASSWORD'],
#                 host=settings.DATABASES['default']['HOST'],
#                 port=settings.DATABASES['default']['PORT']
#             )
#             conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
#             cur = conn.cursor()

#             # Check if the schema already exists
#             cur.execute(f"SELECT 1 FROM pg_namespace WHERE nspname = '{schema_name}'")
#             exists = cur.fetchone()
#             if exists:
#                 return Response({"message": "Schema already exists"}, status=200)

#             # Create the new schema
#             cur.execute(f"CREATE SCHEMA \"{schema_name}\"")
#             cur.close()
#             conn.close()

#             return Response({"message": "Schema created successfully"}, status=201)

#         except Exception as e:
#             return Response({"error": str(e)}, status=500)


# class AddElectionDatabase(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")

#         try:
#             # Check if the election exists
#             Election.objects.get(slug=slug)
#         except Election.DoesNotExist:
#             return Response({"error": "Election not found"}, status=404)

#         # Define the database name with safe naming
#         db_name = f"{slug.replace('-', '_')}_db"

#         # Connect to the default database to execute creation of a new database
#         try:
#             conn = psycopg2.connect(
#                 dbname='postgres',  # Connect to the default 'postgres' database
#                 user=settings.DATABASES['default']['USER'],
#                 password=settings.DATABASES['default']['PASSWORD'],
#                 host=settings.DATABASES['default']['HOST'],
#                 port=settings.DATABASES['default']['PORT']
#             )
#             conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
#             cur = conn.cursor()

#             # Check if the database already exists
#             cur.execute(f"SELECT 1 FROM pg_database WHERE datname='{db_name}'")
#             exists = cur.fetchone()
#             if exists:
#                 return Response({"message": "Database already exists"}, status=200)

#             # Create the new database
#             cur.execute(f"CREATE DATABASE \"{db_name}\"")
#             cur.close()
#             conn.close()

#             return Response({"message": "Database created successfully"}, status=201)

#         except Exception as e:
#             return Response({"error": str(e)}, status=500)

import os
import sqlite3

from django.conf import settings
from django.apps import apps
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.elections.models import Election
from apps.electionStatistics.models import Elector, Committee, SubCommittee
from django.db import connections

from utils.electionData import setup_election_database_connection


# class AddElectionDatabaseTables(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")

#         try:
#             # Check if the election exists
#             Election.objects.get(slug=slug)
#         except Election.DoesNotExist:
#             return Response({"error": "Election not found"}, status=404)

#         # Define the path where the database should be created, relative to the project base directory
#         db_path = os.path.join(settings.BASE_DIR, "database", f"{slug}.sqlite3")

#         # Connect to the custom database
#         conn = None
#         try:
#             conn = sqlite3.connect(db_path)
#             cursor = conn.cursor()

#             # Get all models from the electionStatistics app
#             models = apps.get_app_config('electionStatistics').get_models()

#             # Create tables for each model
#             # Create tables for each model
#             for model in models:
#                 model_name = model._meta.db_table
#                 model_fields = model._meta.fields

#                 # Construct the fields definition string
#                 fields_definition = ', '.join([f"{field.db_column} {field.db_type}" for field in model_fields if field.db_column])

#                 # Execute the CREATE TABLE query
#                 cursor.execute(f"CREATE TABLE IF NOT EXISTS {model_name} ({fields_definition})")

#             # Commit the changes to the database
#             conn.commit()

#             return Response({"message": "Model tables added to the custom database"}, status=201)

#         except Exception as e:
#             # Respond with an error if something goes wrong
#             return Response({"error": str(e)}, status=500)

#         finally:
#             # Close the connection (ensure this happens even in case of exceptions)
#             if conn:
#                 conn.close()

#     def get_sqlite_data_type(self, field):
#         """
#         Returns the SQLite data type for a given Django model field.
#         """
#         # Mapping of Django field types to SQLite data types
#         data_type_mapping = {
#             'AutoField': 'INTEGER PRIMARY KEY AUTOINCREMENT',
#             'BigAutoField': 'INTEGER PRIMARY KEY AUTOINCREMENT',
#             'BigIntegerField': 'INTEGER',
#             'BinaryField': 'BLOB',
#             'BooleanField': 'INTEGER',
#             'CharField': 'TEXT',
#             'DateField': 'TEXT',
#             'DateTimeField': 'TEXT',
#             'DecimalField': 'REAL',
#             'DurationField': 'TEXT',
#             'EmailField': 'TEXT',
#             'FileField': 'TEXT',
#             'FilePathField': 'TEXT',
#             'FloatField': 'REAL',
#             'ForeignKey': 'INTEGER',
#             'GenericIPAddressField': 'TEXT',
#             'ImageField': 'TEXT',
#             'IntegerField': 'INTEGER',
#             'JSONField': 'TEXT',
#             'ManyToManyField': 'INTEGER',
#             'OneToOneField': 'INTEGER',
#             'PositiveBigIntegerField': 'INTEGER',
#             'PositiveIntegerField': 'INTEGER',
#             'PositiveSmallIntegerField': 'INTEGER',
#             'SlugField': 'TEXT',
#             'SmallAutoField': 'INTEGER',
#             'SmallIntegerField': 'INTEGER',
#             'TextField': 'TEXT',
#             'TimeField': 'TEXT',
#             'URLField': 'TEXT',
#             'UUIDField': 'TEXT',
#         }

#         # Get the class name of the field
#         fields_definition = ', '.join([f"{field.db_column} {self.get_sqlite_data_type(field)}" for field in model_fields if field.db_column])

#         # Return the corresponding SQLite data type or 'TEXT' as default
#         return data_type_mapping.get(fields_definition, 'TEXT')


# Creating database
class AddElectionDatabase(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")

        try:
            # Check if the election exists
            Election.objects.get(slug=slug)
        except Election.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        # Define the path where the database should be created, relative to the project base directory
        db_path = os.path.join(settings.BASE_DIR, "database", f"{slug}.sqlite3")

        # Check if database already exists
        if os.path.exists(db_path):
            return Response({"message": "Database file already exists"}, status=200)

        # Try to create the database file
        try:
            # Touch the file to create it if it doesn't exist
            with open(db_path, "a"):
                os.utime(db_path, None)

            return Response({"message": "Database file created"}, status=201)

        except Exception as e:
            # Respond with an error if something goes wrong
            return Response({"error": str(e)}, status=500)


from .dataRequests import (
    count_electors_by_gender,
    count_electors_by_last_name,
    count_electors_by_area,
)

from .committeeRequests import get_election_committees


class GetElectionStatistics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")

        try:
            election = Election.objects.get(slug=slug)
        except Election.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        # Define the database path based on the slug
        db_path = os.path.join(settings.BASE_DIR, "database", f"{slug}.sqlite3")
        if not os.path.exists(db_path):
            return Response(
                {"error": "Database not found for the given slug"}, status=404
            )

        # Connect to the specific database
        connection = setup_election_database_connection(slug)

        # Execute the queries using functions from dataRequests
        electorsByGender = count_electors_by_gender(connection)
        electorsByFamily = count_electors_by_last_name(connection)
        electorsByArea = count_electors_by_area(connection)
        
        # election Committees
        electionCommittees = get_election_committees(connection)

        # Prepare the response data in a more structured format
        response_data = {
            "data": {
                "electionCommittees": electionCommittees,
                "electorsByGender": electorsByGender,
                "electorsByFamily": electorsByFamily,
                "electorsByArea": electorsByArea,
            }
        }

        # Close the database connection
        connection.close()

        return Response(response_data)

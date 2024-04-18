import os
import sqlite3

from django.conf import settings
from django.apps import apps
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.elections.models import Election
from apps.electionData.models import Elector, Committee, SubCommittee
from django.db import connections

from django.http import JsonResponse
from utils.electionData import setup_election_database_connection
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from django.db import connection


class AddElectionDatabase(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")

        try:
            Election.objects.get(slug=slug)  # Ensuring the election exists
        except Election.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        db_name = setup_dynamic_database(slug)

        try:
            with psycopg2.connect(
                dbname='postgres',  # Connect to the default 'postgres' database
                user=settings.DATABASES['default']['USER'],
                password=settings.DATABASES['default']['PASSWORD'],
                host=settings.DATABASES['default']['HOST'],
                port=settings.DATABASES['default']['PORT']
            ) as conn:
                conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
                with conn.cursor() as cur:
                    cur.execute(f"SELECT 1 FROM pg_database WHERE datname='{db_name}'")
                    if not cur.fetchone():
                        cur.execute(f"CREATE DATABASE \"{db_name}\"")
                        message = "Database created successfully"
                    else:
                        message = "Database already exists"

            create_tables_for_models(db_name)  # Create tables after ensuring the DB exists

            return Response({"message": message}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

def create_tables_for_models(db_name):
    # Ensure the database configuration is set up in Django's connection handler
    if db_name not in settings.DATABASES:
        settings.DATABASES[db_name] = {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db_name,
            'USER': settings.DATABASES['default']['USER'],
            'PASSWORD': settings.DATABASES['default']['PASSWORD'],
            'HOST': settings.DATABASES['default']['HOST'],
            'PORT': settings.DATABASES['default']['PORT'],
        }

    # Explicitly ensure connection for the given database alias
    connections[db_name].ensure_connection()

    # Now using the connection context to modify the database schema
    with connections[db_name].schema_editor() as schema_editor:
        for model in apps.get_models():
            if model._meta.app_label == 'electionData' and not model._meta.managed:
                schema_editor.create_model(model)



def setup_dynamic_database(slug):
    db_name = slug.replace('-', '_') + '_db'  # Ensure the database name is safe
    db_settings = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': db_name,
        'USER': 'postgres',
        'PASSWORD': 'I4ksb@11782',
        'HOST': 'localhost',
        'PORT': '5432',
    }
    if db_name not in connections.databases:
        connections.databases[db_name] = db_settings
    return db_name


class AddElectionDatabase(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")

        try:
            # Check if the election exists
            Election.objects.get(slug=slug)
        except Election.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        db_name = f"{slug.replace('-', '_')}_db"

        try:
            conn = psycopg2.connect(
                dbname='postgres',  # Connect to the default 'postgres' database
                user=settings.DATABASES['default']['USER'],
                password=settings.DATABASES['default']['PASSWORD'],
                host=settings.DATABASES['default']['HOST'],
                port=settings.DATABASES['default']['PORT']
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cur = conn.cursor()

            cur.execute(f"SELECT 1 FROM pg_database WHERE datname='{db_name}'")
            exists = cur.fetchone()
            if exists:
                return Response({"message": "Database already exists"}, status=200)

            cur.execute(f"CREATE DATABASE \"{db_name}\"")
            cur.close()
            conn.close()

            return Response({"message": "Database created successfully"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


def create_election_database(request):
    slug = request.GET.get('slug')
    db_name = slug  # Or any other naming convention you prefer

    try:
        conn = psycopg2.connect(
            dbname='postgres',  # connect to the default database to create a new one
            user=settings.DATABASES['default']['USER'],
            password=settings.DATABASES['default']['PASSWORD'],
            host=settings.DATABASES['default']['HOST'],
            port=settings.DATABASES['default']['PORT']
        )
        conn.autocommit = True  # Needed to execute a CREATE DATABASE command
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE {db_name}")
        cursor.close()
        conn.close()
        return JsonResponse({"message": "Database created successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def create_tables_for_models(db_name):
    # Ensure the database configuration is set up in Django's connection handler
    if db_name not in settings.DATABASES:
        settings.DATABASES[db_name] = {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db_name,
            'USER': settings.DATABASES['default']['USER'],
            'PASSWORD': settings.DATABASES['default']['PASSWORD'],
            'HOST': settings.DATABASES['default']['HOST'],
            'PORT': settings.DATABASES['default']['PORT'],
        }

    # Use the Django connection and schema editor to create tables
    with connection.schema_editor(database=db_name) as schema_editor:
        for model in apps.get_models():
            if model._meta.app_label == 'your_app_label' and not model._meta.managed:
                schema_editor.create_model(model)



class AddElectionDatabase(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")

        try:
            # Check if the election exists
            Election.objects.get(slug=slug)
        except Election.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        # Define the database name with safe naming
        db_name = f"{slug.replace('-', '_')}_db"

        try:
            # Connect to the default database to execute creation of a new database
            conn = psycopg2.connect(
                dbname='postgres',  # Connect to the default 'postgres' database
                user=settings.DATABASES['default']['USER'],
                password=settings.DATABASES['default']['PASSWORD'],
                host=settings.DATABASES['default']['HOST'],
                port=settings.DATABASES['default']['PORT']
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cur = conn.cursor()

            # Check if the database already exists
            cur.execute(f"SELECT 1 FROM pg_database WHERE datname='{db_name}'")
            exists = cur.fetchone()
            if exists:
                return Response({"message": "Database already exists"}, status=200)

            # Create the new database
            cur.execute(f"CREATE DATABASE \"{db_name}\"")
            cur.close()
            conn.close()

            # Call the function to create tables
            create_tables_for_models(db_name)

            return Response({"message": "Database created successfully"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class CreateElectionDatabaseTables(APIView):
    # permission_classes = [IsAuthenticated]
    # ATOMIC_REQUESTS = True

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        db_name = slug.replace('-', '_') + '_db'  # Ensure the database name is safe and valid

        if db_name not in settings.DATABASES:
            settings.DATABASES[db_name] = {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': db_name,
                'USER': 'postgres',
                'PASSWORD': 'I4ksb@11782',
                'HOST': 'localhost',
                'PORT': '5432',
                'TIME_ZONE': settings.TIME_ZONE,  # Ensure this is added
                'USE_TZ': settings.USE_TZ,  # Copy from your main settings
                'CONN_HEALTH_CHECKS': True,  # Example: enabling connection health checks
                'CONN_MAX_AGE': 600,  # Keep database connections open for 10 minutes
                'OPTIONS': {  # Ensure OPTIONS are also dynamically set
                    'connect_timeout': 10,
                    'options': '-c statement_timeout=5000'
                }
            }

        try:
            # Ensure the connection is correctly configured
            connection = connections[db_name]
            connection.prepare_database()

            # Use Django's schema editor to create the table
            with connection.schema_editor() as schema_editor:
                Model = apps.get_model('electionData', 'Committee')
                schema_editor.create_model(Model)

            return Response({"message": "Tables created successfully"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)



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

#             # Get all models from the electionData app
#             models = apps.get_app_config('electionData').get_models()

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


# class AddElectionDatabase(APIView):
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

#         # Check if database already exists
#         if os.path.exists(db_path):
#             return Response({"message": "Database file already exists"}, status=200)

#         # Try to create the database file
#         try:
#             # Touch the file to create it if it doesn't exist
#             with open(db_path, "a"):
#                 os.utime(db_path, None)

#             return Response({"message": "Database file created"}, status=201)

#         except Exception as e:
#             # Respond with an error if something goes wrong
#             return Response({"error": str(e)}, status=500)


from .dataRequests import (
    count_electors_by_gender,
    count_electors_by_last_name,
    count_electors_by_area,
)

from .committeeRequests import get_election_committees


class GetelectionData(APIView):
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

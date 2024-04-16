from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.elections.models import Election  # Import your Election model
import sqlite3
import os

from django.db.models import Count, Q
from django.conf import settings
from django.db import connections
from django.http import JsonResponse  # Use JsonResponse for a more RESTful response


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
        db_alias = f"election_{slug}"
        settings.DATABASES[db_alias] = {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": db_path,
            "ATOMIC_REQUESTS": True,  # Add this line
            "TIME_ZONE": "Asia/Kuwait",  # Replace with your appropriate time zone
            "CONN_HEALTH_CHECKS": True,  # Add this line if you want connection health checks
            "CONN_MAX_AGE": 600,  # Example: Set connection to expire after 10 minutes (in seconds)
            "OPTIONS": {
                # Add optional connection parameters here (if needed)
            },
            "AUTOCOMMIT": True,  # Optional: Default behavior (transactions are auto-committed)
        }
        connection = connections[db_alias]

        # Perform the query to count male and female electors
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT SUM(CASE WHEN gender = 1 THEN 1 ELSE 0 END) AS maleElectors,
                       SUM(CASE WHEN gender = 2 THEN 1 ELSE 0 END) AS femaleElectors
                FROM electors
            """
            )
            result = cursor.fetchone()

        male_electors, female_electors = result if result else (0, 0)

        # Perform the query to count electors by last name
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT last_name, COUNT(*) AS count
                FROM electors
                GROUP BY last_name
                ORDER BY count DESC;  -- Order by count in descending order
            """
            )
            elector_by_family_data = cursor.fetchall()


        # Perform the query to count electors by last name
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT area, COUNT(*) AS count
                FROM electors
                GROUP BY area
                ORDER BY count DESC;  -- Order by count in descending order
            """
            )
            elector_by_area_data = cursor.fetchall()

        # Prepare the response data in a more structured format
        response_data = {
            "data": {
                "electorsByGender": {
                    "maleElectors": male_electors,
                    "femaleElectors": female_electors,
                },
                "electorsByFamily": [
                    {"last_name": row[0], "count": row[1]} for row in elector_by_family_data
                ],
                "electorsByArea": [
                    {"area": row[0], "count": row[1]} for row in elector_by_area_data
                ],

            }
        }

        # Remove the temporary database setting
        del settings.DATABASES[db_alias]
        connections[db_alias].close()

        return Response(response_data)

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.elections.models import Election  # Import your Election model
import sqlite3

class GetElectionStatistics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get the slug from URL parameters
        slug = kwargs.get('slug')


        print("slug: ", slug)
        # Check if the slug exists and corresponds to an Election instance
        try:
            election = Election.objects.get(slug=slug)
        except Election.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        # Get the table name based on the slug
        database_name = slug
        table_name = "table1"

        # Construct the path to the SQLite3 database file
        db_path = settings.BASE_DIR  # Django main folder
        db_file = f"{db_path}/{database_name}.sqlite3"

        # Connect to the SQLite3 database
        connection = sqlite3.connect(db_file)

        # Create a cursor
        cursor = connection.cursor()

        # Execute a query to get all data from the table
        query = f"SELECT * FROM {table_name}"
        cursor.execute(query)

        # Fetch all rows
        rows = cursor.fetchall()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        # Return the data
        return Response(rows)

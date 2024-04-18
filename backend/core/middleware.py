from .routers import request_cfg
from django.db import connections, connection
from django.utils.deprecation import MiddlewareMixin


class MyMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response['X-My-Header'] = {
            'Content-Tyupe': "application/json"
        }
        response['Content-Type'] = "application/json"
        return response

class SchemaMiddleware(MiddlewareMixin):
    def process_request(self, request):
        schema_name = request.session.get('schema', 'public')  # Or however you determine the schema
        with connection.cursor() as cursor:
            cursor.execute(f"SET search_path TO {schema_name}")


# class DatabaseSwitchMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         # Example: read the database name from a custom header or adjust based on your logic
#         db_name = request.headers.get('X-Database-Name', 'default')
#         request_cfg.db_name = db_name  # Adjust this line as necessary
#         response = self.get_response(request)
#         return response

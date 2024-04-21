from .routers import request_cfg
from django.db import connections, connection
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from threading import local
import re

local_vars = local()

class SchemaMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Only apply middleware to paths that start with /electionSchemas
        if request.path.startswith('/electionSchemas'):
            return self.process_request(request)
        # For other paths, do nothing and pass the request along the middleware chain
        return self.get_response(request)

    def process_request(self, request):
        # Your middleware logic here
        response = self.get_response(request)
        # Optionally, modify the response
        return response




# class SchemaMiddleware(MiddlewareMixin):
#     def process_request(self, request):
#         schema_name = request.session.get('schema', 'public')  # Or however you determine the schema
#         with connection.cursor() as cursor:
#             cursor.execute(f"SET search_path TO {schema_name}")


class MyMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response["X-My-Header"] = {"Content-Tyupe": "application/json"}
        response["Content-Type"] = "application/json"
        return response

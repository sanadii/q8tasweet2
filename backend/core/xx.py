from threading import local

_user_db_thread_local = local()

def get_current_db_name():
    return getattr(_user_db_thread_local, 'db_name', 'default')

class DatabaseRoutingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Dynamically determine the database name from the request
        db_name = request.headers.get('X-Database-Name', 'default')
        _user_db_thread_local.db_name = db_name

        response = self.get_response(request)

        # Clean up the thread local storage to prevent data leaking between requests
        if hasattr(_user_db_thread_local, 'db_name'):
            del _user_db_thread_local.db_name

        return response


class DatabaseSwitchMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Example logic to set the database name
        db_name = request.headers.get('X-Database-Name', 'default')
        request_cfg.db_name = f'election_db_{db_name}'  # Assumes databases are pre-named accordingly
        response = self.get_response(request)
        return response

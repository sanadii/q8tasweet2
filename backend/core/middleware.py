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

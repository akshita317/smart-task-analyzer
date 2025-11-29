from django.http import HttpResponse


class CORSMiddleware:
    """
    Simple CORS middleware to allow frontend requests
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Handle preflight requests
        if request.method == 'OPTIONS':
            response = HttpResponse()
        else:
            response = self.get_response(request)

        # Add CORS headers
        origin = request.META.get('HTTP_ORIGIN', '')
        
        # Check if origin is allowed
        allowed_origins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:8000',
            'http://127.0.0.1:8000',
        ]
        
        is_allowed = (
            origin in allowed_origins or 
            origin.endswith('.vercel.app') or
            origin.endswith('.railway.app') or
            origin == 'http://localhost' or
            origin == 'http://127.0.0.1'
        )

        if is_allowed:
            response['Access-Control-Allow-Origin'] = origin
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Max-Age'] = '3600'

        return response

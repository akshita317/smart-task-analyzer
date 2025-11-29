from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import FileResponse
import os

# Serve frontend from a view
def home_view(request):
    # Path: backend/backend/urls.py -> go up to backend, then to frontend/index.html
    base_dir = settings.BASE_DIR  # This is the backend folder
    frontend_path = os.path.join(base_dir.parent, 'frontend', 'index.html')
    try:
        return FileResponse(open(frontend_path, 'rb'), content_type='text/html')
    except FileNotFoundError:
        from django.http import HttpResponse
        return HttpResponse("Frontend not found. Make sure frontend/index.html exists.", status=404)

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/tasks/', include('task.urls')),
]

# Serve static files from frontend
if settings.DEBUG:
    urlpatterns += static('/frontend/', document_root=os.path.join(settings.BASE_DIR.parent, 'frontend'))

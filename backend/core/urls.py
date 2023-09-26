from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # Applications
    path("", include("restapi.users.urls", namespace="users")),
    path("elections/", include(("restapi.urls", "elections"), namespace="elections")),

    # Schema & Documentation
    path("docs/", include_docs_urls(title="WorkspaceAPI")),
    path("schema", get_schema_view(title="WorkspaceAPI", description="API for the WorkspaceAPI", version="1.0.0"), name="openapi-schema"),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Catch-all route for frontend routing
urlpatterns.append(re_path(r'^.*', TemplateView.as_view(template_name='index.html')))
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])

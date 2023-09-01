# Core urls
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls
from django.views.decorators.csrf import csrf_exempt

from django.shortcuts import render
from django.urls import re_path
from django.views.generic import TemplateView


def index(request):
    return render(request, 'index.html')


urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # React
    # re_path(r'^.*$', index, name='index'),
    path('', TemplateView.as_view(template_name='index.html')),

    # Applications
    path("", include("users.urls", namespace="users")),
    path("elections/", include(("restapi.urls", "elections"), namespace="elections")),

    
    # path("", include("workspace.urls", namespace="workspace")),

    # Schema & Documentation
    path("docs/", include_docs_urls(title="WorkspaceAPI")),
    path(
        "schema",
        get_schema_view(
            title="WorkspaceAPI", description="API for the WorkspaceAPI", version="1.0.0"
        ),
        name="openapi-schema",
    ),
]


# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls

from restapi.admin import (
    candidate_admin_site,
    election_admin_site,
    campaign_admin_site,
    elector_admin_site,
    category_admin_site,
    user_admin_site,
    )

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),
    path('admin/restapi/elections/', election_admin_site.urls, name='election-admin'),
    path('admin/restapi/candidates/', candidate_admin_site.urls, name='candidate-admin'),
    path('admin/restapi/campaigns/', campaign_admin_site.urls, name='campaign-admin'),
    path('admin/restapi/electors/', elector_admin_site.urls, name='elector-admin'),
    path('admin/restapi/categories/', category_admin_site.urls, name='category-admin'),
    path('admin/restapi/users/', user_admin_site.urls, name='user-admin'),

    # Applications
    path("restapi/", include(("restapi.urls", "restapi"), namespace="restapi")),

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

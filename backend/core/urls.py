"""
This is the main ``urls`` for Q8Tasweet - it sets up patterns for
all the various Q8Tasweet apps, third-party apps like docs and schema.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls

# from restapi.admin import (
#     candidate_admin_site,
#     election_admin_site,
#     campaign_admin_site,
#     voter_admin_site,
#     category_admin_site,
#     user_admin_site,
#     )

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),
    # path('admin/elections/', election_admin_site.urls, name='election-admin'),
    # path('admin/candidates/', candidate_admin_site.urls, name='candidate-admin'),
    # path('admin/campaigns/', campaign_admin_site.urls, name='campaign-admin'),
    # path('admin/voters/', voter_admin_site.urls, name='voter-admin'),
    # path('admin/categories/', category_admin_site.urls, name='category-admin'),
    # path('admin/users/', user_admin_site.urls, name='user-admin'),

    # Setting Apps
    path('Config/', include('apps.settings.urls')),
    # path('media/', include('apps.media.urls')),

    # Main Apps
    path('campaigns/', include('apps.campaigns.urls')),
    path('candidates/', include('apps.candidates.urls')),
    path('categories/', include('apps.categories.urls')),
    path('elections/', include('apps.elections.urls')),
    path('voters/', include('apps.voters.urls')),
    path('auth/', include('apps.auths.urls')),

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

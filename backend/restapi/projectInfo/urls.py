# Campaign Urls

from django.urls import path
from django.contrib import admin

from restapi.admin import campaign_admin_site

from .views import *

app_name = "projectinfo"

urlpatterns = [
    # Admin
    path('admin/elections/', campaign_admin_site.urls, name='campaign-admin'),
    path('admin/', admin.site.urls),

    # Media
    path("uploadImage", UploadImage.as_view(), name="uploadImage"),
]
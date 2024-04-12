# Campaign Urls

from django.urls import path
from django.contrib import admin


from .views import *
from django.conf import settings
from django.conf.urls.static import static

app_name = "Config"

urlpatterns = [
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
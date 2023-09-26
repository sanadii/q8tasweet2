# Campaign Urls

from django.urls import path
from .views import *

app_name = "restapi"

urlpatterns = [
    # Media
    path("uploadImage", UploadImage.as_view(), name="uploadImage"),
]
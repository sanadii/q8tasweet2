# Campaign Urls

from django.urls import path
from .views import *

app_name = "restapi"

urlpatterns = [
    path("getAllElectors", GetAllElectors.as_view(), name="GetAllElectors"),
    path("getElectors", GetElectors.as_view(), name="GetElectors"),
]
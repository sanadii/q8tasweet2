# Campaign Urls

from django.urls import path
from .views import *

app_name = "voters"
 
urlpatterns = [
    path("getAllVoters", GetAllVoters.as_view(), name="GetAllVoters"),
    path("getVoters", GetVoters.as_view(), name="GetVoters"),    
]
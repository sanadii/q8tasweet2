# Campaign Urls

from django.urls import path
from apps.electors.views import *

app_name = "electors"

urlpatterns = [
    path("getAllElectors", GetAllElectors.as_view(), name="GetAllElectors"),
    path("getElectorStatistics/<slug:slug>", GetElectorStatistics.as_view(), name="GetElectorStatistics"),
    # path("getElectors", GetElectors.as_view(), name="GetElectors"),
    
    
    
]

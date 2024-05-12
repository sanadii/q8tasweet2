# Campaign Urls

from django.urls import path
from apps.electors.views import *

app_name = "electors"

urlpatterns = [
    # path("getAllElectors", GetAllElectors.as_view(), name="GetAllElectors"),
    # path("getElectorStatistics/<slug:slug>", GetElectorStatistics.as_view(), name="GetElectorStatistics"),
    path("getElectorsByAll", GetElectorsByAll.as_view(), name="GetElectorsByAll"),
    path("getElectorsByCategory", GetElectorsByCategory.as_view(), name="GetElectorsByCategory"),
    path("getElectorsBySearch", GetElectorsBySearch.as_view(), name="GetElectorsBySearch"),

    # path("getElectorsByCategoryOld/<slug:slug>/", GetElectorsByCategory.as_view(), name="getElectorsByCategory"),
    # path("getElectors", GetElectors.as_view(), name="GetElectors"),
    
]

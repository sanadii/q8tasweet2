# restapi/urls.py
from django.urls import path, include

urlpatterns = [
    path('campaigns/', include('restapi.campaigns.urls')),
    path('candidates/', include('restapi.candidates.urls')),
    path('categories/', include('restapi.categories.urls')),
    path('elections/', include('restapi.elections.urls')),
    path('electors/', include('restapi.electors.urls')),
    path('Configs/', include('restapi.configs.urls')),
    path('users/', include('restapi.users.urls')),
    # ... additional submodules ...
]

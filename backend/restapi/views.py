# restapi/views.py

from django.shortcuts import render
from restapi.campaigns.views import *
from restapi.candidates.views import *
from restapi.categories.views import *
from restapi.elections.views import *
from restapi.electors.views import *
from restapi.configs.views import *
from .auth.views import *

# If you need to create overarching views, define them here.

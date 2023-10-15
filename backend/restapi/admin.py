# restapi/admin.py
from django.contrib import admin
from django.contrib.auth.models import Group, User

# from restapi.models import campaignAdminSite

from restapi.elections.admin import ElectionAdminSite, election_admin_site
from restapi.candidates.admin import candidateAdminSite, candidate_admin_site
from restapi.campaigns.admin import campaignAdminSite, campaign_admin_site
from restapi.electors.admin import ElectorAdminSite, elector_admin_site
from restapi.configs.admin import ConfigsAdminSite, configs_admin_site

from restapi.categories.admin import CategoryAdminSite, category_admin_site
from restapi.auth.admin import UserAdminSite, user_admin_site
# restapi/admin.py
from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.models import Group, User

from restapi.models import Campaigns, CampaignMembers, CampaignGuarantees, ElectionAttendees
from restapi.campaigns.admin import CampaignsAdmin, CampaignMembersAdmin, CampaignGuaranteesAdmin, ElectionAttendeesAdmin


from restapi.candidates.admin import CandidatesAdmin
from restapi.categories.admin import CategoriesAdmin, TagsAdmin, AreasAdmin
from restapi.elections.admin import ElectionsAdmin, ElectionCandidatesAdmin, ElectionCommitteesAdmin
from restapi.electors.admin import ElectorsAdmin
from restapi.users.admin import UserAdmin

from restapi.models import *
# from .projectInfo.admin import ProjectInfoAdmin


class CampaignAdminSite(AdminSite):
    site_header = 'Campaigns Administration'
    site_title = 'Campaigns Admin'
    index_title = 'Campaigns Admin'

campaign_admin_site = CampaignAdminSite(name='campaign_admin')

# Register models with the custom AdminSite instance
admin.site.register(Campaigns, CampaignsAdmin)
admin.site.register(CampaignMembers, CampaignMembersAdmin)
admin.site.register(CampaignGuarantees, CampaignGuaranteesAdmin)
admin.site.register(ElectionAttendees, ElectionAttendeesAdmin)

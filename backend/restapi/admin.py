from django.contrib import admin
from .models import *

# admin.site.register(Guarantees)
admin.site.register(Elections)
admin.site.register(Candidates)
admin.site.register(ElectionCandidates)
admin.site.register(Campaigns)
admin.site.register(CampaignMembers)
admin.site.register(CampaignGuarantees)

admin.site.register(Electors)
admin.site.register(ElectionCommittees)
admin.site.register(ElectionAttendees)


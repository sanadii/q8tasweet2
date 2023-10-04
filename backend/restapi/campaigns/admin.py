# Campaign Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from restapi.models import Campaigns, CampaignMembers, CampaignGuarantees, ElectionAttendees
from restapi.helper.admin_helper import TaskAdminFields, TrackAdminFields, ReadOnlyTrackFields


class CampaignsAdmin(admin.ModelAdmin):
    list_display = ['election_candidate', 'status', 'priority', 'website']
    list_filter = ['status', 'priority']
    search_fields = ['election_candidate__candidate__name', 'description']
    readonly_fields = ReadOnlyTrackFields

    fieldsets = [
        ('Basic Information', {'fields': ['election_candidate', 'description', 'results']}),
        ('Contacts', {'fields': ['twitter', 'instagram', 'website']}),
        # ('Activities', {'fields': ['events', 'attendees', 'media_coverage', 'results']}),
        TaskAdminFields,
        TrackAdminFields
    ]

class CampaignMembersAdmin(admin.ModelAdmin):
    def rank_display(self, obj):
        rank_dict = {
            1: "Party",
            2: "Candidate",
            3: "Supervisor",
            4: "Guarantor",
            5: "Attendant",
            6: "Sorter",
            10: "Moderator",
        }
        return rank_dict.get(obj.rank, "Unknown")
    
    rank_display.short_description = 'Rank'

    list_display = ['user', 'campaign', 'rank_display', 'supervisor', 'committee', 'civil', 'phone', 'status']
    list_filter = ['campaign', 'rank']
    search_fields = ['user__username', 'committee__name']  
    readonly_fields = ReadOnlyTrackFields

    fieldsets = [
        ('Basic Information', {'fields': ['user', 'campaign', 'rank', 'supervisor', 'committee', 'civil', 'phone', 'notes', 'status']}),
        TrackAdminFields
    ]

class CampaignGuaranteesAdmin(admin.ModelAdmin):
    list_display = ['campaign', 'member', 'civil', 'phone', 'notes', 'status']
    search_fields = ['member__user__username', 'civil__full_name', 'phone']
    list_filter = ['campaign', 'member', 'status']
    readonly_fields = ReadOnlyTrackFields

    fieldsets = [
        ('Basic Information', {'fields': ['campaign', 'member', 'civil', 'phone', 'notes', 'status']}),
        TrackAdminFields
    ]


class ElectionAttendeesAdmin(admin.ModelAdmin):
    list_display = ['user', 'election', 'committee', 'elector', 'notes', 'status']
    search_fields = ['user__username', 'committee__name', 'elector__full_name']
    list_filter = ['election', 'committee', 'status']
    readonly_fields = ReadOnlyTrackFields

    fieldsets = [
        ('Basic Information', {'fields': ['user', 'election', 'committee', 'elector', 'notes', 'status']}),
        TrackAdminFields
    ]



admin.site.register(Campaigns, CampaignsAdmin)
admin.site.register(CampaignMembers, CampaignMembersAdmin)
admin.site.register(CampaignGuarantees, CampaignGuaranteesAdmin)
admin.site.register(ElectionAttendees, ElectionAttendeesAdmin)

# class ElectionsAdminSite(AdminSite):
#     site_header = 'Elections Administration'
#     site_title = 'Elections Admin'
#     index_title = 'Elections Admin'

# campaign_admin_site = ElectionsAdminSite(name='campaign_admin')

class CampaignAdminSite(AdminSite):
    site_header = 'Campaigns Administration'
    site_title = 'Campaigns Admin'
    index_title = 'Campaigns Admin'

campaign_admin_site = CampaignAdminSite(name='campaign_admin')
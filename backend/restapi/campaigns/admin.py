# Campaign Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from restapi.models import Campaign, CampaignMember, CampaignGuarantee, CampaignAttendee
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
    def role_display(self, obj):
        role_dict = {
            1: "Party",
            2: "Candidate",
            3: "Supervisor",
            4: "Guarantor",
            5: "Attendant",
            6: "Sorter",
            10: "Moderator",
        }
        return role_dict.get(obj.role, "Unknown")
    
    role_display.short_description = 'Role'

    list_display = ['user', 'campaign', 'role_display', 'supervisor', 'committee', 'civil', 'phone', 'status']
    list_filter = ['campaign', 'role']
    search_fields = ['user__username', 'committee__name']  
    readonly_fields = ReadOnlyTrackFields

    fieldsets = [
        ('Basic Information', {'fields': ['user', 'campaign', 'role', 'supervisor', 'committee', 'civil', 'phone', 'notes', 'status']}),
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


class CampaignAttendeesAdmin(admin.ModelAdmin):
    list_display = ['user', 'election', 'committee', 'civil', 'notes', 'status']
    search_fields = ['user__username', 'committee__name', 'civil__full_name']
    list_filter = ['election', 'committee', 'status']
    readonly_fields = ReadOnlyTrackFields

    fieldsets = [
        ('Basic Information', {'fields': ['user', 'election', 'committee', 'civil', 'notes', 'status']}),
        TrackAdminFields
    ]



admin.site.register(Campaign, CampaignsAdmin)
admin.site.register(CampaignMember, CampaignMembersAdmin)
admin.site.register(CampaignGuarantee, CampaignGuaranteesAdmin)
admin.site.register(CampaignAttendee, CampaignAttendeesAdmin)

# class ElectionsAdminSite(AdminSite):
#     site_header = 'Election Administration'
#     site_title = 'Election Admin'
#     index_title = 'Election Admin'

# campaign_admin_site = ElectionsAdminSite(name='campaign_admin')

class campaignAdminSite(AdminSite):
    site_header = 'Campaign Administration'
    site_title = 'Campaign Admin'
    index_title = 'Campaign Admin'

campaign_admin_site = campaignAdminSite(name='campaign_admin')
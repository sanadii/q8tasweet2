# Campaign Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from restapi.models import Campaigns, CampaignMembers, CampaignGuarantees, ElectionAttendees


class CampaignsAdmin(admin.ModelAdmin):
    list_display = ['election_candidate', 'status', 'priority', 'website']
    list_filter = ['status', 'priority']
    search_fields = ['title', 'election_candidate__candidate__name', 'description']
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

    fieldsets = [
        ('Basic Information', {'fields': ['election_candidate', 'description', 'results']}),
        ('Contacts', {'fields': ['twitter', 'instagram', 'website']}),
        # ('Activities', {'fields': ['events', 'attendees', 'media_coverage', 'results']}),
        # ('Administration', {'fields': ['moderators', 'status', 'priority']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
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

    list_display = ['user', 'campaign', 'rank_display', 'supervisor', 'committee', 'civil', 'mobile', 'status']
    list_filter = ['campaign', 'rank']
    search_fields = ['user__username', 'campaign__title', 'committee__name']  # Searching by user's username and campaign's title and committee's name
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

    fieldsets = [
        ('Basic Information', {'fields': ['user', 'campaign', 'rank', 'supervisor', 'committee', 'civil', 'mobile', 'notes', 'status']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

class CampaignGuaranteesAdmin(admin.ModelAdmin):
    list_display = ['campaign', 'member', 'civil', 'mobile', 'notes', 'status']
    search_fields = ['campaign__title', 'member__user__username', 'civil__full_name', 'mobile']
    list_filter = ['campaign', 'member', 'status']

    fieldsets = [
        ('Basic Information', {'fields': ['campaign', 'member', 'civil', 'mobile', 'notes', 'status']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

class ElectionAttendeesAdmin(admin.ModelAdmin):
    list_display = ['user', 'election', 'committee', 'elector', 'notes', 'status']
    search_fields = ['user__username', 'election__title', 'committee__name', 'elector__full_name']
    list_filter = ['election', 'committee', 'status']

    fieldsets = [
        ('Basic Information', {'fields': ['user', 'election', 'committee', 'elector', 'notes', 'status']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']


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
# Campaign Admin
from django.contrib import admin
from .models import *

@admin.register(Campaigns)
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

@admin.register(CampaignMembers)
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

@admin.register(CampaignGuarantees)
class CampaignGuaranteesAdmin(admin.ModelAdmin):
    list_display = ['campaign', 'member', 'civil', 'mobile', 'notes', 'status']
    search_fields = ['campaign__title', 'member__user__username', 'civil__full_name', 'mobile']
    list_filter = ['campaign', 'member', 'status']

    fieldsets = [
        ('Basic Information', {'fields': ['campaign', 'member', 'civil', 'mobile', 'notes', 'status']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

@admin.register(ElectionAttendees)
class ElectionAttendeesAdmin(admin.ModelAdmin):
    list_display = ['user', 'election', 'committee', 'elector', 'notes', 'status']
    search_fields = ['user__username', 'election__title', 'committee__name', 'elector__full_name']
    list_filter = ['election', 'committee', 'status']

    fieldsets = [
        ('Basic Information', {'fields': ['user', 'election', 'committee', 'elector', 'notes', 'status']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']


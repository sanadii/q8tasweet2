# Candidate Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from apps.candidates.models import Candidate
from utils.admin_helper import TaskAdminFields, TrackAdminFields, ReadOnlyTrackFields

class CandidatesAdmin(admin.ModelAdmin):
    list_display = ['name', 'gender', 'status', 'priority']
    list_filter = ['gender', 'status', 'priority']
    search_fields = ['name', 'tags']
    readonly_fields = ReadOnlyTrackFields
    
    fieldsets = [
        ('Basic Information', {'fields': ['image', 'name', 'gender']}),
        # ('Contacts', {'fields': ['phone', 'email', 'twitter', 'instagram']}),
        # ('Education & Career', {'fields': ['education', 'position', 'party']}),
        ('Taxonomies', {'fields': ['tags']}),
        TaskAdminFields,
        TrackAdminFields
    ]

admin.site.register(Candidate, CandidatesAdmin)
class candidateAdminSite(AdminSite):
    site_header = 'Candidate Administration'
    site_title = 'Candidate Admin'
    index_title = 'Candidate Admin'

candidate_admin_site = candidateAdminSite(name='candidate')

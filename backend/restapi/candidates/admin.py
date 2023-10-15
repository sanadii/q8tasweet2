# Candidate Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from restapi.models import Candidate
from restapi.helper.admin_helper import TaskAdminFields, TrackAdminFields, ReadOnlyTrackFields

class CandidatesAdmin(admin.ModelAdmin):
    list_display = ['name', 'gender', 'phone', 'email', 'position', 'party', 'status', 'priority']
    list_filter = ['gender', 'status', 'priority']
    search_fields = ['name', 'description', 'phone', 'email', 'twitter', 'instagram', 'education', 'position', 'party', 'tags']
    readonly_fields = ReadOnlyTrackFields
    
    fieldsets = [
        ('Basic Information', {'fields': ['image', 'name', 'gender', 'birthdate', 'description']}),
        ('Contacts', {'fields': ['phone', 'email', 'twitter', 'instagram']}),
        ('Education & Career', {'fields': ['education', 'position', 'party']}),
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

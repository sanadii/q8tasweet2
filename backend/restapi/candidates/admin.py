# Candidate Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from restapi.models import Candidates

class CandidatesAdmin(admin.ModelAdmin):
    list_display = ['name', 'gender', 'phone', 'email', 'position', 'party', 'status', 'priority']
    list_filter = ['gender', 'status', 'priority']
    search_fields = ['name', 'description', 'phone', 'email', 'twitter', 'instagram', 'education', 'position', 'party', 'tags']
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_at', 'updated_at', 'deleted_at', 'deleted']  # Add this line
    fieldsets = [
        ('Basic Information', {'fields': ['image', 'name', 'gender', 'birthdate', 'description']}),
        ('Contacts', {'fields': ['phone', 'email', 'twitter', 'instagram']}),
        ('Education & Career', {'fields': ['education', 'position', 'party']}),
        ('Taxonomies', {'fields': ['tags']}),
        ('Administration', {'fields': ['moderators', 'status', 'priority']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_at', 'updated_at', 'deleted_at', 'deleted']}),
    ]

admin.site.register(Candidates, CandidatesAdmin)
class CandidateAdminSite(AdminSite):
    site_header = 'Candidates Administration'
    site_title = 'Candidates Admin'
    index_title = 'Candidates Admin'

candidate_admin_site = CandidateAdminSite(name='candidate')

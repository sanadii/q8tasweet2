# Candidate Admin
from django.contrib import admin
from .models import *

@admin.register(Candidates)
class CandidatesAdmin(admin.ModelAdmin):
    list_display = ['name', 'gender', 'phone', 'email', 'position', 'party', 'status', 'priority']
    list_filter = ['gender', 'status', 'priority']
    search_fields = ['name', 'description', 'phone', 'email', 'twitter', 'instagram', 'education', 'position', 'party', 'tags']
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']  # Add this line
    fieldsets = [
        ('Basic Information', {'fields': ['image', 'name', 'gender', 'birthdate', 'description']}),
        ('Contacts', {'fields': ['phone', 'email', 'twitter', 'instagram']}),
        ('Education & Career', {'fields': ['education', 'position', 'party']}),
        ('Taxonomies', {'fields': ['tags']}),
        ('Administration', {'fields': ['moderators', 'status', 'priority']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

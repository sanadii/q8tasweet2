# Voter Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from apps.voters.models import Voter

class VotersAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'civil', 'family_name', 'gender', 'serial_number', 'membership_no', 'box_no', 'enrollment_date']
    search_fields = ['civil', 'full_name', 'family_name', 'serial_number', 'membership_no', 'box_no']
    list_filter = ['gender', 'enrollment_date']

    fieldsets = [
        ('Basic Information', {'fields': ['civil', 'full_name', 'family_name', 'gender', 'serial_number', 'membership_no', 'box_no', 'enrollment_date', 'relationship', 'notes']}),
    ]

# Voter
admin.site.register(Voter, VotersAdmin)

class VoterAdminSite(AdminSite):
    site_header = 'Voter Administration'
    site_title = 'Voter Admin'
    index_title = 'Voter Admin'

voter_admin_site = VoterAdminSite(name='voter')

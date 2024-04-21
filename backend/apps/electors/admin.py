# Elector Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from apps.electors.models import Elector

# class ElectorsAdmin(admin.ModelAdmin):
#     list_display = ['full_name', 'civil', 'family_name', 'gender', 'serial_number', 'membership_no', 'box_no', 'enrollment_date']
#     search_fields = ['civil', 'full_name', 'family_name', 'serial_number', 'membership_no', 'box_no']
#     list_filter = ['gender', 'enrollment_date']

#     fieldsets = [
#         ('Basic Information', {'fields': ['civil', 'full_name', 'family_name', 'gender', 'serial_number', 'membership_no', 'box_no', 'enrollment_date', 'relationship', 'notes']}),
#     ]

# Elector
# admin.site.register(Elector, ElectorsAdmin)

class ElectorAdminSite(AdminSite):
    site_header = 'Elector Administration'
    site_title = 'Elector Admin'
    index_title = 'Elector Admin'

elector_admin_site = ElectorAdminSite(name='elector')

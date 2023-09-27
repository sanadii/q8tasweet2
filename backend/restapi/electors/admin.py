# Electors Admin
from django.contrib import admin
from restapi.models import Electors

@admin.register(Electors)
class ElectorsAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'civil', 'family_name', 'gender', 'serial_number', 'membership_no', 'box_no', 'enrollment_date']
    search_fields = ['civil', 'full_name', 'family_name', 'serial_number', 'membership_no', 'box_no']
    list_filter = ['gender', 'enrollment_date']

    fieldsets = [
        ('Basic Information', {'fields': ['civil', 'full_name', 'family_name', 'gender', 'serial_number', 'membership_no', 'box_no', 'enrollment_date', 'relationship', 'notes']}),
    ]

# Project Info Admin
from django.contrib import admin
from django.contrib.admin import AdminSite

from apps.settings.models import Setting

class SettingsAdmin(admin.ModelAdmin):
    list_display = ['key', 'value']
    search_fields = ['key',]

# AdminSites
admin.site.register(Setting, SettingsAdmin)

class SettingsAdminSite(AdminSite):
    site_header = 'Settings'
    site_title = 'Settings'
    index_title = 'Settings'

settings_admin_site = SettingsAdminSite(name='settings')


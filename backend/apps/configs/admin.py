# Project Info Admin
from django.contrib import admin
from django.contrib.admin import AdminSite

from apps.configs.models import Config

class ConfigsAdmin(admin.ModelAdmin):
    list_display = ['key', 'value']
    search_fields = ['key',]

# AdminSites
admin.site.register(Config, ConfigsAdmin)

class ConfigsAdminSite(AdminSite):
    site_header = 'Configurations'
    site_title = 'Configurations'
    index_title = 'Configurations'

configs_admin_site = ConfigsAdminSite(name='configs')


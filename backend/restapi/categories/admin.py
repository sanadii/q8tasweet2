# Categories & Tags Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from restapi.models import Categories, Tags, Areas
from restapi.helper.admin_helper import TaskAdminFields, TrackAdminFields, ReadOnlyTrackFields

class AreasAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'is_active']
    search_fields = ['name']
    # list_filter = ['parent', 'is_active']
    prepopulated_fields = {"slug": ("name",)}
    # readonly_fields = ReadOnlyTrackFields

    fieldsets = [
        ('Area Information', {'fields': ['name', 'parent', 'image', 'slug', 'description', 'is_active']}),
        # TrackAdminFields
    ]


class TagsAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    prepopulated_fields = {"slug": ("name",)}
    # readonly_fields = ReadOnlyTrackFields

    fieldsets = [
        ('Tag Information', {'fields': ['name', 'slug']}),
        # TrackAdminFields
    ]

class CategoriesAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'is_active']
    search_fields = ['name']
    # list_filter = ['parent', 'is_active']
    prepopulated_fields = {"slug": ("name",)}
    # readonly_fields = ReadOnlyTrackFields

    fieldsets = [
        ('Category Information', {'fields': ['name', 'parent', 'image', 'slug', 'description', 'is_active']}),
        TrackAdminFields
    ]
    

# AdminSites
admin.site.register(Categories, CategoriesAdmin)
admin.site.register(Tags, TagsAdmin)
admin.site.register(Areas, AreasAdmin)

class CategoryAdminSite(AdminSite):
    site_header = 'Categories Administration'
    site_title = 'Categories Admin'
    index_title = 'Categories Admin'

category_admin_site = CategoryAdminSite(name='category')

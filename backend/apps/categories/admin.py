# Category & Tag Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from apps.categories.models import Category, Tag, Area
from helper.admin_helper import TaskAdminFields, TrackAdminFields, ReadOnlyTrackFields

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
admin.site.register(Category, CategoriesAdmin)
admin.site.register(Tag, TagsAdmin)
admin.site.register(Area, AreasAdmin)

class CategoryAdminSite(AdminSite):
    site_header = 'Category Administration'
    site_title = 'Category Admin'
    index_title = 'Category Admin'

category_admin_site = CategoryAdminSite(name='category')

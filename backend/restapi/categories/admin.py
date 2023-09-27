# Categories & Tags Admin
from django.contrib import admin
from django.contrib.admin import AdminSite
from restapi.models import Categories, Tags, Areas
class AreasAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'is_active']
    search_fields = ['name']
    # list_filter = ['parent', 'is_active']
    prepopulated_fields = {"slug": ("name",)}

    fieldsets = [
        ('Area Information', {'fields': ['name', 'parent', 'image', 'slug', 'description', 'is_active']}),
        # ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    # readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

class TagsAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    prepopulated_fields = {"slug": ("name",)}

    fieldsets = [
        ('Tag Information', {'fields': ['name', 'slug']}),
        # ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    # readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

class CategoriesAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'is_active']
    search_fields = ['name']
    # list_filter = ['parent', 'is_active']
    prepopulated_fields = {"slug": ("name",)}
    
    fieldsets = [
        ('Category Information', {'fields': ['name', 'parent', 'image', 'slug', 'description', 'is_active']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]
    
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']


# AdminSites
admin.site.register(Categories, CategoriesAdmin)
admin.site.register(Tags, TagsAdmin)
admin.site.register(Areas, AreasAdmin)

class CategoryAdminSite(AdminSite):
    site_header = 'Categories Administration'
    site_title = 'Categories Admin'
    index_title = 'Categories Admin'

category_admin_site = CategoryAdminSite(name='category')

# from django.contrib import admin
# from django.contrib.admin import AdminSite
# # Models
# from apps.elections.models import (
#     Election,
#     ElectionCategory,
#     ElectionCandidate,)

# from utils.admin_helper import TaskAdminFields, TrackAdminFields, ReadOnlyTrackFields

# class ElectionsAdmin(admin.ModelAdmin):
#     list_display = ['get_election_name', 'due_date', 'category', 'sub_category', 'elect_seats', 'elect_votes']
#     list_filter = ['category', 'status', 'priority']
#     search_fields = ['sub_category__name', 'description', 'election_method', 'election_result']
#     ordering = ['-due_date', 'sub_category__name']
#     date_hierarchy = 'due_date'
#     readonly_fields = ReadOnlyTrackFields
    
#     def get_election_name(self, obj):
#         return obj.get_dynamic_name()  # Note: here obj is the Election object itself
#     get_election_name.short_description = 'Election Name'
    
#     # Your existing fieldsets
#     fieldsets = [
#         ('Basic Information', {'fields': ['image', 'due_date', 'description']}),
#         ('Taxonomies', {'fields': ['category', 'sub_category', 'tags']}),
#         ('Election Options and Details', {'fields': ['type', 'result', 'votes', 'seats', 'voters', 'attendees']}),
#         TaskAdminFields,
#         TrackAdminFields
#     ]

# class ElectionCandidatesAdmin(admin.ModelAdmin):
#     list_display = ['get_candidate_name', 'get_election_category', 'get_election_subcategory', 'get_election_due_date', 'votes', 'notes']
#     search_fields = ['election__sub_category__name', 'candidate__name',]
#     readonly_fields = ReadOnlyTrackFields

#     fieldsets = [
#         TaskAdminFields,
#         TrackAdminFields
#     ]
    
#     def get_election_category(self, obj):
#         return obj.election.category.name if obj.election and obj.election.category else 'No Category'
#     get_election_category.short_description = 'Election-Category'

#     def get_election_subcategory(self, obj):
#         return obj.election.sub_category.name if obj.election and obj.election.sub_category else 'No Sub-Category'
#     get_election_subcategory.short_description = 'Election Sub-Category'

#     def get_election_due_date(self, obj):
#         return obj.election.due_date if obj.election else 'No Due Date'
#     get_election_due_date.short_description = 'Election Due Date'
    
#     def get_candidate_name(self, obj):
#         return obj.candidate.name
#     get_candidate_name.short_description = 'Candidate Name'
# # class ElectionCommitteesAdmin(admin.ModelAdmin):
# #     list_display = ['name', 'election', 'location']
# #     list_filter = ['election']
# #     search_fields = ['name', 'election__name', 'location']
# #     # readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_at', 'updated_at', 'deleted_at', 'is_deleted']

# # class ElectionCommitteeResultsAdmin(admin.ModelAdmin):
# #     list_display = ['id']



# class CategoriesAdmin(admin.ModelAdmin):
#     list_display = ['name', 'parent', 'is_active']
#     search_fields = ['name']
#     # list_filter = ['parent', 'is_active']
#     prepopulated_fields = {"slug": ("name",)}
#     # readonly_fields = ReadOnlyTrackFields

#     fieldsets = [
#         ('Category Information', {'fields': ['name', 'parent', 'image', 'slug', 'description', 'is_active']}),
#         TrackAdminFields
#     ]
    

# class CategoryAdminSite(AdminSite):
#     site_header = 'Category Administration'
#     site_title = 'Category Admin'
#     index_title = 'Category Admin'

# category_admin_site = CategoryAdminSite(name='category')


# # AdminSites
# admin.site.register(Election, ElectionsAdmin)
# admin.site.register(ElectionCategory, CategoriesAdmin)
# admin.site.register(ElectionCandidate, ElectionCandidatesAdmin)
# # admin.site.register(ElectionCommittee, ElectionCommitteesAdmin)
# # admin.site.register(ElectionCommitteeResult, ElectionCommitteeResultsAdmin)

# class ElectionAdminSite(AdminSite):
#     site_header = 'Election Administration'
#     site_title = 'Election Admin'
#     index_title = 'Election Admin'

# election_admin_site = ElectionAdminSite(name='election')

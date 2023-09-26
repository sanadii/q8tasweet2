from django.contrib import admin
from .models import *

# admin.site.register(Guarantees)
class CategoriesInline(admin.StackedInline):  # You can also use TabularInline if you prefer
    model = Categories
    can_delete = False
    verbose_name_plural = 'Categories'

class TagsInline(admin.StackedInline):  # Again, TabularInline is an alternative
    model = Tags
    can_delete = False
    verbose_name_plural = 'Tags'

@admin.register(Elections)
class ElectionsAdmin(admin.ModelAdmin):
    list_display = ['get_name', 'duedate', 'category', 'sub_category', 'seats', 'votes']
    list_filter = ['category', 'status', 'priority']
    search_fields = ['sub_category__name', 'description', 'type', 'result']
    ordering = ['-duedate', 'sub_category__name']
    date_hierarchy = 'duedate'
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']  # Keep this line
    
    def get_name(self, obj):
        if obj.sub_category:
            if obj.duedate:
                year = obj.duedate.year
                return f"{obj.sub_category.name} - {year}"
            else:
                return f"{obj.sub_category.name} - No Due Date"
        return "No Sub Category"  # Return a default name if sub_category is None
    
    get_name.short_description = 'Name'  # Sets the column title in the admin interface
    
    # Your existing fieldsets
    fieldsets = [
        ('Basic Information', {'fields': ['image', 'get_name', 'duedate', 'description']}),
        ('Taxonomies', {'fields': ['category', 'sub_category', 'tags']}),
        ('Election Options and Details', {'fields': ['type', 'result', 'votes', 'seats', 'electors', 'attendees']}),
        ('Administration', {'fields': ['moderators', 'status', 'priority']}),
        ('Tracking Information', {'fields': readonly_fields}),
    ]

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

@admin.register(ElectionCandidates)
class ElectionCandidatesAdmin(admin.ModelAdmin):
    list_display = ['get_candidate_name', 'get_election_name', 'get_election_category', 'get_election_subcategory', 'votes', 'position', 'is_winner', 'status', 'priority']
    list_filter = ['is_winner', 'status', 'priority']
    search_fields = ['election__name', 'candidate__name', 'position']
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

    fieldsets = [
        ('Basic Information', {'fields': ['election', 'candidate', 'votes', 'position', 'is_winner']}),
        ('Administration', {'fields': ['moderators', 'status', 'priority', 'notes', 'is_active']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    def get_election_name(self, obj):
        return obj.election.name
    get_election_name.short_description = 'Election Name'
    
    def get_election_category(self, obj):
        return obj.election.category
    get_election_category.short_description = 'Election Category'

    def get_election_subcategory(self, obj):
        return obj.election.sub_category
    get_election_subcategory.short_description = 'Election Sub-Category'

    def get_candidate_name(self, obj):
        return obj.candidate.name
    get_candidate_name.short_description = 'Candidate Name'

@admin.register(ElectionCommittees)
class ElectionCommitteesAdmin(admin.ModelAdmin):
    list_display = ['name', 'election', 'location']
    list_filter = ['election']
    search_fields = ['name', 'election__name', 'location']
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

@admin.register(Campaigns)
class CampaignsAdmin(admin.ModelAdmin):
    list_display = ['election_candidate', 'status', 'priority', 'website']
    list_filter = ['status', 'priority']
    search_fields = ['title', 'election_candidate__candidate__name', 'description']
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

    fieldsets = [
        ('Basic Information', {'fields': ['election_candidate', 'description', 'results']}),
        ('Contacts', {'fields': ['twitter', 'instagram', 'website']}),
        # ('Activities', {'fields': ['events', 'attendees', 'media_coverage', 'results']}),
        # ('Administration', {'fields': ['moderators', 'status', 'priority']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

@admin.register(CampaignMembers)
class CampaignMembersAdmin(admin.ModelAdmin):
    def rank_display(self, obj):
        rank_dict = {
            1: "Party",
            2: "Candidate",
            3: "Supervisor",
            4: "Guarantor",
            5: "Attendant",
            6: "Sorter",
            10: "Moderator",
        }
        return rank_dict.get(obj.rank, "Unknown")
    
    rank_display.short_description = 'Rank'

    list_display = ['user', 'campaign', 'rank_display', 'supervisor', 'committee', 'civil', 'mobile', 'status']
    list_filter = ['campaign', 'rank']
    search_fields = ['user__username', 'campaign__title', 'committee__name']  # Searching by user's username and campaign's title and committee's name
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

    fieldsets = [
        ('Basic Information', {'fields': ['user', 'campaign', 'rank', 'supervisor', 'committee', 'civil', 'mobile', 'notes', 'status']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

@admin.register(Electors)
class ElectorsAdmin(admin.ModelAdmin):
    list_display = ['civil', 'full_name', 'family_name', 'gender', 'serial_number', 'membership_no', 'box_no', 'enrollment_date']
    search_fields = ['civil', 'full_name', 'family_name', 'serial_number', 'membership_no', 'box_no']
    list_filter = ['gender', 'enrollment_date']

    fieldsets = [
        ('Basic Information', {'fields': ['civil', 'full_name', 'family_name', 'gender', 'serial_number', 'membership_no', 'box_no', 'enrollment_date', 'relationship', 'notes']}),
    ]

@admin.register(CampaignGuarantees)
class CampaignGuaranteesAdmin(admin.ModelAdmin):
    list_display = ['campaign', 'member', 'civil', 'mobile', 'notes', 'status']
    search_fields = ['campaign__title', 'member__user__username', 'civil__full_name', 'mobile']
    list_filter = ['campaign', 'member', 'status']

    fieldsets = [
        ('Basic Information', {'fields': ['campaign', 'member', 'civil', 'mobile', 'notes', 'status']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

@admin.register(ElectionAttendees)
class ElectionAttendeesAdmin(admin.ModelAdmin):
    list_display = ['user', 'election', 'committee', 'elector', 'notes', 'status']
    search_fields = ['user__username', 'election__title', 'committee__name', 'elector__full_name']
    list_filter = ['election', 'committee', 'status']

    fieldsets = [
        ('Basic Information', {'fields': ['user', 'election', 'committee', 'elector', 'notes', 'status']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

@admin.register(Areas)
class AreasAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'is_active']
    search_fields = ['name']
    # list_filter = ['parent', 'is_active']
    prepopulated_fields = {"slug": ("name",)}

    fieldsets = [
        ('Area Information', {'fields': ['name', 'parent', 'image', 'slug', 'description', 'is_active']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    prepopulated_fields = {"slug": ("name",)}

    fieldsets = [
        ('Tag Information', {'fields': ['name', 'slug']}),
        ('Tracking Information', {'fields': ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']}),
    ]

    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

@admin.register(Categories)
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


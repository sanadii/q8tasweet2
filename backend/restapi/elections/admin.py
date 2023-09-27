from django.contrib import admin
from restapi.models import Elections, ElectionCandidates, ElectionCommittees

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


@admin.register(ElectionCandidates)
class ElectionCandidatesAdmin(admin.ModelAdmin):
    list_display = ['get_candidate_name', 'get_election_name', 'get_election_category', 'get_election_subcategory', 'votes', 'status', 'priority']
    list_filter = ['status', 'priority']
    search_fields = ['election__name', 'candidate__name',]
    readonly_fields = ['created_by', 'updated_by', 'deleted_by', 'created_date', 'updated_date', 'deleted_date', 'deleted']

    fieldsets = [
        ('Basic Information', {'fields': ['election', 'candidate', 'votes']}),
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

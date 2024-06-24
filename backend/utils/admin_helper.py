# admin_utilspy

# Task fields
TaskAdminFields = ('Administration', {
    'fields': ['moderators', 'status', 'priority']
})

# Tracking fields
TrackAdminFields = ('Tracking Information', {
    'fields': ['created_by', 'updated_by', 'deleted_by', 'created_at', 'updated_at', 'is_deleted']
})

# Readonly tracking fields
ReadOnlyTrackFields = ['created_by', 'updated_by', 'deleted_by', 'created_at', 'updated_at', 'is_deleted']

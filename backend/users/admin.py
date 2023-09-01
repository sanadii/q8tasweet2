from django.contrib import admin
from users.models import User
from django.contrib.auth.admin import UserAdmin
from django.forms import TextInput, Textarea, CharField
from django import forms
from django.db import models


class UserAdminConfig(UserAdmin):
    model = User
    search_fields = ('email', 'username', 'first_name', 'last_name',)
    list_filter = ('is_active', 'is_staff')
    ordering = ('-created_date',)
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'username', 'first_name', 'last_name',)}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')}),
        ('Personal', {'fields': ('about',)}),
    )
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 20, 'cols': 60})},
    }
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2', 'is_active', 'is_staff', 'groups', 'user_permissions')}
         ),
    )


admin.site.register(User, UserAdminConfig)

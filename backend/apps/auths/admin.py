from django.contrib import admin
from django.contrib.admin import AdminSite
from .models import User
from django.contrib.auth.admin import UserAdmin
from django.forms import TextInput, Textarea, CharField
from django import forms
from django.db import models


from django.contrib import admin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = UserCreationForm.Meta.fields + ('first_name', 'last_name',)

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = UserChangeForm.Meta.fields

class UserAdminConfig(UserAdmin):
    model = User
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    search_fields = ('email', 'username', 'first_name', 'last_name',)
    list_filter = ('is_active', 'is_staff')
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'username', 'first_name', 'last_name', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')}),
        ('Personal', {'fields': ('description',)}),
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

<<<<<<< HEAD


# # AdminSites
# admin.site.register(User, UserAdminConfig)

# class AuthAdminSite(AdminSite):
#     site_header = 'Authentication Administration'
#     site_title = 'Authentication Admin'
#     index_title = 'Authentication Admin'

# auth_admin_site = AuthAdminSite(name='authentication')
# auth_admin_site.register(User, UserAdminConfig)

=======
>>>>>>> sanad
admin.site.register(User, UserAdminConfig)

class UserAdminSite(admin.AdminSite):
    site_header = 'User Administration'
    site_title = 'User Admin'
    index_title = 'User Admin'

user_admin_site = UserAdminSite(name='user_admin')

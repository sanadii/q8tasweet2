from django.contrib import admin

# Register your models here.

from .models import *

admin.site.register(Guarantees)
admin.site.register(Elections)
admin.site.register(Menu)
admin.site.register(Permission)
admin.site.register(Sorting)
admin.site.register(UserRank)
# admin.site.register(Users)
admin.site.register(UsersRole)
admin.site.register(Voters)
admin.site.register(PermissionMenu)
admin.site.register(TeamMembers)


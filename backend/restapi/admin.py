# restapi/admin.py
from django.contrib import admin

from .campaigns.models import Campaigns
from .candidates.models import Candidates
from .categories.models import Categories
from .elections.models import Elections
from .electors.models import Electors
from .projectInfo.models import ProjectInfo
from .users.models import User

admin.site.register(Campaigns)
admin.site.register(Candidates)
admin.site.register(Categories)
admin.site.register(Elections)
admin.site.register(Electors)
admin.site.register(ProjectInfo)
admin.site.register(User)
# Register other models as needed

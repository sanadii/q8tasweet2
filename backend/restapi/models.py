# restapi/models.py

from django.db import models
from .campaigns.models import Campaigns, CampaignMembers, CampaignGuarantees, ElectionAttendees
from .candidates.models import Candidates
from .categories.models import Categories, Tags, Areas
from .elections.models import Elections, ElectionCandidates, ElectionCommittees, ElectionCommitteeResults
from .electors.models import Electors
from .configs.models import Configs
from .users.models import User

# If you need to create overarching models, define them here.

# restapi/models.py

from django.db import models
from restapi.campaigns.models import Campaigns, CampaignMembers, CampaignGuarantees, CampaignAttendees
from restapi.candidates.models import Candidates
from restapi.categories.models import Categories, Tags, Areas
from restapi.elections.models import Elections, ElectionCandidates, ElectionCommittees, ElectionCommitteeResults
from restapi.electors.models import Electors
from restapi.configs.models import Configs
from restapi.users.models import User

# If you need to create overarching models, define them here.

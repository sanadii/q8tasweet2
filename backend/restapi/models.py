# restapi/models.py

from django.db import models
from restapi.campaigns.models import (
    Campaign,
    CampaignMember,
    CampaignGuarantee,
    CampaignAttendee
    )
from restapi.candidates.models import Candidate
from restapi.categories.models import (
    Category,
    Tag,
    Area
    )
from restapi.elections.models import (
    Election,
    ElectionCandidate,
    ElectionCommittee,
    ElectionCommitteeResult
)
from restapi.electors.models import Elector
from restapi.configs.models import Config
from restapi.auth.models import User

# If you need to create overarching models, define them here.

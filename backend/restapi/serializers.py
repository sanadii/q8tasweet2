# restapi/serializers.py
from restapi.base_serializer import TrackingSerializer, AdminControlSerializer
from restapi.users.serializers import UserSerializer
from .elections.serializers import (
    ElectionsSerializer,
    ElectionCandidatesSerializer,
    ElectionCommitteesSerializer,
    ElectionCommitteeResultsSerializer
)

from .candidates.serializers import CandidatesSerializer

from .campaigns.serializers import (
    CampaignsSerializer,
    CampaignElectionSerializer,
    CampaignCandidateSerializer,
    CampaignMembersSerializer,
    CampaignGuaranteesSerializer,
    CampaignDetailsSerializer,
    ElectionAttendeesSerializer
)

from .electors.serializers import ElectorsSerializer

from .categories.serializers import CategoriesSerializer, SubCategoriesSerializer

from .configs.serializers import ConfigsSerializer

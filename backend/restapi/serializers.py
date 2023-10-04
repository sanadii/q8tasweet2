# restapi/serializers.py
from restapi.helper.base_serializer import TrackMixin, TaskMixin
from restapi.users.serializers import UserSerializer
from restapi.elections.serializers import (
    ElectionsSerializer,
    ElectionCandidatesSerializer,
    ElectionCommitteesSerializer,
    ElectionCommitteeResultsSerializer
)

from restapi.candidates.serializers import (
    CandidatesSerializer,
    # CandidateElectionsSerializer,
    # CandidateCampaignsSerializer,
)

from restapi.campaigns.serializers import (
    CampaignsSerializer,
    CampaignElectionSerializer,
    CampaignCandidateSerializer,
    CampaignMembersSerializer,
    CampaignGuaranteesSerializer,
    CampaignDetailsSerializer,
    ElectionAttendeesSerializer
)

from restapi.electors.serializers import ElectorsSerializer

# Will be changed to Taxonomies
from restapi.categories.serializers import CategoriesSerializer, SubCategoriesSerializer

from restapi.configs.serializers import ConfigsSerializer

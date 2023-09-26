# Importing all serializers from sub-apps
from .users.serializers import UserSerializer
from .campaigns.serializers import CampaignsSerializer, CampaignElectionSerializer, CampaignCandidateSerializer, CampaignMembersSerializer, CampaignGuaranteesSerializer, CampaignDetailsSerializer, ElectionAttendeesSerializer
from .candidates.serializers import CandidatesSerializer
from .categories.serializers import CategoriesSerializer, SubCategoriesSerializer
from .elections.serializers import ElectionsSerializer, ElectionCandidatesSerializer, ElectionCommitteesSerializer, ElectionCommitteeResultsSerializer
from .electors.serializers import ElectorsSerializer
from .projectInfo.serializers import ProjectInfoSerializer

# If needed, you can also create additional serializers in this file

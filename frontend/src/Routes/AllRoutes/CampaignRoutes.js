//  Campaign Dashboard
import CampaignDashboardLayout from "../../Layouts/CampaignDashboardLayout";
import OverviewTab from "pages/Campaigns/CampaignDetails/OverviewTab";

import MembersTab from "pages/Campaigns/CampaignDetails/MembersTab";

import GuaranteesTab from "pages/Campaigns/CampaignDetails/GuaranteesTab";
import MyGuaranteesTab from "pages/Campaigns/CampaignDetails/GuaranteesTab/MyGuaranteesTab";
import GuaranteeGroupsTab from "pages/Campaigns/CampaignDetails/GuaranteeGroupsTab";

import AttendeesTab from "pages/Campaigns/CampaignDetails/AttendeesTab";
import SortingTab from "pages/Campaigns/CampaignDetails/SortingTab";

import CommitteesTab from "pages/Campaigns/CampaignDetails/CommitteesTab";
import EditTab from "pages/Campaigns/CampaignDetails/EditTab";

import ActivitiesTab from "pages/Campaigns/CampaignDetails/ActivitiesTab";

// Election
import CandidatesTab from "pages/Campaigns/CampaignDetails/CandidatesTab";
import VotersTab from "pages/Campaigns/CampaignDetails/VotersTab";

const CampaignRoutes = [
    // Campaign Special Dashboard
    { path: "/campaign", component: <OverviewTab /> },
    { path: "/campaign/overview", component: <OverviewTab /> },
    { path: "/campaign/guarantees", component: <GuaranteesTab /> },
    { path: "/campaign/my-guarantees", component: <MyGuaranteesTab /> },
    { path: "/campaign/guarantee-groups", component: <GuaranteeGroupsTab /> },
    { path: "/campaign/attendees", component: <AttendeesTab /> },
    { path: "/campaign/sorting", component: <SortingTab /> },

    { path: "/campaign/committees", component: <CommitteesTab /> },
    { path: "/campaign/members", component: <MembersTab /> },
    { path: "/campaign/edit", component: <EditTab /> },

    // Election
    { path: "/campaign/candidates", component: <CandidatesTab /> },
    { path: "/campaign/voters", component: <VotersTab /> },
]
export default CampaignRoutes;
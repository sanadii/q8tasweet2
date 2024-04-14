//  Campaign Dashboard
import CampaignDashboardLayout from "../../Layouts/CampaignDashboardLayout";
import OverviewTab from "pages/CampaignDetails/OverviewTab";

import MembersTab from "pages/CampaignDetails/MembersTab";

import GuaranteesTab from "pages/CampaignDetails/GuaranteesTab";

import AttendeesTab from "pages/CampaignDetails/AttendeesTab";
import SortingTab from "pages/CampaignDetails/SortingTab";

import CommitteesTab from "pages/CampaignDetails/CommitteesTab";
import EditTab from "pages/CampaignDetails/EditTab";

import ActivitiesTab from "pages/CampaignDetails/ActivitiesTab";

// Election
import CandidatesTab from "pages/CampaignDetails/CandidatesTab";
import VotersTab from "pages/CampaignDetails/VotersTab";

const CampaignRoutes = [
    // Campaign Special Dashboard
    { path: "/campaign", component: <OverviewTab /> },
    { path: "/campaign/overview", component: <OverviewTab /> },
    { path: "/campaign/guarantees", component: <GuaranteesTab /> },
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
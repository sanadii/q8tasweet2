//  Campaign Dashboard
import CampaignDashboardLayout from "../../Layouts/CampaignDashboardLayout";
<<<<<<< HEAD
import OverviewTab from "pages/Campaigns/CampaignDetails/OverviewTab";
import MembersTab from "pages/Campaigns/CampaignDetails/MembersTab";
import GuaranteesTab from "pages/Campaigns/CampaignDetails/GuaranteesTab";
import AttendeesTab from "pages/Campaigns/CampaignDetails/AttendeesTab";
import SortingTab from "pages/Campaigns/CampaignDetails/SortingTab";
// import ElectorsTab from "pages/Campaigns/CampaignDetails./ElectorsTab";
import ActivitiesTab from "pages/Campaigns/CampaignDetails/ActivitiesTab";
import EditTab from "pages/Campaigns/CampaignDetails/EditTab";

const CampaignRoutes = [
    // Campaign Special Dashboard
    { path: "/dashboard/campaigns/:slug/overview", component: <OverviewTab /> },
    { path: "/dashboard/campaigns/:slug/members", component: <MembersTab /> },
    { path: "/dashboard/campaigns/:slug/guarantees", component: <GuaranteesTab /> },
    { path: "/dashboard/campaigns/:slug/attendees", component: <AttendeesTab /> },
    { path: "/dashboard/campaigns/:slug/edit", component: <EditTab /> },
=======
import OverviewTab from "pages/CampaignDetails/OverviewTab";

import MembersTab from "pages/CampaignDetails/MembersTab";

import GuaranteesTab from "pages/CampaignDetails/GuaranteesTab";

import AttendeesTab from "pages/CampaignDetails/AttendeesTab";
import SortingTab from "pages/CampaignDetails/SortingTab";

import CommitteesTab from "pages/ElectionDetails/CommitteesTab";
import EditTab from "pages/CampaignDetails/EditTab";

import ActivitiesTab from "pages/CampaignDetails/ActivitiesTab";

// Election
import CandidatesTab from "pages/CampaignDetails/CandidatesTab";
import SearchTab from "pages/Electors/SearchTab";

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
    { path: "/campaign/electors-search", component: <SearchTab /> },
>>>>>>> sanad
]
export default CampaignRoutes;
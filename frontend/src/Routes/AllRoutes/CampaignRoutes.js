//  Campaign Dashboard
import CampaignDashboardLayout from "../../Layouts/CampaignDashboardLayout";
import OverviewTab from "pages/CampaignDetails/OverviewTab";

import MembersTab from "pages/CampaignDetails/MembersTab";

import GuaranteesTab from "pages/CampaignDetails/GuaranteesTab";

import AttendeesTab from "pages/CampaignDetails/AttendeesTab";
import SortingTab from "pages/CampaignDetails/SortingTab";
import ResultsTab from "pages/ElectionDetails/ResultsTab";
import CommitteesTab from "pages/ElectionDetails/CommitteesTab";
import EditTab from "pages/CampaignDetails/EditTab";

import ActivitiesTab from "pages/CampaignDetails/ActivitiesTab";

// Election
import CandidatesTab from "pages/CampaignDetails/CandidatesTab";
import SearchTab from "pages/Electors/SearchTab";
import ElectorAttendance from "pages/Electors/ElectorAttendance";

const CampaignRoutes = [
    // Campaign Special Dashboard
    { path: "/campaign", component: <OverviewTab /> },
    { path: "/campaign/overview", component: <OverviewTab /> },
    { path: "/campaign/guarantees", component: <GuaranteesTab /> },
    { path: "/campaign/attendees", component: <AttendeesTab /> },
    { path: "/campaign/sorting", component: <SortingTab /> },
    { path: "/campaign/results", component: <ResultsTab /> },

    { path: "/campaign/committees", component: <CommitteesTab /> },
    { path: "/campaign/members", component: <MembersTab /> },
    { path: "/campaign/edit", component: <EditTab /> },

    // Election
    { path: "/campaign/candidates", component: <CandidatesTab /> },
    { path: "/campaign/electors-search", component: <SearchTab /> },
    { path: "/campaign/electors-attendance", component: <ElectorAttendance /> },

]
export default CampaignRoutes;
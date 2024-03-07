//  Campaign Dashboard
import CampaignDashboardLayout from "../../Layouts/CampaignDashboardLayout";
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
]
export default CampaignRoutes;
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
    { path: "/:slug", component: <OverviewTab /> },
    { path: "/:slug/overview", component: <OverviewTab /> },
    { path: "/:slug/members", component: <MembersTab /> },
    { path: "/:slug/guarantees", component: <GuaranteesTab /> },
    { path: "/:slug/attendees", component: <AttendeesTab /> },
    { path: "/:slug/edit", component: <EditTab /> },
]
export default CampaignRoutes;
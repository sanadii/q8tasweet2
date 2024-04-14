import React from "react";


// User profile
import UserProfile from "pages/Profile";
import ProfileEdit from "pages/Profile/EditProfile";


// Main
import Dashboard from "pages/Dashboard";
import ControlPanel from "pages/ControlPanel";

// Settings
import Settings from "pages/Admin/Settings";
import Categories from "pages/Admin/Categories";
import Groups from "pages/Admin/Groups";
import GroupPermissions from "pages/Admin/GroupPermissions";

// Election Pages
import ElectionList from "pages/Elections/ElectionList";
import ElectionDetails from "pages/ElectionDetails";

// Candidates Pages
import CandidateList from "pages/Candidates/CandidateList";
import CandidateDetails from "pages/Candidates/CandidateDetails";

// Candidates Pages
import PartyList from "pages/Parties/PartyList";
import PartyDetails from "pages/Parties/PartyDetails";


// Campaign Pages
import CampaignList from "pages/Campaigns/CampaignList";
import CampaignGrid from "pages/Campaigns/CampaignList/CampaignGrid";
import CampaignDetails from "pages/CampaignDetails";

// User Pages
import UserList from "pages/Users/UserList";

// Test Pages
import Test1 from "pages/Tests/Test1";
import Test2 from "pages/Tests/Test2";

const DashboardRoutes = [
    { path: "/dashboard", component: <Dashboard /> },
    { path: "/control-panel", component: <ControlPanel /> },

    // Admin Lists -------

    // Elections
    { path: "/dashboard/elections/", component: <ElectionList /> },
    { path: "/dashboard/elections/:slug", component: <ElectionDetails /> },

    // Candidates
    { path: "/dashboard/candidates/", component: <CandidateList /> },
    { path: "/dashboard/candidates/:slug", component: <CandidateDetails /> },

    // Parties
    { path: "/dashboard/parties/:slug", component: <PartyDetails /> },
    { path: "/dashboard/parties/", component: <PartyList /> },

    // Campaigns
    { path: "/dashboard/campaigns", component: <CampaignList /> },
    { path: "/dashboard/campaigns/:slug", component: <CampaignDetails /> },

    { path: "/dashboard/users/", component: <UserList /> },

    // Settings / Options
    { path: "/dashboard/categories", component: <Categories /> },
    { path: "/dashboard/groups", component: <Groups /> },
    { path: "/dashboard/permissions", component: <GroupPermissions /> },

    // Tests
    { path: "/dashboard/test1/", component: <Test1 /> },
    { path: "/dashboard/test2/", component: <Test2 /> },


    // Single Page


    // {
    //     path: "/dashboard/campaigns/:slug",
    //     element: <CampaignDashboardLayout />,
    //     children: [
    //         { path: "overview", element: <OverviewTab /> },
    //         { path: "members", element: <MembersTab /> },
    //         { path: "guarantees", element: <GuaranteesTab /> },
    //         { path: "attendees", element: <AttendeesTab /> },
    //         { path: "edit", element: <EditTab /> },
    //         // ... other nested routes
    //     ],
    // },

    // Members
    // { path: "/members", component: <MemberList /> },
    // { path: "/members/:id", component: <MemberDetails /> },


    //User Profile
    { path: "/dashboard/profile", component: <UserProfile /> },
    // { path: "/dashboard/profile-edit", component: <ProfileEdit /> },

]


export default DashboardRoutes;

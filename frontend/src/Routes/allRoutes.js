import React from "react";
import { Navigate } from "react-router-dom";

// Auth
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User profile
import UserProfile from "../pages/Authentication/Profile";
import ProfileSettings from "../pages/Authentication/Profile/Settings";
// user edit profile

//Dashboard

// ------------------ ADMIN PAGES -------------------------
import Settings from "../pages/Admin/Settings";
import Categories from "../pages/Admin/Settings/Categories";

// import Alphabet from "../pages/Alphabet";

import Dashboard from "../pages/Dashboard";


// Election Pages
import ElectionList from "../pages/Elections/ElectionList";
import ElectionDetails from "../pages/Elections/ElectionDetails";

// Candidates Pages
import CandidateList from "../pages/Candidates/CandidateList";
import CandidateDetails from "../pages/Candidates/CandidateDetails";

// Campaign Pages
import CampaignList from "../pages/Campaigns/CampaignList";
import CampaignGrid from "../pages/Campaigns/CampaignList/CampaignGrid";
import CampaignDetails from "../pages/Campaigns/CampaignDetails";


// User Pages
import UserList from "../pages/Users/UserList";

// //AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";
import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";

import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";
import CoverPasswReset from "../pages/AuthenticationInner/PasswordReset/CoverPasswReset";

import BasicLockScreen from "../pages/AuthenticationInner/LockScreen/BasicLockScr";
import CoverLockScreen from "../pages/AuthenticationInner/LockScreen/CoverLockScr";

import BasicLogout from "../pages/AuthenticationInner/Logout/BasicLogout";
import CoverLogout from "../pages/AuthenticationInner/Logout/CoverLogout";

import BasicSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
import CoverSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg";
import BasicTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
import CoverTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify";

import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";

import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

// // User Profile

// import FileManager from "../pages/FileManager";
// import ToDoList from "../pages/ToDo";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/index", component: <Dashboard /> },

  // Admin: Options, settings, Saved, Favourites,Switch Account, User Activities
  // Website: Name, Description, email, whatsapp,
  // Account & Profile
  // Personal Details
  // Emails
  // Notifications
  // Like & Follow

  // ------------------------ Admin ------------------------
  // Admin Options
  { path: "/settings", component: <Settings /> },
  { path: "/settings/categories", component: <Categories /> },

  // Admin Lists
  { path: "/admin/campaigns", component: <CampaignList /> },
  { path: "/admin/candidates/", component: <CandidateList /> },
  { path: "/admin/elections/", component: <ElectionList /> },
  { path: "/admin/users/", component: <UserList /> },



  // ---------------------- Subscribers ---------------------
  { path: "/campaigns", component: <CampaignGrid /> },



  // ------------------------- Common -----------------------
  { path: "/elections/:id", component: <ElectionDetails /> },
  { path: "/campaigns/:id", component: <CampaignDetails /> },
  // { path: "/campaigns/:id", component: <CampaignDetails /> },
  // { path: "/candidates/:id", component: <CandidateDetails /> },

  // Members
  // { path: "/members", component: <MemberList /> },
  // { path: "/members/:id", component: <MemberDetails /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },
  { path: "/profile-settings", component: <ProfileSettings /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

// Public Routes
const publicRoutes = [
  // Others
  // { path: "/alphabet", component: <Alphabet /> },

  // Authentication Pages
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signin-cover", component: <CoverSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/auth-signup-cover", component: <CoverSignUp /> },
  { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
  { path: "/auth-pass-reset-cover", component: <CoverPasswReset /> },
  { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  { path: "/auth-lockscreen-cover", component: <CoverLockScreen /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-logout-cover", component: <CoverLogout /> },
  { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  { path: "/auth-success-msg-cover", component: <CoverSuccessMsg /> },
  { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  { path: "/auth-twostep-cover", component: <CoverTwosVerify /> },
  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },

  { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> },
  { path: "/auth-pass-change-cover", component: <CoverPasswCreate /> },
  { path: "/auth-offline", component: <Offlinepage /> },
];

export { authProtectedRoutes, publicRoutes };

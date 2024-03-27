import React from "react";
import { Navigate } from "react-router-dom";

import BasicSignIn from "pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "pages/AuthenticationInner/Login/CoverSignIn";
import BasicSignUp from "pages/AuthenticationInner/Register/BasicSignUp";
import CoverSignUp from "pages/AuthenticationInner/Register/CoverSignUp";

import BasicPasswReset from "pages/AuthenticationInner/PasswordReset/BasicPasswReset";
import CoverPasswReset from "pages/AuthenticationInner/PasswordReset/CoverPasswReset";

import BasicLockScreen from "pages/AuthenticationInner/LockScreen/BasicLockScr";
import CoverLockScreen from "pages/AuthenticationInner/LockScreen/CoverLockScr";

import BasicLogout from "pages/AuthenticationInner/Logout/BasicLogout";
import CoverLogout from "pages/AuthenticationInner/Logout/CoverLogout";

import BasicSuccessMsg from "pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
import CoverSuccessMsg from "pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg";
import BasicTwosVerify from "pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
import CoverTwosVerify from "pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify";

import Basic404 from "pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "pages/AuthenticationInner/Errors/Alt404";
import Error500 from "pages/AuthenticationInner/Errors/Error500";

import BasicPasswCreate from "pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";

import Offlinepage from "pages/AuthenticationInner/Errors/Offlinepage";


// Frontend Pages
import Public from "pages/Public";
import ElectionGrid from "pages/Public/ElectionGrid";
import CandidateGrid from "pages/Public/CandidateGrid";
import AboutUs from "pages/Public/AboutUs";
import ContactUs from "pages/Public/ContactUs";
import PublicElectionDetails from "pages/Public/PublicElectionDetails";

// Authentication Pages
import Login from "pages/Authentication/Login";
import ForgetPasswordPage from "pages/Authentication/ForgetPassword";
import Logout from "pages/Authentication/Logout";
import Register from "pages/Authentication/Register";


const PublicRoutes = [
    // Public Pages
    { path: "/", component: <Public /> },
    { path: "elections/:slug", component: <PublicElectionDetails /> },
    { path: "elections", component: <ElectionGrid /> },
    { path: "candidates", component: <CandidateGrid /> },
    { path: "about-us", component: <AboutUs /> },
    { path: "contact-us", component: <ContactUs /> },
    // { path: "/campaigns", component: <CampaignGrid /> },


    // Authentication Pages
    { path: "/logout", component: <Logout /> },
    { path: "/login", component: <Login /> },
    { path: "/forgot-password", component: <ForgetPasswordPage /> },
    { path: "/register", component: <Register /> },


    //AuthenticationInner pages
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

export default PublicRoutes;

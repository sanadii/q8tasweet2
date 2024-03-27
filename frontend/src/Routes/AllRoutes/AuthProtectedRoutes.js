import React from "react";
import { Navigate } from "react-router-dom";

import UserProfile from "pages/Authentication/Profile/ViewProfile";
import ProfileEdit from "pages/Authentication/Profile/EditProfile";

const AuthProtectedRoutes = [
    // User Profile
    { path: "/profile-edit", component: <ProfileEdit /> },

    // Redirects and Error Handling
    { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
    { path: "*", component: <Navigate to="/dashboard" /> },
];

export default AuthProtectedRoutes;

import React from "react";
import { Navigate } from "react-router-dom";

// import UserProfile from "pages/Profile";
// import ProfileEdit from "pages/Profile/EditProfile";

const AuthProtectedRoutes = [
    // User Profile
    // { path: "/profile", component: <UserProfile /> },

    // Redirects and Error Handling
    { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
    { path: "*", component: <Navigate to="/dashboard" /> },
];

export default AuthProtectedRoutes;

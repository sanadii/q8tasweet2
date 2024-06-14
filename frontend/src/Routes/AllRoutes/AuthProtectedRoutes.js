import React from "react";
import { Navigate } from "react-router-dom";

<<<<<<< HEAD
import UserProfile from "pages/Authentication/Profile/ViewProfile";
import ProfileEdit from "pages/Authentication/Profile/EditProfile";

const AuthProtectedRoutes = [
    // User Profile
    { path: "/profile-edit", component: <ProfileEdit /> },
=======
// import UserProfile from "pages/Profile";
// import ProfileEdit from "pages/Profile/EditProfile";

const AuthProtectedRoutes = [
    // User Profile
    // { path: "/profile", component: <UserProfile /> },
>>>>>>> sanad

    // Redirects and Error Handling
    { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
    { path: "*", component: <Navigate to="/dashboard" /> },
];

export default AuthProtectedRoutes;

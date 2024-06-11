import React, { useEffect, useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useSelector, useDispatch } from "react-redux";
import { useProfile } from "../shared/hooks/UserHooks";
import { getCurrentUser, logoutUser } from "../store/actions";

const AuthProtected = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.Users.currentUser);
  const { userProfile, loading, token } = useProfile();

  // This state determines if the check for user authentication is complete.
  const inUserLoggedIn = token
  const isUserLoggedOut = !token

  console.log("How many times? AuthProtected")


  useEffect(() => {
    if (inUserLoggedIn) {
      setAuthorization(token);
      dispatch(getCurrentUser());
    } else {
      dispatch(logoutUser());
    }
  }, [inUserLoggedIn, dispatch]);

  console.log("token: ", token, "user: ", user, "userProfile: ", userProfile)

  if (!token) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }


  if (!user || user.length === 0) {
    return <div>Loading...</div>;
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export { AuthProtected, AccessRoute };

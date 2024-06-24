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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && userProfile && !loading && token) {
      setAuthorization(token);
      dispatch(getCurrentUser());
      setInitialized(true);
    } else if (!initialized && !userProfile && loading && !token) {
      dispatch(logoutUser());
      setInitialized(true);
    }
  }, [userProfile, loading, token, dispatch, initialized]);

  if (!token) {
    return <Navigate to={{ pathname: "/login", state: { from: props.location } }} />;
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

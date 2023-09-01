import React, { useEffect, useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useSelector, useDispatch } from "react-redux";
import { useProfile } from "../Components/Hooks/UserHooks";
import { getCurrentUser, logoutUser } from "../store/actions";

const AuthProtected = (props) => {
  const user = useSelector((state) => state.Users.currentUser);

  const dispatch = useDispatch();
  const { userProfile, loading, token } = useProfile();

  // This state determines if the check for user authentication is complete.
  const [isUserChecked, setIsUserChecked] = useState(false);

  useEffect(() => {
    if (token) {
      setAuthorization(token);
      if (!user || user.length === 0) {
        dispatch(getCurrentUser());
      } else {
        setIsUserChecked(true);
      }
    } else {
      setIsUserChecked(true);
      dispatch(logoutUser());
    }
  }, [token, loading, dispatch, user]);

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

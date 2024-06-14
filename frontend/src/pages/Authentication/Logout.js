import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

<<<<<<< HEAD
import { logoutUser } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

=======
//redux
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "store/actions";
>>>>>>> sanad
import { withRouter } from "shared/components";

const Logout = (props) => {
  const dispatch = useDispatch();

  const { isUserLogout } = useSelector((state) => ({
    isUserLogout: state.Login.isUserLogout,
  }));

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  if (isUserLogout) {
<<<<<<< HEAD
    return <Navigate to="/login" />;
  }

=======
    return <Navigate to="/" />;
  }
>>>>>>> sanad
  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};


export default withRouter(Logout);
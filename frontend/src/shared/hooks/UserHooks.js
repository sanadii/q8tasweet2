import { useEffect, useState } from "react";
<<<<<<< HEAD
import { getLoggedinUser } from "../../helpers/api_helper";
=======

const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

>>>>>>> sanad

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const token = userProfileSession && userProfileSession["refreshToken"];
  const [loading, setLoading] = useState(userProfileSession ? false : true);
  const [userProfile, setUserProfile] = useState(
    userProfileSession ? userProfileSession : null
  );

<<<<<<< HEAD
=======

>>>>>>> sanad
  useEffect(() => {
    const userProfileSession = getLoggedinUser();
    var token =
      userProfileSession &&
<<<<<<< HEAD
      userProfileSession["token"];
=======
      userProfileSession["refreshToken"];
>>>>>>> sanad
    setUserProfile(userProfileSession ? userProfileSession : null);
    setLoading(token ? false : true);
  }, []);

<<<<<<< HEAD
=======
  // console.log("userProfile:",  userProfile, "loading:", loading, "token: ", token )

>>>>>>> sanad
  return { userProfile, loading, token };
};

export { useProfile };

import { useEffect, useState } from "react";
// import { getLoggedinUser } from "../../helpers/api_helper";

const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};


const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const token = userProfileSession && userProfileSession["refreshToken"];
  const [loading, setLoading] = useState(userProfileSession ? false : true);
  const [userProfile, setUserProfile] = useState(
    userProfileSession ? userProfileSession : null
  );
  console.log("How many times? useProfile")

  useEffect(() => {
    setUserProfile(userProfileSession ? userProfileSession : null);
    setLoading(token ? false : true);
  }, [token]);

  return { userProfile, loading, token };
};

export { useProfile };

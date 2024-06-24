import { useState, useEffect } from "react";

const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const token = userProfileSession ? userProfileSession["refreshToken"] : null;
  const [loading, setLoading] = useState(!userProfileSession);
  const [userProfile, setUserProfile] = useState(userProfileSession);

  useEffect(() => {
    if (!userProfileSession) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [userProfileSession]);

  return { userProfile, loading, token };
};

export { useProfile };

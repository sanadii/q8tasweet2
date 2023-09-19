import { useEffect, useState } from "react";
import { getLoggedinUser } from "../../helpers/api_helper";

const useProfile = () => {
  const userSession = getLoggedinUser();
  const token = userSession?.refresh_token;

  const [loading, setLoading] = useState(!token); // Set to true if no token
  const [userProfile, setUserProfile] = useState(userSession);

  useEffect(() => {
    if (token) {
      setUserProfile(userSession);
      setLoading(false);
    } else {
      setUserProfile(null);
      setLoading(true);
    }
  }, [token, userSession]);

  return { userProfile, loading, token };
};

export { useProfile };

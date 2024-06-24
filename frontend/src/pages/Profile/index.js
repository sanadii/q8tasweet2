import React, { useState, useEffect } from "react"; // Removed unnecessary imports
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from 'selectors';

import { Container } from "reactstrap";
import SwiperCore, { Autoplay } from "swiper";


// Tabs
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import EditProfile from "./EditProfile"

const ViewProfile = () => {
  const dispatch = useDispatch();
  // Getting the user data from Redux state
  const { user } = useSelector(userSelector);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (user && user.id) {
      setUserName(user.id);
    }
  }, [user]);
  SwiperCore.use([Autoplay]);

  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };


  document.title = "Profile | Q8Tasweet - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        {user &&
          <Container fluid>
            <ProfileHeader user={user} />
            <ProfileContent user={user} />
          </Container>
        }
      </div>
    </React.Fragment>
  );
};

export default ViewProfile;

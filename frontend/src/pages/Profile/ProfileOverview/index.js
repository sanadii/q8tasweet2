import React, { useState, useEffect } from "react"; // Removed unnecessary imports
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userSelector } from 'selectors';

import { Card, CardBody, Col, Progress, Row, Table } from "reactstrap";
import SwiperCore, { Autoplay } from "swiper";


// Components
import OverviewCompleteProfile from "./OverviewCompleteProfile";
import OverviewPersonalDetails from "./OverviewPersonalDetails";
import OverviewPortfolio from "./OverviewPortfolio";


import OverviewSkills from "./OverviewSkills";
import OverviewSuggestion from "./OverviewSuggestion";
import OverviewPopularPosts from "./OverviewPopularPosts";
import OverviewAbout from "./OverviewAbout";
import OverviewRecentActivities from "./OverviewRecentActivities";
import OverviewProjects from "./OverviewProjects";



const ProfileOverview = ({ user }) => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (user && user.id) {
            setUserName(user.id);
        }
    }, [user]);
    SwiperCore.use([Autoplay]);


    document.title = "Profile | Q8Tasweet - React Admin & Dashboard Template";

    return (
        <React.Fragment >
            <Row>
                <Col lg={3}>
                    <OverviewCompleteProfile />
                    <OverviewPersonalDetails user={user} />
                    <OverviewPortfolio />
                </Col>
                <Col lg={9}>
                    <OverviewAbout user={user} />
                    {/* <OverviewRecentActivities user={user} />
                    <OverviewProjects user={user} /> */}
                </Col>

            </Row>
        </React.Fragment >
    );
};
export default ProfileOverview;

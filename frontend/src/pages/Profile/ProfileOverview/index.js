import React, { useState, useEffect } from "react"; // Removed unnecessary imports
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userSelector } from 'selectors';

import { Card, CardBody, Col, Progress, Row, Table } from "reactstrap";
import SwiperCore, { Autoplay } from "swiper";


// Components
import OverviewPersonalDetails from "./OverviewPersonalDetails";
import OverviewAbout from "./OverviewAbout";


import OverviewSkills from "./OverviewSkills";
import OverviewSuggestion from "./OverviewSuggestion";
import OverviewPopularPosts from "./OverviewPopularPosts";
import OverviewRecentActivities from "./OverviewRecentActivities";



const ProfileOverview = ({ user }) => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (user && user.id) {
            setUserName(user.id);
        }
    }, [user]);
    SwiperCore.use([Autoplay]);

    return (
        <React.Fragment >
            <Row>
                <Col lg={3}>
                    <OverviewPersonalDetails user={user} />
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

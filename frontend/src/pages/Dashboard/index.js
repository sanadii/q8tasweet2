<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
// import useWebSocket from 'react-use-websocket';
import { Container, Row } from "reactstrap";
import { BreadCrumb } from "shared/components";
import WebSocketChannels from "./NotificationPanel";
import NotificationPanel from "./NotificationPanel";

export const Dashboard = ({ }) => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="الصفحة الرئيسية" pageTitle="الصفحة الرئيسية" />
                    <NotificationPanel />
                </Container>
            </div>
        </React.Fragment >

    );
};

=======
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
// import useWebSocket from 'react-use-websocket';
import { Container, Row } from "reactstrap";
import { BreadCrumb } from "shared/components";
import OverviewTab from "pages/CampaignDetails/OverviewTab";

import { useSelector, useDispatch } from "react-redux";
import { campaignSelector } from 'selectors';



import WebSocketChannels from "./NotificationPanel";
import ViewProfile from "pages/Profile";
import NotificationPanel from "./NotificationPanel";
import { getCookie } from '../../helpers/api_helper';

export const Dashboard = () => {
    const { campaign } = useSelector(campaignSelector);
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="الصفحة الرئيسية" pageTitle="الصفحة الرئيسية" />
                    {/* <ViewProfile /> */}
                    {campaign && campaign.election && <OverviewTab />}
                    {/* if Admin <AdminDashboard /> */}
                    {/* if Campaign <CampaignDashboard /> */}
                    {/* if User <UserDashboard /> */}
                </Container>
            </div>
        </React.Fragment >

    );
};

>>>>>>> sanad
export default Dashboard
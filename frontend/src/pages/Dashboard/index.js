import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
// import useWebSocket from 'react-use-websocket';
import { Container, Row } from "reactstrap";
import { BreadCrumb } from "shared/components";
import WebSocketChannels from "./NotificationPanel";
import NotificationPanel from "./NotificationPanel";
import { getCookie } from '../../helpers/api_helper';

export const Dashboard = () => {
    // getCookie('user_id')
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

export default Dashboard
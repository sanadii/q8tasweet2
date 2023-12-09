import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
// import useWebSocket from 'react-use-websocket';
import { Container, Row } from "reactstrap";
import { BreadCrumb } from "components";
import WebSocketChannels from "./WebSocketChannels";

export const Dashboard = ({ }) => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="الصفحة الرئيسية" pageTitle="الصفحة الرئيسية" />
                    <WebSocketChannels />
                </Container>
            </div>
        </React.Fragment >

    );
};

export default Dashboard
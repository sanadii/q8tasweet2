import React from "react";
import { useSelector } from "react-redux";

import { Container, Row } from "reactstrap";
import { BreadCrumb } from "shared/components";


const Dashboard = () => {
    document.title = "الصفحة الرئيسية - كويت تصويت";

    const currentUser = useSelector(state => state.Users.currentUser);
    const isStaff = currentUser?.isStaff;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="الصفحة الرئيسية" pageTitle="الصفحة الرئيسية" />
                    <p>welcome to Q8 Tasweet</p>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Dashboard;
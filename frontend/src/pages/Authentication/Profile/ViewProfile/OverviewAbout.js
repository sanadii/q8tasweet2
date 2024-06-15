import React, { useState, useEffect } from "react"; // Removed unnecessary imports
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userSelector } from 'selectors';

import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Progress, Row, TabContent, Table, TabPane, UncontrolledCollapse, UncontrolledDropdown } from "reactstrap";




const OverviewAbout = ({ user }) => {

    return (

        <Card>
            <CardBody>
                <h5 className="card-title mb-3">الوصف</h5>
                <p>
                    {user.description}
                </p>
                <Row>
                    <Col xs={6} md={4}>
                        <div className="d-flex mt-4">
                            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                                    <i className="ri-user-2-fill"></i>
                                </div>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                                <p className="mb-1">المسؤوليات :</p>
                                <h6 className="text-truncate mb-0">
                                    {user.twitter}
                                </h6>
                            </div>
                        </div>
                    </Col>

                    <Col xs={6} md={4}>
                        <div className="d-flex mt-4">
                            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                                    <i className="ri-global-line"></i>
                                </div>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                                <p className="mb-1">الموقع الإلكتروني :</p>
                                <Link to="#" className="fw-semibold">
                                    {user.twitter}
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
};

export default OverviewAbout;

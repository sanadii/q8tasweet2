import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { userSelector } from 'Selectors';


const EditChangePassword = () => {
    const { currentUser } = useSelector(userSelector);
    const user = currentUser;
    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <Form>
                <Row className="g-2">
                    <Col lg={4}>
                        <div>
                            <Label htmlFor="oldpasswordInput" className="form-label">كلمة المرور السابقة*</Label>
                            <Input type="password" className="form-control"
                                id="oldpasswordInput"
                                placeholder="ادخل كلمة المرور السابقة" />
                        </div>
                    </Col>

                    <Col lg={4}>
                        <div>
                            <Label htmlFor="newpasswordInput" className="form-label">كلمة المرور الجديدة*</Label>
                            <Input type="password" className="form-control"
                                id="newpasswordInput" placeholder="ادخل كلمة المرور الجديدة" />
                        </div>
                    </Col>

                    <Col lg={4}>
                        <div>
                            <Label htmlFor="confirmpasswordInput" className="form-label">تأكيد كلمة المرور*</Label>
                            <Input type="password" className="form-control"
                                id="confirmpasswordInput"
                                placeholder="تأكيد كلمة المرور" />
                        </div>
                    </Col>

                    <Col lg={12}>
                        <div className="mb-3">
                            <Link to="#"
                                className="link-primary text-decoration-underline">نسيت كلمة المرور ?</Link>
                        </div>
                    </Col>

                    <Col lg={12}>
                        <div className="text-end">
                            <button type="button" className="btn btn-success">تحديث</button>
                        </div>
                    </Col>

                </Row>

            </Form>
            {/* <div className="mt-4 mb-3 border-bottom pb-2">
                <div className="float-end">
                    <Link to="#" className="link-primary">All Logout</Link>
                </div>
                <h5 className="card-title">Login History</h5>
            </div>
            <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 avatar-sm">
                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                        <i className="ri-smartphone-line"></i>
                    </div>
                </div>
                <div className="flex-grow-1 ms-3">
                    <h6>iPhone 12 Pro</h6>
                    <p className="text-muted mb-0">Los Angeles, United States - March 16 at
                        2:47PM</p>
                </div>
                <div>
                    <Link to="#">Logout</Link>
                </div>
            </div>
            <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 avatar-sm">
                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                        <i className="ri-tablet-line"></i>
                    </div>
                </div>
                <div className="flex-grow-1 ms-3">
                    <h6>Apple iPad Pro</h6>
                    <p className="text-muted mb-0">Washington, United States - November 06
                        at 10:43AM</p>
                </div>
                <div>
                    <Link to="#">Logout</Link>
                </div>
            </div>
            <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 avatar-sm">
                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                        <i className="ri-smartphone-line"></i>
                    </div>
                </div>
                <div className="flex-grow-1 ms-3">
                    <h6>Galaxy S21 Ultra 5G</h6>
                    <p className="text-muted mb-0">Conneticut, United States - June 12 at
                        3:24PM</p>
                </div>
                <div>
                    <Link to="#">Logout</Link>
                </div>
            </div>
            <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-sm">
                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                        <i className="ri-macbook-line"></i>
                    </div>
                </div>
                <div className="flex-grow-1 ms-3">
                    <h6>Dell Inspiron 14</h6>
                    <p className="text-muted mb-0">Phoenix, United States - July 26 at
                        8:10AM</p>
                </div>
                <div>
                    <Link to="#">Logout</Link>
                </div>
            </div> */}
        </React.Fragment>
    );
};

export default EditChangePassword;
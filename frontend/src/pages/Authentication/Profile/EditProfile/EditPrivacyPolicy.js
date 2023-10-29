import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { userSelector } from 'Selectors';


const EditPersonalDetails = () => {
    const { currentUser } = useSelector(userSelector);
    const user = currentUser;
    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="mb-4 pb-2">
                <h5 className="card-title text-decoration-underline mb-3">Security:</h5>
                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0">
                    <div className="flex-grow-1">
                        <h6 className="fs-14 mb-1">Two-factor Authentication</h6>
                        <p className="text-muted">Two-factor authentication is an enhanced
                            security meansur. Once enabled, you'll be required to give
                            two types of identification when you log into Google
                            Authentication and SMS are Supported.</p>
                    </div>
                    <div className="flex-shrink-0 ms-sm-3">
                        <Link to="#"
                            className="btn btn-sm btn-primary">Enable Two-facor
                            Authentication</Link>
                    </div>
                </div>
                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                    <div className="flex-grow-1">
                        <h6 className="fs-14 mb-1">Secondary Verification</h6>
                        <p className="text-muted">The first factor is a password and the
                            second commonly includes a text with a code sent to your
                            smartphone, or biometrics using your fingerprint, face, or
                            retina.</p>
                    </div>
                    <div className="flex-shrink-0 ms-sm-3">
                        <Link to="#" className="btn btn-sm btn-primary">Set
                            up secondary method</Link>
                    </div>
                </div>
                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                    <div className="flex-grow-1">
                        <h6 className="fs-14 mb-1">Backup Codes</h6>
                        <p className="text-muted mb-sm-0">A backup code is automatically
                            generated for you when you turn on two-factor authentication
                            through your iOS or Android Twitter app. You can also
                            generate a backup code on twitter.com.</p>
                    </div>
                    <div className="flex-shrink-0 ms-sm-3">
                        <Link to="#"
                            className="btn btn-sm btn-primary">Generate backup codes</Link>
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <h5 className="card-title text-decoration-underline mb-3">Application Notifications:</h5>
                <ul className="list-unstyled mb-0">
                    <li className="d-flex">
                        <div className="flex-grow-1">
                            <label htmlFor="directMessage"
                                className="form-check-label fs-14">Direct messages</label>
                            <p className="text-muted">Messages from people you follow</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="form-check form-switch">
                                <Input className="form-check-input" type="checkbox"
                                    role="switch" id="directMessage" defaultChecked />
                            </div>
                        </div>
                    </li>
                    <li className="d-flex mt-2">
                        <div className="flex-grow-1">
                            <Label className="form-check-label fs-14"
                                htmlFor="desktopNotification">
                                Show desktop notifications
                            </Label>
                            <p className="text-muted">Choose the option you want as your
                                default setting. Block a site: Next to "Not allowed to
                                send notifications," click Add.</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="form-check form-switch">
                                <Input className="form-check-input" type="checkbox"
                                    role="switch" id="desktopNotification" defaultChecked />
                            </div>
                        </div>
                    </li>
                    <li className="d-flex mt-2">
                        <div className="flex-grow-1">
                            <Label className="form-check-label fs-14"
                                htmlFor="emailNotification">
                                Show email notifications
                            </Label>
                            <p className="text-muted"> Under Settings, choose Notifications.
                                Under Select an account, choose the account to enable
                                notifications for. </p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="form-check form-switch">
                                <Input className="form-check-input" type="checkbox"
                                    role="switch" id="emailNotification" />
                            </div>
                        </div>
                    </li>
                    <li className="d-flex mt-2">
                        <div className="flex-grow-1">
                            <Label className="form-check-label fs-14"
                                htmlFor="chatNotification">
                                Show chat notifications
                            </Label>
                            <p className="text-muted">To prevent duplicate mobile
                                notifications from the Gmail and Chat apps, in settings,
                                turn off Chat notifications.</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="form-check form-switch">
                                <Input className="form-check-input" type="checkbox"
                                    role="switch" id="chatNotification" />
                            </div>
                        </div>
                    </li>
                    <li className="d-flex mt-2">
                        <div className="flex-grow-1">
                            <Label className="form-check-label fs-14"
                                htmlFor="purchaesNotification">
                                Show purchase notifications
                            </Label>
                            <p className="text-muted">Get real-time purchase alerts to
                                protect yourself from fraudulent charges.</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="form-check form-switch">
                                <Input className="form-check-input" type="checkbox"
                                    role="switch" id="purchaesNotification" />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div>
                <h5 className="card-title text-decoration-underline mb-3">Delete This
                    Account:</h5>
                <p className="text-muted">Go to the Data & Privacy section of your profile
                    Account. Scroll to "Your data & privacy options." Delete your
                    Profile Account. Follow the instructions to delete your account :
                </p>
                <div>
                    <Input type="password" className="form-control" id="passwordInput"
                        placeholder="Enter your password" defaultValue="make@321654987"
                        style={{ maxWidth: "265px" }} />
                </div>
                <div className="hstack gap-2 mt-3">
                    <Link to="#" className="btn btn-soft-danger">Close &
                        Delete This Account</Link>
                    <Link to="#" className="btn btn-light">Cancel</Link>
                </div>
            </div>
        </React.Fragment>
    );
};

export default EditPersonalDetails;
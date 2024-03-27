import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Input, Label } from 'reactstrap';
import { userSelector } from 'selectors';

//import images
import avatar1 from 'assets/images/users/avatar-1.jpg';

const EditProfileImage = () => {
    const { user } = useSelector(userSelector);
    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <Card>
                <CardBody className="p-4">
                    <div className="text-center">
                        <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                            <img src={avatar1}
                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                alt="user-profile" />
                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                <Input id="profile-img-file-input" type="file"
                                    className="profile-img-file-input" />
                                <Label htmlFor="profile-img-file-input"
                                    className="profile-photo-edit avatar-xs">
                                    <span className="avatar-title rounded-circle bg-light text-body">
                                        <i className="ri-camera-fill"></i>
                                    </span>
                                </Label>
                            </div>
                        </div>
                        <h5 className="fs-16 mb-1">{user.fullName}</h5>
                        <p className="text-muted mb-0">{user.email}</p>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default EditProfileImage;
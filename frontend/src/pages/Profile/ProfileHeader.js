import React from "react"; // Removed unnecessary imports
import { Col, Row } from "reactstrap";

//Images
import profileBg from "assets/images/kuwait-bg.png";
import avatar1 from "assets/images/users/avatar-1.jpg";

const ProfileHeader = ({ user, seIsEditProfile }) => {

    return (
        <React.Fragment>

            <div className="profile-foreground position-relative mx-n4 mt-n4">
                <div className="profile-wid-bg">
                    <img src={profileBg} alt="" className="profile-wid-img" />
                </div>
            </div>
            <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
                <Row className="g-4">
                    <div className="col-auto">
                        <div className="avatar-lg">
                            <img
                                src={user?.image ? process.env.REACT_APP_MEDIA_URL + user?.image : avatar1}
                                alt="user-img"
                                className="img-thumbnail rounded-circle"
                            />
                        </div>
                    </div>

                    <Col>
                        <div className="p-2">
                            <h3 className="text-white mb-1">{user.fullName}</h3>
                            <p className="text-white-75">{user.isStaff ? "مدير" : "مشترك"}</p>
                            <div className="hstack text-white-50 gap-1">
                                <div className="me-2">
                                    <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                                    California, United States
                                </div>
                                <div>
                                    <i className="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>
                                    Q8Vision
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col xs={12} className="col-lg-auto order-last order-lg-0">
                        <Row className="text text-white-50 text-center">
                            <Col lg={6} xs={4}>
                                <div className="p-2">
                                    <h4 className="text-white mb-1">24.3K</h4>
                                    <p className="fs-14 mb-0">Followers</p>
                                </div>
                            </Col>
                            <Col lg={6} xs={4}>
                                <div className="p-2">
                                    <h4 className="text-white mb-1">1.3K</h4>
                                    <p className="fs-14 mb-0">Following</p>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>


        </React.Fragment>
    );
};

export default ProfileHeader;

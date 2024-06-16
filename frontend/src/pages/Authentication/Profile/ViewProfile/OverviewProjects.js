import React, { useState, useEffect } from "react"; // Removed unnecessary imports
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userSelector } from 'selectors';

import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Progress, Row, TabContent, Table, TabPane, UncontrolledCollapse, UncontrolledDropdown } from "reactstrap";
import classnames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";

//Images
import avatar2 from "assets/images/users/avatar-2.jpg";
import avatar3 from "assets/images/users/avatar-3.jpg";
import avatar4 from "assets/images/users/avatar-4.jpg";
import avatar5 from "assets/images/users/avatar-5.jpg";
import avatar6 from "assets/images/users/avatar-6.jpg";
import avatar7 from "assets/images/users/avatar-7.jpg";
import smallImage3 from "assets/images/small/img-3.jpg";
import smallImage4 from "assets/images/small/img-4.jpg";
import smallImage5 from "assets/images/small/img-5.jpg";
import smallImage6 from "assets/images/small/img-6.jpg";
import smallImage7 from "assets/images/small/img-7.jpg";
import smallImage9 from "assets/images/small/img-9.jpg";



const OverviewProjects = () => {
    return (
        <Card>
            <CardBody>
                <h5 className="card-title">Projects</h5>
                <div className="d-flex justify-content-end gap-2 mb-2">
                    <div className="slider-button-prev">
                        <div className="avatar-title fs-18 rounded px-1">
                            <i className="ri-arrow-left-s-line"></i>
                        </div>
                    </div>
                    <div className="slider-button-next">
                        <div className="avatar-title fs-18 rounded px-1">
                            <i className="ri-arrow-right-s-line"></i>
                        </div>
                    </div>
                </div>
                <Swiper
                    className="project-swiper"
                    slidesPerView={3}
                    spaceBetween={20}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                >
                    <div className="swiper-wrapper">
                        <SwiperSlide>
                            <Card className="profile-project-card shadow-none profile-project-success mb-0">
                                <CardBody className="p-4">
                                    <div className="d-flex">
                                        <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-14 text-truncate mb-1">
                                                <Link to="#" className="text-dark">
                                                    ABC Project Customization
                                                </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                                Last Update :{" "}
                                                <span className="fw-semibold text-dark">
                                                    4 hr Ago
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 ms-2">
                                            <div className="badge badge-soft-warning fs-10">
                                                Inprogress
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex mt-4">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                                <div>
                                                    <h5 className="fs-12 text-muted mb-0">
                                                        Members :
                                                    </h5>
                                                </div>
                                                <div className="avatar-group">
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <img
                                                                src={avatar4}
                                                                alt=""
                                                                className="rounded-circle img-fluid"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <img
                                                                src={avatar5}
                                                                alt=""
                                                                className="rounded-circle img-fluid"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <div className="avatar-title rounded-circle bg-light text-primary">
                                                                A
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <img
                                                                src={avatar2}
                                                                alt=""
                                                                className="rounded-circle img-fluid"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </SwiperSlide>

                        <SwiperSlide>
                            <Card className="profile-project-card shadow-none profile-project-danger mb-0">
                                <CardBody className="p-4">
                                    <div className="d-flex">
                                        <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-14 text-truncate mb-1">
                                                <Link to="#" className="text-dark">
                                                    Client - John
                                                </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                                Last Update :{" "}
                                                <span className="fw-semibold text-dark">
                                                    1 hr Ago
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 ms-2">
                                            <div className="badge badge-soft-success fs-10">
                                                Completed
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex mt-4">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                                <div>
                                                    <h5 className="fs-12 text-muted mb-0">
                                                        Members :
                                                    </h5>
                                                </div>
                                                <div className="avatar-group">
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <img
                                                                src={avatar2}
                                                                alt=""
                                                                className="rounded-circle img-fluid"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <div className="avatar-title rounded-circle bg-light text-primary">
                                                                C
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Card className="profile-project-card shadow-none profile-project-info mb-0">
                                <CardBody className="p-4">
                                    <div className="d-flex">
                                        <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-14 text-truncate mb-1">
                                                <Link to="#" className="text-dark">
                                                    Brand logo Design
                                                </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                                Last Update :{" "}
                                                <span className="fw-semibold text-dark">
                                                    2 hr Ago
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 ms-2">
                                            <div className="badge badge-soft-warning fs-10">
                                                Inprogress
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex mt-4">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                                <div>
                                                    <h5 className="fs-12 text-muted mb-0">
                                                        Members :
                                                    </h5>
                                                </div>
                                                <div className="avatar-group">
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <img
                                                                src={avatar5}
                                                                alt=""
                                                                className="rounded-circle img-fluid"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Card className="profile-project-card shadow-none profile-project-danger mb-0">
                                <CardBody className="p-4">
                                    <div className="d-flex">
                                        <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-14 text-truncate mb-1">
                                                <Link to="#" className="text-dark">
                                                    Project update
                                                </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                                Last Update :{" "}
                                                <span className="fw-semibold text-dark">
                                                    4 hr Ago
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 ms-2">
                                            <div className="badge badge-soft-success fs-10">
                                                Completed
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex mt-4">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                                <div>
                                                    <h5 className="fs-12 text-muted mb-0">
                                                        Members :
                                                    </h5>
                                                </div>
                                                <div className="avatar-group">
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <img
                                                                src={avatar4}
                                                                alt=""
                                                                className="rounded-circle img-fluid"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <img
                                                                src={avatar5}
                                                                alt=""
                                                                className="rounded-circle img-fluid"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </SwiperSlide>

                        <SwiperSlide>
                            <Card className="profile-project-card shadow-none profile-project-warning mb-0">
                                <CardBody className="p-4">
                                    <div className="d-flex">
                                        <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-14 text-truncate mb-1">
                                                <Link to="#" className="text-dark">
                                                    Chat App
                                                </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                                Last Update :{" "}
                                                <span className="fw-semibold text-dark">
                                                    1 hr Ago
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 ms-2">
                                            <div className="badge badge-soft-warning fs-10">
                                                Inprogress
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex mt-4">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                                <div>
                                                    <h5 className="fs-12 text-muted mb-0">
                                                        Members :
                                                    </h5>
                                                </div>
                                                <div className="avatar-group">
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <img
                                                                src={avatar4}
                                                                alt=""
                                                                className="rounded-circle img-fluid"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <img
                                                                src={avatar5}
                                                                alt=""
                                                                className="rounded-circle img-fluid"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="avatar-group-item">
                                                        <div className="avatar-xs">
                                                            <div className="avatar-title rounded-circle bg-light text-primary">
                                                                A
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </SwiperSlide>
                    </div>
                </Swiper>
            </CardBody>
        </Card>
    )
};
export default OverviewProjects;
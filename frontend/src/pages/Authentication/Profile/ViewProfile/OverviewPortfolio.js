import React, { useState, useEffect } from "react"; // Removed unnecessary imports
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userSelector } from 'Selectors';

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

const OverviewPortfolio = () => {

    return (
        <Card>
            <CardBody>
                <h5 className="card-title mb-4">Portfolio</h5>
                <div className="d-flex flex-wrap gap-2">
                    <div>
                        <Link to="#" className="avatar-xs d-block">
                            <span className="avatar-title rounded-circle fs-16 bg-dark text-light">
                                <i className="ri-github-fill"></i>
                            </span>
                        </Link>
                    </div>
                    <div>
                        <Link to="#" className="avatar-xs d-block">
                            <span className="avatar-title rounded-circle fs-16 bg-primary">
                                <i className="ri-global-fill"></i>
                            </span>
                        </Link>
                    </div>
                    <div>
                        <Link to="#" className="avatar-xs d-block">
                            <span className="avatar-title rounded-circle fs-16 bg-success">
                                <i className="ri-dribbble-fill"></i>
                            </span>
                        </Link>
                    </div>
                    <div>
                        <Link to="#" className="avatar-xs d-block">
                            <span className="avatar-title rounded-circle fs-16 bg-danger">
                                <i className="ri-pinterest-fill"></i>
                            </span>
                        </Link>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
};
export default OverviewPortfolio;

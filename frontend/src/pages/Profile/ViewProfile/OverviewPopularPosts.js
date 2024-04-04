import React from "react"; // Removed unnecessary imports
import { Link } from "react-router-dom";

import { Card, CardBody, DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle } from "reactstrap";

import smallImage4 from "assets/images/small/img-4.jpg";
import smallImage5 from "assets/images/small/img-5.jpg";
import smallImage6 from "assets/images/small/img-6.jpg";


const OverviewPopularPosts = () => {
    return (
        <Card>
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">
                            Popular Posts
                        </h5>
                    </div>
                    <div className="flex-shrink-0">
                        <UncontrolledDropdown direction="start">
                            <DropdownToggle
                                tag="a"
                                id="dropdownMenuLink1"
                                role="button"
                            >
                                <i className="ri-more-2-fill fs-14"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>View</DropdownItem>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </div>
                <div className="d-flex mb-4">
                    <div className="flex-shrink-0">
                        <img
                            src={smallImage4}
                            alt=""
                            height="50"
                            className="rounded"
                        />
                    </div>
                    <div className="flex-grow-1 ms-3 overflow-hidden">
                        <Link to="#">
                            <h6 className="text-truncate fs-14">
                                Design your apps in your own way
                            </h6>
                        </Link>
                        <p className="text-muted mb-0">15 Dec 2021</p>
                    </div>
                </div>
                <div className="d-flex mb-4">
                    <div className="flex-shrink-0">
                        <img
                            src={smallImage5}
                            alt=""
                            height="50"
                            className="rounded"
                        />
                    </div>
                    <div className="flex-grow-1 ms-3 overflow-hidden">
                        <Link to="#">
                            <h6 className="text-truncate fs-14">
                                Smartest Applications for Business
                            </h6>
                        </Link>
                        <p className="text-muted mb-0">28 Nov 2021</p>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="flex-shrink-0">
                        <img
                            src={smallImage6}
                            alt=""
                            height="50"
                            className="rounded"
                        />
                    </div>
                    <div className="flex-grow-1 ms-3 overflow-hidden">
                        <Link to="#">
                            <h6 className="text-truncate fs-14">
                                How to get creative in your work
                            </h6>
                        </Link>
                        <p className="text-muted mb-0">21 Nov 2021</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
};
export default OverviewPopularPosts;

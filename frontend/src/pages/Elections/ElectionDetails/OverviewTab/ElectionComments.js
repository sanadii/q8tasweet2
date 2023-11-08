import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { ImageGenderCircle, } from "components";
import { electionSelector } from 'Selectors';

//SimpleBar
import SimpleBar from "simplebar-react";

const ElectionComments = () => {

    const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);

    const moderators = Array.isArray(election.moderators)
        ? election.moderators
        : [];

    return (
        <React.Fragment>
            {/* <Card>
                <CardHeader className="align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">Comments</h4>
                    <div className="flex-shrink-0">
                        <UncontrolledDropdown className="card-header-dropdown">
                            <DropdownToggle
                                tag="a"
                                className="text-reset dropdown-btn"
                                href="#"
                            >
                                <span className="text-muted">
                                    Recent<i className="mdi mdi-chevron-down ms-1"></i>
                                </span>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem>Recent</DropdownItem>
                                <DropdownItem>Top Rated</DropdownItem>
                                <DropdownItem>Previous</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </CardHeader>

                <CardBody>
                    <SimpleBar
                        style={{ height: "300px" }}
                        className="px-3 mx-n3 mb-2"
                    >
                        <div className="d-flex mb-4">
                            <div className="flex-shrink-0">
                                <img
                                    src={avatar8}
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                />
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h5 className="fs-13">
                                    Joseph Parker{" "}
                                    <small className="text-muted ms-2">
                                        20 Dec 2021 - 05:47AM
                                    </small>
                                </h5>
                                <p className="text-muted">
                                    I am getting message from customers that when they place
                                    order always get error message .
                                </p>
                                <Link to="#" className="badge text-muted bg-light">
                                    <i className="mdi mdi-reply"></i> Reply
                                </Link>
                                <div className="d-flex mt-4">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={avatar10}
                                            alt=""
                                            className="avatar-xs rounded-circle"
                                        />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h5 className="fs-13">
                                            Alexis Clarke{" "}
                                            <small className="text-muted ms-2">
                                                22 Dec 2021 - 02:32PM
                                            </small>
                                        </h5>
                                        <p className="text-muted">
                                            Please be sure to check your Spam mailbox to see if
                                            your email filters have identified the email from Dell
                                            as spam.
                                        </p>
                                        <Link to="#" className="badge text-muted bg-light">
                                            <i className="mdi mdi-reply"></i> Reply
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-4">
                            <div className="flex-shrink-0">
                                <img
                                    src={avatar6}
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                />
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h5 className="fs-13">
                                    Donald Palmer{" "}
                                    <small className="text-muted ms-2">
                                        24 Dec 2021 - 05:20PM
                                    </small>
                                </h5>
                                <p className="text-muted">
                                    If you have further questions, please contact Customer
                                    Support from the “Action Menu” on your{" "}
                                    <Link to="#" className="text-decoration-underline">
                                        Online Order Support
                                    </Link>
                                    .
                                </p>
                                <Link to="#" className="badge text-muted bg-light">
                                    <i className="mdi mdi-reply"></i> Reply
                                </Link>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="flex-shrink-0">
                                <img
                                    src={avatar10}
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                />
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h5 className="fs-13">
                                    Alexis Clarke{" "}
                                    <small className="text-muted ms-2">26 min ago</small>
                                </h5>
                                <p className="text-muted">
                                    Your{" "}
                                    <Link to="#" className="text-decoration-underline">
                                        Online Order Support
                                    </Link>{" "}
                                    provides you with the most current status of your order.
                                    To help manage your order refer to the “Action Menu” to
                                    initiate return, contact Customer Support and more.
                                </p>
                                <Row className="g-2 mb-3">
                                    <div className="col-lg-1 col-sm-2 col-6">
                                        <img
                                            src={image4}
                                            alt=""
                                            className="img-fluid rounded"
                                        />
                                    </div>
                                    <div className="col-lg-1 col-sm-2 col-6">
                                        <img
                                            src={image5}
                                            alt=""
                                            className="img-fluid rounded"
                                        />
                                    </div>
                                </Row>
                                <Link to="#" className="badge text-muted bg-light">
                                    <i className="mdi mdi-reply"></i> Reply
                                </Link>
                                <div className="d-flex mt-4">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={avatar6}
                                            alt=""
                                            className="avatar-xs rounded-circle"
                                        />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h5 className="fs-13">
                                            Donald Palmer{" "}
                                            <small className="text-muted ms-2">8 sec ago</small>
                                        </h5>
                                        <p className="text-muted">
                                            Other shipping methods are available at checkout if
                                            you want your purchase delivered faster.
                                        </p>
                                        <Link to="#" className="badge text-muted bg-light">
                                            <i className="mdi mdi-reply"></i> Reply
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SimpleBar>
                    <form className="mt-4">
                        <Row className="g-3">
                            <Col xs={12}>
                                <label
                                    htmlFor="exampleFormControlTextarea1"
                                    className="form-label text-body"
                                >
                                    Leave a Comments
                                </label>
                                <textarea
                                    className="form-control bg-light border-light"
                                    id="exampleFormControlTextarea1"
                                    rows="3"
                                    placeholder="Enter your comment..."
                                ></textarea>
                            </Col>
                            <Col xs={12} className="text-end">
                                <button
                                    type="button"
                                    className="btn btn-ghost-secondary btn-icon waves-effect me-1"
                                >
                                    <i className="ri-attachment-line fs-16"></i>
                                </button>
                                <Link to="#" className="btn btn-success">
                                    Post Comments
                                </Link>
                            </Col>
                        </Row>
                    </form>
                </CardBody>
            </Card> */}
        </React.Fragment>
    );
};

export default ElectionComments;

import React from "react"; // Removed unnecessary imports
import { Card, CardBody, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

//Images
import avatar3 from "assets/images/users/avatar-3.jpg";
import avatar4 from "assets/images/users/avatar-4.jpg";
import avatar5 from "assets/images/users/avatar-5.jpg";


const OverviewSuggestion = () => {
    return (

        <Card>
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">Suggestions</h5>
                    </div>
                    <div className="flex-shrink-0">
                        <UncontrolledDropdown direction="start">
                            <DropdownToggle
                                tag="a"
                                id="dropdownMenuLink2"
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
                <div>
                    <div className="d-flex align-items-center py-3">
                        <div className="avatar-xs flex-shrink-0 me-3">
                            <img
                                src={avatar3}
                                alt=""
                                className="img-fluid rounded-circle"
                            />
                        </div>
                        <div className="flex-grow-1">
                            <div>
                                <h5 className="fs-14 mb-1">Esther James</h5>
                                <p className="fs-13 text-muted mb-0">
                                    Frontend Developer
                                </p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 ms-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                            >
                                <i className="ri-user-add-line align-middle"></i>
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center py-3">
                        <div className="avatar-xs flex-shrink-0 me-3">
                            <img
                                src={avatar4}
                                alt=""
                                className="img-fluid rounded-circle"
                            />
                        </div>
                        <div className="flex-grow-1">
                            <div>
                                <h5 className="fs-14 mb-1">
                                    Jacqueline Steve
                                </h5>
                                <p className="fs-13 text-muted mb-0">
                                    UI/UX Designer
                                </p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 ms-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                            >
                                <i className="ri-user-add-line align-middle"></i>
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center py-3">
                        <div className="avatar-xs flex-shrink-0 me-3">
                            <img
                                src={avatar5}
                                alt=""
                                className="img-fluid rounded-circle"
                            />
                        </div>
                        <div className="flex-grow-1">
                            <div>
                                <h5 className="fs-14 mb-1">
                                    George Whalen
                                </h5>
                                <p className="fs-13 text-muted mb-0">
                                    Backend Developer
                                </p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 ms-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                            >
                                <i className="ri-user-add-line align-middle"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
};
export default OverviewSuggestion;

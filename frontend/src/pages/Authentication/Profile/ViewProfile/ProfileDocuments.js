import React, { useState, useEffect } from "react"; // Removed unnecessary imports
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userSelector } from 'selectors';

import { Card, CardBody, Col, Input, Label, Row, Table } from "reactstrap";
import SwiperCore, { Autoplay } from "swiper";

const ProfileDocuments = () => {
    const dispatch = useDispatch();
    // Getting the user data from Redux state
    const { user } = useSelector(userSelector);

    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (user && user.id) {
            setUserName(user.id);
        }
    }, [user]);
    SwiperCore.use([Autoplay]);

    const [activeTab, setActiveTab] = useState("1");
    const [activityTab, setActivityTab] = useState("1");

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const toggleActivityTab = (tab) => {
        if (activityTab !== tab) {
            setActivityTab(tab);
        }
    };

    document.title = "Profile | Q8Tasweet - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="d-flex align-items-center mb-4">
                        <h5 className="card-title flex-grow-1 mb-0">
                            Documents
                        </h5>
                        <div className="flex-shrink-0">
                            <Input
                                className="form-control d-none"
                                type="file"
                                id="formFile"
                            />
                            <Label
                                htmlFor="formFile"
                                className="btn btn-danger"
                            >
                                <i className="ri-upload-2-fill me-1 align-bottom"></i>{" "}
                                Upload File
                            </Label>
                        </div>
                    </div>
                    <Row>
                        <Col lg={12}>
                            <div className="table-responsive">
                                <Table className="table-borderless align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">File Name</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Size</th>
                                            <th scope="col">Upload Date</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {(document || []).map((item, key) => (
              <tr key={key}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="avatar-sm">
                      <div
                        className={`avatar-title bg-soft-${item.iconBackgroundClass} text-${item.iconBackgroundClass} rounded fs-20`}
                      >
                        <i className={item.icon}></i>
                      </div>
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <h6 className="fs-15 mb-0">
                        <Link to="#">
                          {item.fileName}
                        </Link>
                      </h6>
                    </div>
                  </div>
                </td>
                <td>{item.fileType}</td>
                <td>{item.fileSize}</td>
                <td>{item.updatedDate}</td>
                <td>
                  <UncontrolledDropdown direction="start">
                    <DropdownToggle
                      tag="a"
                      className="btn btn-light btn-icon"
                      id="dropdownMenuLink15"
                      role="button"
                    >
                      <i className="ri-equalizer-fill"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>
                        <i className="ri-eye-fill me-2 align-middle text-muted" />
                        View
                      </DropdownItem>
                      <DropdownItem>
                        <i className="ri-download-2-fill me-2 align-middle text-muted" />
                        Download
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>
                        <i className="ri-delete-bin-5-line me-2 align-middle text-muted" />
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
              </tr>
            ))} */}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="text-center mt-3">
                                <Link to="#" className="text-success ">
                                    <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i>
                                    Load more{" "}
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default ProfileDocuments;
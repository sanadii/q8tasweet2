import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import { userSelector } from 'selectors';

//import images

const EditCompleteProfile = () => {
    const { currentUser } = useSelector(userSelector);
    const user = currentUser;
    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="d-flex align-items-center mb-5">
                        <div className="flex-grow-1">
                            <h5 className="card-title mb-0">Complete Your Profile</h5>
                        </div>
                        <div className="flex-shrink-0">
                            <Link to="#" className="badge bg-light text-primary fs-12"><i
                                className="ri-edit-box-line align-bottom me-1"></i> Edit</Link>
                        </div>
                    </div>
                    <div className="progress animated-progress custom-progress progress-label">
                        <div className="progress-bar bg-danger" role="progressbar" style={{ "width": "30%" }}
                            aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">
                            <div className="label">30%</div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default EditCompleteProfile;
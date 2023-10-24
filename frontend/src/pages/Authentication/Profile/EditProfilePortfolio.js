import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Input } from 'reactstrap';
import { userSelector } from 'Selectors';

const EditProfilePortfolio = () => {
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
                    <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1">
                            <h5 className="card-title mb-0">التواصل الاجتماعي</h5>
                        </div>
                        {/* <div className="flex-shrink-0">
                            <Link to="#" className="badge bg-light text-primary fs-12"><i
                                className="ri-add-fill align-bottom me-1"></i> Add</Link>
                        </div> */}
                    </div>
                    <div className="mb-3 d-flex">
                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                            <span className="avatar-title rounded-circle fs-16 bg-info text-light">
                                <i className="ri-twitter-fill"></i>
                            </span>
                        </div>
                        <Input type="text" className="form-control" id="twitterUsername" placeholder="twitter" />
                    </div>
                    <div className="mb-3 d-flex">
                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                            <span className="avatar-title rounded-circle fs-16 bg-danger">
                                <i className="ri-instagram-fill"></i>
                            </span>
                        </div>
                        <Input type="text" className="form-control" id="instagramInput" placeholder="instagram" />
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default EditProfilePortfolio;
import React from "react";
import { Link } from "react-router-dom";

import { Card, CardBody, Table, Progress } from "reactstrap";

const OverviewPersonalDetails = ({ user }) => {
    const renderRow = (label, content) => (
        <tr>
            <th className="ps-0" scope="row">{label} :</th>
            <td className="text-muted">{content}</td>
        </tr>
    );

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h5 className="card-title mb-5">
                        اكمل ملفك الشخصي
                    </h5>
                    <Progress
                        value={30}
                        color="danger"
                        className="animated-progess custom-progress progress-label"
                    >
                        <div className="label">30%</div>{" "}
                    </Progress>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <h5 className="card-title mb-3">معلومات شخصية</h5>
                    <div className="table-responsive">
                        <Table className="table-borderless mb-0">
                            <tbody>
                                {renderRow("الاسم", user.fullName)}
                                {renderRow("الهاتف", user.phone)}
                                {renderRow("البريد", user.email)}
                                {renderRow("الصلاحيات", user.groups.map((group, index) => (
                                    <span key={index}>
                                        {group}
                                        {index !== user.groups.length - 1 && <br />}
                                    </span>
                                )))}
                                {renderRow("الإنتساب", /* user.track.createdAt */)}
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
            </Card>
            <Card>
            <CardBody>
                <h5 className="card-title mb-4">التواصل الإجتماعي</h5>
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
        </React.Fragment>
    );
};

export default OverviewPersonalDetails;

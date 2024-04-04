import React, { useState, useEffect } from "react"; // Removed unnecessary imports
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from 'selectors';
import { Card, CardBody, Table } from "reactstrap";


const OverviewPersonalDetails = () => {
    const dispatch = useDispatch();
    // Getting the user data from Redux state
    const { user } = useSelector(userSelector);

    return (
        <Card>
            <CardBody>
                <h5 className="card-title mb-3">معلومات شخصية</h5>
                <div className="table-responsive">
                    <Table className="table-borderless mb-0">
                        <tbody>
                            <tr>
                                <th className="ps-0" scope="row">
                                    الاسم :
                                </th>
                                <td className="text-muted">
                                    {user.fullName}
                                </td>
                            </tr>
                            <tr>
                                <th className="ps-0" scope="row">
                                    الهاتف :
                                </th>
                                <td className="text-muted">
                                    {user.phone}
                                </td>
                            </tr>
                            <tr>
                                <th className="ps-0" scope="row">
                                    البريد :
                                </th>
                                <td className="text-muted">
                                    {user.email}
                                </td>
                            </tr>
                            <tr>
                                <th className="ps-0" scope="row">
                                    الصلاحيات :
                                </th>
                                <td className="text-muted">
                                    {user.groups.map((group, index) => (
                                        <span key={index}>
                                            {group}
                                            {index !== user.groups.length - 1 && <br />}
                                        </span>
                                    ))}
                                </td>
                            </tr>
                            <tr>
                                <th className="ps-0" scope="row">
                                    الإنتساب
                                </th>
                                <td className="text-muted">
                                    {/* {user.track.createdAt} */}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </CardBody>
        </Card>
    )
};
export default OverviewPersonalDetails;

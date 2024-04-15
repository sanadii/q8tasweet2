import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Row, Card, CardBody, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { ImageGenderCircle, } from "shared/components";
import { electionSelector } from 'selectors';
import { electionMethodBadge, PriorityBadge } from "shared/constants";

//SimpleBar
import SimpleBar from "simplebar-react";

const OverviewCampaigns = () => {

    const { election, electionCandidates } = useSelector(electionSelector);

    const electionDetailsList = [
        {
            id: 1,
            name: "يوم الإقتراع",
            value: election.dueDate,
        },
        {
            id: 2,
            name: "عدد المرشحين",
            value: electionCandidates.length,
        },
        {
            id: 3,
            name: "عدد المقاعد",
            value: election.electSeats,
        },
        {
            id: 4,
            name: "عدد الأصوات",
            value: election.electVotes,
        },
        // Add more objects as needed
    ];



    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <h5 className="card-title">
                        <strong>الإنتخابات</strong>
                    </h5>
                </CardHeader>
                <CardBody>
                    <table className="table">
                        <tbody>
                            {electionDetailsList.map((detail) => (
                                <tr key={detail.id}>
                                    <td>{detail.name}</td>
                                    <td>{detail.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default OverviewCampaigns;

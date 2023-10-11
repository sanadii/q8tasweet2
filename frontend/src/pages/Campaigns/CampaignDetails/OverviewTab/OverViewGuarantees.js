

// Pages/Campaigns/CampaignDetails/Components/OverViewGuarantees.js
// React & Redux core
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Store & Selectors
import { campaignSelector } from 'Selectors';

// Components, Constants & Hooks
import { Loader, DeleteModal, TableContainer, TableContainerHeader, TableContainerFilter } from "../../../../Components/Common";
import { MemberRankOptions } from "../../../../Components/constants";

// UI & Utilities
import { Card, CardBody, CardHeader, Col, Row, TabContent, Table, UncontrolledCollapse } from "reactstrap";

const OverViewGuarantees = () => {
    const {
        currentCampaignMember,
        campaignMembers,
        campaignGuarantees,
        campaignElectionCommittees,
    } = useSelector(campaignSelector);


    function getGuaranteeCount(memberId) {
        // Assuming `campaignGuarantees` is an array of all guarantees:
        return campaignGuarantees.filter(guarantee => guarantee.member === memberId).length;
    }

    const getStatusCount = useCallback((memberId, status) => {
        let statusMap = {
            "New": 1,
            "Contacted": 2,
            "Confirmed": 3,
            "Not Confirmed": 4
        };
        return campaignGuarantees.filter(guarantee => guarantee.member === memberId && guarantee.status === statusMap[status]).length;
    }, [campaignGuarantees]);


    function getAttendeesCountsForMember(campaignGuarantees, memberId) {
        let counts = {
            "Attended": 0
        };

        campaignGuarantees.forEach((guarantee) => {
            if (guarantee.member === memberId && guarantee.status === "Attended") {
                counts["Attended"] += 1;
            }
        });

        return counts;
    }


    function getStatusCountsForMember(campaignGuarantees, memberId) {
        const guaranteesForMember = campaignGuarantees.filter(item => item.member === memberId);

        let statusCounts = {
            "New": 0,
            "Contacted": 0,
            "Confirmed": 0,
            "Not Confirmed": 0
        };

        guaranteesForMember.forEach(guarantee => {
            switch (guarantee.status) {
                case 1:
                    statusCounts["New"] += 1;
                    break;
                case 2:
                    statusCounts["Contacted"] += 1;
                    break;
                case 3:
                    statusCounts["Confirmed"] += 1;
                    break;
                case 4:
                    statusCounts["Not Confirmed"] += 1;
                    break;
                default:
                    break;
            }
        });

        return statusCounts;
    }

    // First, aggregate the guarantees based on the guarantor
    const aggregatedGuarantors = campaignGuarantees.reduce((acc, curr) => {
        const memberInfo = campaignMembers.find(member => member.id === curr.member);
        const guarantorName = memberInfo ? memberInfo.user.name : 'Unknown';

        if (curr.member in acc) {
            acc[curr.member].count += 1;
        } else {
            acc[curr.member] = {
                name: guarantorName,
                count: 1,
                member: curr.member  // Add this line
            };
        }
        return acc;
    }, {});

    // Transform the aggregated object back to an array
    const guarantorData = Object.values(aggregatedGuarantors);

    const columns = useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name",
                Cell: (cellProps) => {
                    const guarantor = cellProps.row.original;
                    return (
                        < b > {guarantor.name}</b >
                    );
                },
            },
            {
                Header: "Total",
                Cell: (cellProps) => {
                    const memberId = cellProps.row.original.member;
                    const counts = getStatusCountsForMember(campaignGuarantees, memberId);
                    const totalCount = counts["New"] + counts["Confirmed"] + counts["Not Confirmed"];
                    return (
                        <strong>{totalCount}</strong>
                    );
                },
            },
            {
                Header: "Attended",
                Cell: (cellProps) => {
                    const memberId = cellProps.row.original.member;
                    const counts = getAttendeesCountsForMember(campaignGuarantees, memberId);
                    const totalCount = counts["Attended"];
                    return (
                        <strong>{totalCount}</strong>
                    );
                },
            },
            {
                Header: "New",
                // A method to count the New status for the member.
                Cell: (cellProps) => {
                    const memberId = cellProps.row.original.member;
                    const count = getStatusCount(memberId, "New");
                    return <p>{count}</p>;
                },
            },
            {
                Header: "Contacted",
                // A method to count the Contacted status for the member.
                Cell: (cellProps) => {
                    const memberId = cellProps.row.original.member;
                    const count = getStatusCount(memberId, "Contacted");
                    return <p>{count}</p>;
                },
            },
            {
                Header: "Confirmed",
                // A method to count the Contacted status for the member.
                Cell: (cellProps) => {
                    const memberId = cellProps.row.original.member;
                    const count = getStatusCount(memberId, "Confirmed");
                    return <p>{count}</p>;
                },
            },
            {
                Header: "Not Confirmed",
                // A method to count the Not Confirmed status for the member.
                Cell: (cellProps) => {
                    const memberId = cellProps.row.original.member;
                    const count = getStatusCount(memberId, "Not Confirmed");
                    return <p>{count}</p>;
                },
            },

        ],
        [campaignGuarantees, getStatusCount]
    );
    const [totals, setTotals] = useState({
        totalGuarantees: 0,
        totalNew: 0,
        totalContacted: 0,
        totalConfirmed: 0,
        totalNotConfirmed: 0,
        totalAttendees: 0,
    });

    useEffect(() => {
        // Calculate totals
        const totalGuarantees = campaignGuarantees.length;
        const totalNew = getAllStatusCount(campaignGuarantees, 1);
        const totalContacted = getAllStatusCount(campaignGuarantees, 2);
        const totalConfirmed = getAllStatusCount(campaignGuarantees, 3);
        const totalNotConfirmed = getAllStatusCount(campaignGuarantees, 4);
        const totalAttendees = getAllAttendeesCount(campaignGuarantees);

        const attendancePercentage = (totalAttendees / totalGuarantees) * 100;

        // Set totals in state
        setTotals({
            totalGuarantees,
            totalNew,
            totalContacted,
            totalConfirmed,
            totalNotConfirmed,
            totalAttendees,
        });
    }, [campaignGuarantees]);

    // Helper function to count guarantees with a specific status
    const getAllStatusCount = (guarantees, status) => {
        return guarantees.filter((guarantee) => guarantee.status === status).length;
    };

    // Helper function to count attendees
    const getAllAttendeesCount = (guarantees) => {
        return guarantees.filter((guarantee) => guarantee.status === "Attended").length;
    };

    return (

        < Col lg={12} >
            <Card>
                <CardBody>
                    <h5 className="card-title mb-3"><strong>المضامين</strong></h5>

                    <div className="px-2 py-2 mt-1">
                        <p className="mb-1">Guarantee Attendance <span className="float-end">{totals.attendancePercentage}%</span></p>
                        <div className="progress mt-2" style={{ height: "6px" }}>
                            <div
                                className="progress-bar progress-bar-striped bg-primary"
                                role="progressbar"
                                style={{ width: `${totals.attendancePercentage}%` }}
                                aria-valuenow={totals.attendancePercentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {totals.attendancePercentage}%
                            </div>
                        </div>
                    </div>

                    <p>
                        <strong>مجموع المضامين: {totals.totalGuarantees}</strong><br />
                        <span className="text-info">جديد:</span> <strong>{totals.totalNew}</strong> &nbsp;•&nbsp;
                        <span className="text-warning">تم التواصل:</span> <strong>{totals.totalContacted}</strong> &nbsp;•&nbsp;
                        <span className="text-success">مؤكد:</span> <strong>{totals.totalConfirmed}</strong> &nbsp;•&nbsp;
                        <span className="text-danger">غير مؤكد:</span> <strong>{totals.totalNotConfirmed}</strong>
                    </p>
                    <p><strong>الحضور: {totals.totalAttendees}</strong></p>
                    <Row>
                        <Col>
                            <TableContainer
                                // Data -------------------------
                                columns={columns}
                                data={guarantorData || []}  // Here's the change
                                customPageSize={50}

                                // Styling -------------------------
                                className="custom-header-css"
                                divClass="table-responsive table-card mb-2"
                                tableClass="align-middle table-nowrap"
                                theadClass="table-light"
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col >
    );
};

export default OverViewGuarantees;
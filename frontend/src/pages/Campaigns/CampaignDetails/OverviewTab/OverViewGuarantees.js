

// Pages/Campaigns/CampaignDetails/Components/OverViewGuarantees.js
// React & Redux core
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { campaignSelector } from 'Selectors';

// Components, Constants & Hooks
import { Loader, TableContainer, TableContainerHeader, TableContainerFilter } from "Components/Common";
import { MemberRoleOptions, GuaranteeStatusOptions } from "Components/constants";

// UI & Utilities
import { Card, CardBody, CardHeader, Col, Row, TabContent, Table, Progress, UncontrolledCollapse } from "reactstrap";

const STATUS_MAP = GuaranteeStatusOptions.reduce((acc, curr) => {
    acc[curr.value] = curr.id;
    return acc;
}, {});


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

    const getStatusCount = useCallback((memberId, statusValue) => {
        return campaignGuarantees.filter(guarantee =>
            guarantee.member === memberId &&
            guarantee.status === STATUS_MAP[statusValue]
        ).length;
    }, [campaignGuarantees]);



    function getAttendeesCountsForMember(campaignGuarantees, memberId) {
        let counts = {
            "Attended": 0
        };

        campaignGuarantees.forEach((guarantee) => {
            if (guarantee.member === memberId && guarantee.attended === true) {
                counts["Attended"] += 1;
            }
        });

        return counts;
    }


    // First, aggregate the guarantees based on the guarantor
    const aggregatedGuarantors = campaignGuarantees.reduce((acc, curr) => {
        const memberInfo = campaignMembers.find(member => member.id === curr.member);
        const guarantorName = memberInfo ? memberInfo.fullName : 'Unknown';

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

    function getBgClassForStatus(columnIndex) {
        const statusOption = GuaranteeStatusOptions.find(option => option.id === columnIndex - 1);
        const bgClass = statusOption ? statusOption.bgClass : '';
        return bgClass; // Return bgClass directly
    }

    const statusColumns = GuaranteeStatusOptions.map(statusOption => ({
        Header: statusOption.name,
        accessor: (rowData) => {
            const memberId = rowData.member;
            return getStatusCount(memberId, statusOption.value); // Change to statusOption.id
        }
    }));



    const columns = useMemo(
        () => [
            {
                Header: "الفريق",
                accessor: "name",
                Cell: (cellProps) => {
                    const guarantor = cellProps.row.original;
                    return <b>{guarantor.name}</b>;
                },
            },
            {
                Header: "المجموع",
                Cell: (cellProps) => {
                    const memberId = cellProps.row.original.member;
                    const totalCount = getGuaranteeCount(memberId);
                    return <strong>{totalCount}</strong>;
                },
            },
            ...statusColumns, // Spread the dynamically generated columns here
            {
                Header: "الحضور",
                Cell: (cellProps) => {
                    const memberId = cellProps.row.original.member;
                    const counts = getAttendeesCountsForMember(campaignGuarantees, memberId);
                    const totalCount = counts["Attended"];
                    return <strong>{totalCount}</strong>;
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
        const totalGuaranteesByStatus = GuaranteeStatusOptions.reduce((acc, statusOption) => {
            acc[statusOption.value] = getAllStatusCount(campaignGuarantees, statusOption.id);
            return acc;
        }, {});
        const totalAttendees = getAllAttendeesCount(campaignGuarantees);

        setTotals(prevTotals => {
            const updatedTotals = {
                ...prevTotals,
                totalGuarantees: campaignGuarantees.length,
                totalAttendees,
                ...totalGuaranteesByStatus,
            };
            const attendancePercentage = (updatedTotals.totalAttendees / updatedTotals.totalGuarantees) * 100;

            // Round to one decimal place
            const roundedAttendancePercentage = parseFloat(attendancePercentage.toFixed(1));

            return { ...updatedTotals, attendancePercentage: roundedAttendancePercentage };
        });
    }, [campaignGuarantees]);

    // Helper function to count guarantees with a specific status
    const getAllStatusCount = (guarantees, status) => {
        return guarantees.filter((guarantee) => guarantee.status === status).length;
    };

    // Helper function to count attendees
    const getAllAttendeesCount = (guarantees) => {
        return guarantees.filter((guarantee) => guarantee.attended === true).length;
    };

    return (


        < Col lg={12} >

            <Row>
                <Col sm={6}>
                    <Card>
                        <CardBody>
                            <h5 className="card-title mb-3"><strong>المضامين: {totals.totalGuarantees}</strong></h5>
                            <p>
                                <span className="text-info">جديد:</span> <strong>{totals.totalNew}</strong> &nbsp;•&nbsp;
                                <span className="text-warning">تم التواصل:</span> <strong>{totals.totalContacted}</strong> &nbsp;•&nbsp;
                                <span className="text-success">مؤكد:</span> <strong>{totals.totalConfirmed}</strong> &nbsp;•&nbsp;
                                <span className="text-danger">غير مؤكد:</span> <strong>{totals.totalNotConfirmed}</strong>
                            </p>
                            <div className="d-flex align-items-center py-2">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                        <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                            <i className="bx bx-select-multiple"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center py-2"> تواصل</div>

                                <div className="flex-grow-1">
                                    <div>
                                        <Progress value={totals.attendancePercentage} color="warning" className="animated-progess custom-progress progress-label" >
                                            <div className="label">{totals.attendancePercentage}%</div>
                                        </Progress>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center py-2">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                        <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                            <i className="bx bx-select-multiple"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center py-2"> مؤكد</div>

                                <div className="flex-grow-1">
                                    <div>
                                        <Progress value={totals.attendancePercentage} color="success" className="animated-progess custom-progress progress-label" >
                                            <div className="label">{totals.attendancePercentage}%</div>
                                        </Progress>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center py-2">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                        <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                            <i className="bx bx-select-multiple"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center py-2"> حضور</div>

                                <div className="flex-grow-1">
                                    <div>
                                        <Progress value={totals.attendancePercentage} color="info" className="animated-progess custom-progress progress-label" >
                                            <div className="label">{totals.attendancePercentage}%</div>
                                        </Progress>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={6}>
                    <Card>
                        <CardBody>
                            <h5 className="card-title mb-3"><strong>الحضور: {totals.totalAttendees}</strong></h5>
                            <p>
                                <span className="text-info">جديد:</span> <strong>{totals.totalNew}</strong> &nbsp;•&nbsp;
                                <span className="text-warning">تم التواصل:</span> <strong>{totals.totalContacted}</strong> &nbsp;•&nbsp;
                                <span className="text-success">مؤكد:</span> <strong>{totals.totalConfirmed}</strong> &nbsp;•&nbsp;
                                <span className="text-danger">غير مؤكد:</span> <strong>{totals.totalNotConfirmed}</strong>
                            </p>

                            <div className="d-flex align-items-center py-2">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                        <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                            <i className="bx bx-select-multiple"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center py-2"> تواصل</div>

                                <div className="flex-grow-1">
                                    <div>
                                        <Progress value={totals.attendancePercentage} color="warning" className="animated-progess custom-progress progress-label" >
                                            <div className="label">{totals.attendancePercentage}%</div>
                                        </Progress>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center py-2">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                        <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                            <i className="bx bx-select-multiple"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center py-2"> مؤكد</div>

                                <div className="flex-grow-1">
                                    <div>
                                        <Progress value={totals.attendancePercentage} color="success" className="animated-progess custom-progress progress-label" >
                                            <div className="label">{totals.attendancePercentage}%</div>
                                        </Progress>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center py-2">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                        <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                            <i className="bx bx-select-multiple"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center py-2"> حضور</div>

                                <div className="flex-grow-1">
                                    <div>
                                        <Progress value={totals.attendancePercentage} color="info" className="animated-progess custom-progress progress-label" >
                                            <div className="label">{totals.attendancePercentage}%</div>
                                        </Progress>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Card>
                <CardBody>
                    <h5 className="card-title mb-3"><strong>المضامين</strong></h5>

                    <Row>
                        <Col>
                            <TableContainer
                                // Data----------
                                columns={columns}
                                data={guarantorData || []}  // Here's the change
                                customPageSize={50}

                                // Styling----------
                                className="custom-header-css"
                                divClass="table-responsive table-card mb-2"
                                tableClass="align-middle table-nowrap"
                                theadClass="table-light"
                                getBgClassForStatus={getBgClassForStatus}
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col >
    );
};

export default OverViewGuarantees;
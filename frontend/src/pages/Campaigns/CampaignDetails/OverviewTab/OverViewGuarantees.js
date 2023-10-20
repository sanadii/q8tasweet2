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
import {
    getGuaranteeCount,
    aggregateGuarantors,
    getAttendeesCountsForMember,
    getAllStatusCount,
    getAllAttendeesCount
} from 'Components/Hooks/campaignCalculation';

const STATUS_MAP = GuaranteeStatusOptions.reduce((accumulator, currentValue) => {
    accumulator[currentValue.value] = currentValue.id;
    return accumulator;
}, {});


const OverViewGuarantees = () => {
    // 1. Hooks & State
    const {
        currentCampaignMember,
        campaignMembers,
        campaignGuarantees,
        campaignElectionCommittees,
    } = useSelector(campaignSelector);

    // Get count of guarantees for a member based on status
    const getStatusCount = useCallback((memberId, statusValue) => {
        return campaignGuarantees.filter(guarantee =>
            guarantee.member === memberId &&
            guarantee.status === STATUS_MAP[statusValue]
        ).length;
    }, [campaignGuarantees]);


    // Aggregate the guarantees based on the guarantor
    const aggregatedGuarantors = aggregateGuarantors(campaignGuarantees, campaignMembers);

    // Transform the aggregated object back to an array
    const guarantorData = Object.values(aggregatedGuarantors);

    // Get background class based on status option
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
                    const totalCount = getGuaranteeCount(campaignGuarantees, memberId);
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


    const initialState = ["totalGuarantees", "totalNew", "totalContacted", "totalConfirmed", "totalNotConfirmed", "totalAttendees"].reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    const [totals, setTotals] = useState(initialState);


    useEffect(() => {
        // Calculate totals
        const totalGuaranteesByStatus = GuaranteeStatusOptions.reduce((acc, statusOption) => {
            acc[statusOption.value] = getAllStatusCount(campaignGuarantees, statusOption.id);
            return acc;
        }, {});

        const totalNew = totalGuaranteesByStatus['New'];
        const totalContactedOnly = totalGuaranteesByStatus['Contacted'];
        const totalConfirmed = totalGuaranteesByStatus['Confirmed'];
        const totalContacted = totalContactedOnly + totalConfirmed;

        const totalNotConfirmed = totalGuaranteesByStatus['Not Confirmed'];
        const totalAttendees = getAllAttendeesCount(campaignGuarantees);

        setTotals(prevTotals => {
            const updatedTotals = {
                ...prevTotals,
                totalGuarantees: campaignGuarantees.length,
                totalNew,
                totalContacted,
                totalConfirmed,
                totalNotConfirmed,
                totalAttendees,
                ...totalGuaranteesByStatus,
            };

            const confirmedPercentage = (updatedTotals.totalContacted / updatedTotals.totalGuarantees) * 100;
            const contactedPercentage = (updatedTotals.totalConfirmed / updatedTotals.totalGuarantees) * 100;
            const attendancePercentage = (updatedTotals.totalAttendees / updatedTotals.totalGuarantees) * 100;

            // Check if calculations are valid
            if (isNaN(confirmedPercentage) || isNaN(contactedPercentage)) {
                console.error("Percentage calculations failed for confirmed or contacted values.");
            }

            // Round to one decimal place
            const roundedConfirmedPercentage = parseFloat(confirmedPercentage.toFixed(1));
            const roundedContactedPercentage = parseFloat(contactedPercentage.toFixed(1));
            const roundedAttendancePercentage = parseFloat(attendancePercentage.toFixed(1));

            return {
                ...updatedTotals,
                confirmedPercentage: roundedConfirmedPercentage,
                contactedPercentage: roundedContactedPercentage,
                attendancePercentage: roundedAttendancePercentage,
            };
        });
    }, [campaignGuarantees]);


    return (
        < Col lg={12} >
            <Row>
                <Col sm={6}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col sm={6}>
                                    <h5 className="card-title mb-3"><strong>المضامين: {totals.totalGuarantees}</strong></h5>
                                </Col>
                                <Col sm={6}>
                                    <h5 className="card-title mb-3"><strong>الحضور: {totals.totalAttendees}</strong></h5>
                                </Col>
                            </Row>
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
                                        <Progress value={totals.confirmedPercentage} color="warning" className="animated-progess custom-progress progress-label" >
                                            <div className="label">{totals.confirmedPercentage}%</div>
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
                                        <Progress value={totals.contactedPercentage} color="success" className="animated-progess custom-progress progress-label" >
                                            <div className="label">{totals.contactedPercentage}%</div>
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
                            <p>قريبا</p>
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
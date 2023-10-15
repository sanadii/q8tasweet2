

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
import { Card, CardBody, CardHeader, Col, Row, TabContent, Table, UncontrolledCollapse } from "reactstrap";

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

    const statusColumns = GuaranteeStatusOptions.map(statusOption => ({
        Header: statusOption.name,
        Cell: (cellProps) => {
            const memberId = cellProps.row.original.member;
            const count = getStatusCount(memberId, statusOption.value);
            return (
                <div style={{ backgroundColor: statusOption.badgeClass.split(' ').find(cls => cls.startsWith('bg-')) }}>
                    {count}
                </div>
            );
        },
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
            return { ...updatedTotals, attendancePercentage };
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
                                // Data----------
                                columns={columns}
                                data={guarantorData || []}  // Here's the change
                                customPageSize={50}

                                // Styling----------
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
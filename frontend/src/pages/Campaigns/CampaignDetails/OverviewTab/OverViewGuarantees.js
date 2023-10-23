// Pages/Campaigns/CampaignDetails/Components/OverViewGuarantees.js
// React & Redux core
import React, { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { campaignSelector } from 'Selectors';

// Components, Constants & Hooks
import GuaranteeTargetBar from "./GuaranteeTargetBar"
import GuaranteeCals from "./GuaranteeCals"
import GuaranteeChart from "./GuaranteeChart"
import GuaranteeTarget from "./GuaranteeRadialBar"
import GuaranteeRadialBar from "./GuaranteeRadialBar"


import { Loader, TableContainer } from "Components/Common";
import { GuaranteeStatusOptions } from "Components/constants";
import {
    calculateCampaignData,
    getGuaranteesCountsForMember,
    getAttendeesCountsForMember,
    getAggregatedGuarantorData,
    getStatusCountForMember,
    constructStatusColumns,
} from 'Components/Hooks/campaignCalculation';

// UI & Utilities
import { Card, CardHeader, CardBody, Col, Row, Progress } from "reactstrap";
import { DefaultProgressExample, BackgroundColorExample, LabelExample, MultipleBarsExample, HeightExample, StripedExample, AnimatedStripedExample, GradientExample, AnimatedExample, CustomExample, CustomProgressExample, ContentExample, ProgressWithStepExample, StepProgressArrowExample } from './UiProgressCode';
import PreviewCardHeader from "Components/Common/Components/PreviewCardHeader";


const OverViewGuarantees = () => {
    // 1. Hooks & State
    const {
        campaignDetails,
        campaignMembers,
        campaignGuarantees,
    } = useSelector(campaignSelector);

    // Aggregate the guarantees based on the guarantor & Transform to an array
    const results = calculateCampaignData(campaignDetails, campaignGuarantees);
    const guarantorData = getAggregatedGuarantorData(campaignGuarantees, campaignMembers);

    // Table: Get background class based on status option
    function getBgClassForStatus(columnIndex) {
        const statusOption = GuaranteeStatusOptions.find(option => option.id === columnIndex - 1);
        return statusOption ? statusOption.bgClass : '';
    }

    // Table: Get count of guarantees for a member based on status
    const getStatusCount = useCallback((memberId, statusValue) => {
        return getStatusCountForMember(campaignGuarantees, memberId, statusValue);
    }, [campaignGuarantees]);

    // Table: maping status options to columns
    const statusColumns = constructStatusColumns(campaignGuarantees);

    // Table: Get count of guarantees for a member
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
                    const totalCount = getGuaranteesCountsForMember(campaignGuarantees, memberId);
                    return <strong>{totalCount}</strong>;
                },
            },
            ...statusColumns, // Spread the dynamically generated columns here
            {
                Header: "الحضور",
                Cell: (cellProps) => {
                    const memberId = cellProps.row.original.member;
                    const totalCount = getAttendeesCountsForMember(campaignGuarantees, memberId);
                    return <strong>{totalCount}</strong>;
                },
            },
        ],
        [campaignGuarantees, getStatusCount]
    );

    return (
        < Col lg={12}>

            <GuaranteeTargetBar
                campaignDetails={campaignDetails}
                results={results}
            />

            <Row>
                <Col sm={6}>
                    <GuaranteeChart
                        campaignDetails={campaignDetails}
                        campaignGuarantees={campaignGuarantees}
                        results={results}
                    />
                </Col>
                <Col sm={6}>
                    <GuaranteeRadialBar
                        campaignDetails={campaignDetails}
                        campaignGuarantees={campaignGuarantees}
                        results={results}
                    />
                </Col>

            </Row>


            {/* <Row className="d-flex align-items-stretch pb-3">
      
                <Col sm={6}>
                    <GuaranteeCals
                        campaignDetails={campaignDetails}
                        campaignGuarantees={campaignGuarantees}
                        results={results}
                    />
                </Col>
            </Row > */}

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
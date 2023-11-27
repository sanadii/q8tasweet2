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


import { Loader, TableContainer } from "components";
import {
    calculateCampaignData,
    getAggregatedGuarantorData,
    constructStatusColumns,
    getBgClassForStatus,
} from 'hooks/campaignCalculation';

// UI & Utilities
import { Card, CardBody, Col, Row } from "reactstrap";


const OverViewGuarantees = () => {
    // State management
    const { campaignDetails, campaignMembers, campaignGuarantees } = useSelector(campaignSelector);
    const results = calculateCampaignData(campaignDetails, campaignGuarantees);
    const guarantorData = getAggregatedGuarantorData(campaignGuarantees, campaignMembers);
    const statusColumns = constructStatusColumns(campaignGuarantees);

    // Table: Get count of guarantees for a member
    const columns = useMemo(
        () => [
            {
                Header: "الفريق",
                accessor: "name",
                Cell: (cellProps) => (<b>{cellProps.row.original.name}</b>)
            },
            {
                Header: "المضامين",
                Cell: (cellProps) => (<b>{cellProps.row.original.total}</b>)
            },
            {
                Header: "الحضور",
                Cell: (cellProps) => (<b>{cellProps.row.original.attended}</b>)
            },
            ...statusColumns,
        ],
        [campaignGuarantees]
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
                    <h5 className="card-title mb-3"><strong>الضامنين</strong></h5>
                    <Row>
                        <Col>
                            <TableContainer
                                // Data
                                columns={columns}
                                data={guarantorData || []}  // Here's the change
                                customPageSize={50}

                                // Styling
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
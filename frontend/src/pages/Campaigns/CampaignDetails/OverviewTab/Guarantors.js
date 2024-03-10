// React & Redux core
import React, { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { campaignSelector } from 'selectors';

import { Loader, TableContainer } from "shared/components";
import {
    getAggregatedGuarantorData,
    constructStatusColumns,
    getBgClassForStatus,
} from 'shared/hooks';

// UI & Utilities
import { Card, CardBody, Col, Row } from "reactstrap";


const Guarantors = () => {
    // State management
    const { campaignMembers, campaignGuarantees } = useSelector(campaignSelector);
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

export default Guarantors;
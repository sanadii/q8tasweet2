// React, Redux & Store imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getElectors } from "store/actions";
import { Loader, TableContainer } from "shared/components";
import { campaignSelector, electorSelector } from 'selectors';

// Component imports
import ElectorsModal from "./ElectorsModal";
import { Id, Name, Actions } from "./ElectorsCol";

// Reactstrap (UI) imports
import { Col, Row, Card, CardHeader, CardBody, Label, Input } from "reactstrap";

const ElectorSearchDisplay = ({
    setModalMode,
    toggle
}) => {

    const {
        currentCampaignMember,
        campaignDetails,
        campaignMembers,
        campaignGuarantees,
        campaignAttendees,
    } = useSelector(campaignSelector);

    const { voters } = useSelector(electorSelector);

    const [electorList, setElectorList] = useState(voters);
    useEffect(() => {
        setElectorList(voters);
    }, [voters]);



    // View Elector Info
    const [voter, setElector] = useState(null);

    const handleElectorClick = useCallback(
        (arg, modalMode) => {
            const voter = arg;
            setElector({
                // Elector Fields
                civil: voter.civil,
                campaignId: campaignDetails.id,
                gender: voter.gender,
                fullName: voter.fullName,
                status: voter.status,
                notes: voter.notes,
            });
            // Set the modalMode state here
            setModalMode(modalMode);
            toggle();
        },
        [toggle, setModalMode, campaignDetails.id]
    );

    const columns = useMemo(
        () => [
            {
                Header: "الاسم",
                accessor: row => ({ fullName: row.fullName, gender: row.gender }),
                Cell: (cellProps) => <Name {...cellProps} />
            },
            {
                Header: "اجراءات",
                Cell: (cellProps) => <Actions
                    cellProps={cellProps}
                    handleElectorClick={handleElectorClick}
                    currentCampaignMember={currentCampaignMember}
                    campaignGuarantees={campaignGuarantees}
                    campaignAttendees={campaignAttendees}
                    campaignDetails={campaignDetails}
                    voters={voters} />
            },
        ],
        [
            handleElectorClick,
            campaignGuarantees,
            campaignAttendees,
            voters,
            campaignDetails,
            currentCampaignMember
        ]);

    return (
        <React.Fragment>
            {electorList && electorList.length ? (
                <TableContainer
                    columns={columns}
                    data={electorList || []}
                    customPageSize={50}
                    className="custom-header-css"
                    divClass="table-responsive table-card mb-2"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light"
                />
            ) : (
                <p>لا شيء لعرضه، ابدأ أو قم بتحسين بحثك</p>
            )}
        </React.Fragment>
    )
}

export default ElectorSearchDisplay
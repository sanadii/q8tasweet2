// React, Redux & Store imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getElectors } from "store/actions";
import { Loader, TableContainer } from "shared/components";
import { campaignSelector, electorSelector } from 'selectors';

// Component imports
import ElectorsModal from "./ElectorsModal";
import { Title, SimpleNumber, Actions } from "shared/components";

// Form
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormFields } from "shared/components";
import { getFieldDynamicOptions } from "shared/hooks";


// Reactstrap (UI) imports
import { Col, Row, Card, CardHeader, CardBody, Label, Input } from "reactstrap";

const ElectorSearchDisplay = ({
    electionSchema,
    handleElectorClick,
    setModalMode,
    toggle
}) => {

    const {
        currentCampaignMember,
        campaignDetails,
        campaignMembers,
        campaignGuarantees,
        campaignAttendees,
        campaignGuaranteeGroups,
    } = useSelector(campaignSelector);


    const [selectedGuaranteeGroup, setSelectedGuaranteeGroup] = useState("")
    const guaranteeGroupOptions = getFieldDynamicOptions(campaignGuaranteeGroups)

    const { electorsBySearch } = useSelector(electorSelector);
    const [electorList, setElectorList] = useState(electorsBySearch);
    useEffect(() => {
        setElectorList(electorsBySearch);
    }, [electorsBySearch]);


    // View Elector Info
    const [elector, setElector] = useState(null);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            guaranteeGroup: campaignGuaranteeGroups[1],
        },
        // selectedGuaranteeGroup: 
    });


    const electorAddress = false
    const electorCommittee = false

    const columnsDefinition = useMemo(
        () => [
            {
                Header: "الاسم",
                accessor: row => ({ fullName: row.fullName, gender: row.gender }),
                Cell: (cellProps) =>
                    <Title
                        title={cellProps.row.original.fullName}
                        subTitle={cellProps.row.original.id}
                        gender={cellProps.row.original.gender}
                    />
            },
            {
                Header: "العمر",
                Cell: (cellProps) =>
                    <SimpleNumber
                        number={cellProps.row.original.age}
                    />
            },
            {
                Header: "المنطقة",
                Cell: (cellProps) => {
                    const address = {
                        block: cellProps.row.original.block,
                        street: cellProps.row.original.street,
                        lane: cellProps.row.original.lane,
                        house: cellProps.row.original.house,
                    };

                    return (
                        <Title
                            title={cellProps.row.original.areaName}
                            subTitle={`ق${address.block}, ش${address.street}, ج${address.lane}, م${address.house}`}
                        />
                    );
                },
                display: electorAddress
            },

            {
                Header: "اللجنة",
                Cell: (cellProps) =>
                    <Title
                        title={cellProps.row.original.committeeSiteName}
                        subTitle={`لجنة ${cellProps.row.original.committee} - ${cellProps.row.original.committeeType}`}
                    />,
                display: electorCommittee

            },
            {
                Header: "اجراءات",
                Cell: (cellProps) =>
                    <Actions
                        options={["view", "addGuarantee", "addAttendee"]}
                        cell={cellProps}
                        schema={electionSchema}
                        handleItemClicks={handleElectorClick}
                        // handleItemDeleteClick={handleItemDeleteClick}
                        selectedGuaranteeGroup={selectedGuaranteeGroup}

                        // cellProps={cellProps}
                        // selectedGuaranteeGroup={selectedGuaranteeGroup}
                        // electionSchema={electionSchema}
                        // handleElectorClick={handleElectorClick}
                        currentCampaignMember={currentCampaignMember}
                        campaignGuarantees={campaignGuarantees}
                        campaignAttendees={campaignAttendees}
                        campaignDetails={campaignDetails}
                        electorsBySearch={electorsBySearch}
                    />
            },
        ],
        [
            selectedGuaranteeGroup,
            handleElectorClick,
            campaignGuarantees,
            campaignAttendees,
            electorsBySearch,
            campaignDetails,
            currentCampaignMember,
            electionSchema,
            electorAddress,
            electorCommittee
        ]);

    const columns = useMemo(() => {
        return columnsDefinition.filter(column => {
            if (column.display === false) return false;
            return column;
        });
    }, [columnsDefinition]);

    return (
        <React.Fragment>
            <Row>
                <Input
                    type="select"
                    className="form-select"
                    name="guaranteeGroup"
                    id="guaranteeGroup-field"
                    onChange={(e) => setSelectedGuaranteeGroup(e.target.value)}
                    value={selectedGuaranteeGroup}
                >
                    {guaranteeGroupOptions.map(group => (
                        <option key={group.id} value={group.value}>
                            {group.label}
                        </option>
                    ))}

                </Input>
            </Row>

            {
                electorList && electorList.length ? (
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
                )
            }
        </React.Fragment >
    )
}

export default ElectorSearchDisplay
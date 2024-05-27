// React, Redux & Store imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getElectors } from "store/actions";
import { Loader, TableContainer } from "shared/components";
import { campaignSelector, electorSelector } from 'selectors';

// Component imports
import ElectorsModal from "./ElectorsModal";
import { Id, Name, Area, Committee, Actions } from "./ElectorsCol";

// Form
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormFields } from "shared/components";
import { getSelectionOptions } from "shared/hooks";


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
            guaranteeGroup: 1,
        },
    });

    // const groupFields = [
    //     {
    //         id: "guaranteeGroup-field",
    //         name: "guaranteeGroup",
    //         label: "المجموعة",
    //         type: "select",
    //         options: getSelectionOptions(campaignGuaranteeGroups),
    //         colSize: "2",
    //     },
    // ]

    const columns = useMemo(
        () => [
            {
                Header: "الاسم",
                accessor: row => ({ fullName: row.fullName, gender: row.gender }),
                Cell: (cellProps) => <Name {...cellProps} />
            },
            {
                Header: "المنطقة",
                Cell: (cellProps) => <Area {...cellProps} />
            },
            {
                Header: "اللجنة",
                Cell: (cellProps) => <Committee {...cellProps} />
            },
            {
                Header: "اجراءات",
                Cell: (cellProps) => <Actions
                    cellProps={cellProps}
                    campaignGroup={validation.values.guaranteeGroup}
                    electionSchema={electionSchema}
                    handleElectorClick={handleElectorClick}
                    currentCampaignMember={currentCampaignMember}
                    campaignGuarantees={campaignGuarantees}
                    campaignAttendees={campaignAttendees}
                    campaignDetails={campaignDetails}
                    electorsBySearch={electorsBySearch} />
            },
        ],
        [
            handleElectorClick,
            campaignGuarantees,
            campaignAttendees,
            electorsBySearch,
            campaignDetails,
            currentCampaignMember,
            electionSchema,
        ]);



    return (
        <React.Fragment>
            {/* <Row>
                {groupFields.map((field) => (
                    <FormFields
                        key={field.id}
                        field={field}
                        validation={validation}
                        formStructure="inline"
                    />
                ))}
            </Row> */}
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

            <div className="form-check form-check-info mb-3">
                <Input className="form-check-input" type="checkbox" id="formCheck11" defaultChecked />
                <Label className="form-check-label" for="formCheck11">
                    Checkbox Info
                </Label>
            </div>
        </React.Fragment>
    )
}

export default ElectorSearchDisplay
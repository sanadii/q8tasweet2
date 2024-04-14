import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuarantee } from "store/actions";
import { campaignSelector } from 'selectors';

// Shared imports
import { Col, Row, Card, CardBody, CardHeader, Nav, NavItem, NavLink } from "reactstrap";
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader, TableContainerFilter } from "shared/components";
import { CheckboxHeader, CheckboxCell, Id, Name, Phone, Attended, Status, Guarantor, Actions } from "../GuaranteeList/GuaranteesCol";
import { useDelete, useFilter } from "shared/hooks"

// Utility imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GuaranteesGroupList = ({
    toggle,
    setModalMode,
    setCampaignGuaranteeGroup,
}) => {

    // States
    const {
        campaignGuarantees,
        campaignGuaranteeGroups,
        campaignMembers,
        isCampaignGuaranteeSuccess,
        error
    } = useSelector(campaignSelector);

    // Constants

    // Delete Hook
    const {
        handleDeleteItem,
        onDeleteCheckBoxClick,
        deleteModal,
        setDeleteModal,
        checkedAll,
        deleteCheckbox,
        isMultiDeleteButton,
        deleteModalMulti,
        setDeleteModalMulti,
        deleteMultiple,
    } = useDelete(deleteCampaignGuarantee);


    const handleCampaignGuaranteeClick = useCallback(
        (arg, modalMode) => {
            const campaignGuaranteeGroup = arg;
            setCampaignGuaranteeGroup({
                id: campaignGuaranteeGroup.id,
                member: campaignGuaranteeGroup.member,
                campaign: campaignGuaranteeGroup.campaign,
                civil: campaignGuaranteeGroup.civil,
                fullName: campaignGuaranteeGroup.fullName,
                gender: campaignGuaranteeGroup.gender,
                boxNo: campaignGuaranteeGroup.boxNo,
                membershipNo: campaignGuaranteeGroup.membershipNo,
                enrollmentDate: campaignGuaranteeGroup.enrollmentDate,
                phone: campaignGuaranteeGroup.phone,
                status: campaignGuaranteeGroup.status,
                notes: campaignGuaranteeGroup.notes,
            });

            // Set the modalMode state here
            setModalMode(modalMode);
            toggle();
        },
        [setCampaignGuaranteeGroup, setModalMode, toggle]
    );



    const memberName = (campaignMembers || []).reduce((acc, member) => {
        acc[member.id] = member;
        return acc;
    }, {});
    const columns = useMemo(
        () => [
            {
                Header: () => <CheckboxHeader checkedAll={checkedAll} />,
                accessor: "id",
                Cell: (cellProps) => <CheckboxCell {...cellProps} deleteCheckbox={deleteCheckbox} />,
            },
            {
                Header: "م.",
                Cell: (cellProps) => <Id {...cellProps} />
            },
            {
                Header: "المجموعة",
                accessor: row => ({ name: row.name, gender: row.gender }),
                Cell: (cellProps) => <Name {...cellProps} />
            },
            {
                Header: "الضامن",
                filterable: false,
                Cell: (cellProps) =>
                    <Guarantor
                        cellProps={cellProps}
                        campaignMembers={campaignMembers}
                    />
            },
            {
                Header: "التليفون",
                accessor: "phone",
                Cell: (cellProps) => <Phone {...cellProps} />
            },
            {
                Header: "عدد الناخبين",
                accessor: "guarantees",
                Cell: (cellProps) => <Phone {...cellProps} />
            },

            {
                Header: "إجمالي الحضور",
                accessor: "guaranteesAttended",
                Cell: (cellProps) => <Attended {...cellProps} />
            },
            {
                Header: "نسبة التصويت",
                filterable: false,
                Cell: (cellProps) => <Status {...cellProps} />
            },
            {
                Header: "إجراءات",
                Cell: (cellProps) =>
                    <Actions
                        cellProps={cellProps}
                        handleCampaignGuaranteeClick={handleCampaignGuaranteeClick}
                        onDeleteCheckBoxClick={onDeleteCheckBoxClick}
                    />
            },
        ], [checkedAll, deleteCheckbox, onDeleteCheckBoxClick, handleCampaignGuaranteeClick, campaignMembers]);

    // Assuming useFilter returns an object with a property named filteredData
    const filterResult = useFilter(campaignGuaranteeGroups);

    // Now, if campaignGuaranteeGroups is truthy, we destructure filteredData from it
    const campaignGuaranteeList = campaignGuaranteeGroups ? filterResult.filteredData : [];

    // Destructuring other properties directly as they are not dependent on campaignGuaranteeGroups
    const { filters, setFilters } = filterResult;


    return (
        <React.Fragment>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteItem}
                onCloseClick={() => setDeleteModal(false)}
            />
            <DeleteModal
                show={deleteModalMulti}
                onDeleteClick={() => {
                    deleteMultiple();
                    setDeleteModalMulti(false);
                }}
                onCloseClick={() => setDeleteModalMulti(false)}
            />

            <TableFilters
                // Filters
                isGlobalFilter={true}
                preGlobalFilteredRows={true}
                isGuarantorFilter={true}
                isResetFilters={true}

                // Settings
                filters={filters}
                setFilters={setFilters}
                SearchPlaceholder="البحث بالاسم أو الرقم المدني..."

            />

            {campaignGuaranteeList ? (
                <TableContainer
                    // Data
                    columns={columns}
                    data={campaignGuaranteeList || []}
                    customPageSize={50}

                    // Styling
                    className="custom-header-css"
                    divClass="table-responsive table-card mb-2"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light"
                />
            ) : (
                <Loader error={error} />
            )}
            <ToastContainer closeButton={false} limit={1} />

        </React.Fragment>
    );
};

export default GuaranteesGroupList;

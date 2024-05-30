import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuaranteeGroup } from "store/actions";
import { campaignSelector } from 'selectors';

// Shared imports
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader, TableContainerFilter } from "shared/components";
import {
    CheckboxHeader, CheckboxCell, Id, Name,
    SimpleName, DueDate, Badge, CreateBy, Actions,
    Phone, Guarantor,
    Guarantees,
    Attended,
    AttendedPercentage,
} from "shared/components"

// import { CheckboxHeader, CheckboxCell, Id, Name, Phone, Guarantees, Attended, AttendedPercentage, Guarantor, Actions } from "./GuaranteeGroupsCol";
import { useDelete, useFilter } from "shared/hooks"

// Utility imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GuaranteesGroupList = ({
    toggle,
    setModalMode,
    setCampaignGuaranteeGroup,
    selectedCampaignMember,
    campaignMember,
    handleSelectCampaignGuaranteeGroup,
}) => {


    // States
    const {
        electionSlug,
        campaignGuarantees,
        campaignGuaranteeGroups,
        campaignMembers,
        campaignRoles,
        isCampaignGuaranteeSuccess,
        error
    } = useSelector(campaignSelector);

    // Delete Hook
    const {
        // Delete Modal
        handleDeleteItem,
        deleteModal,
        setDeleteModal,
        deleteModalMulti,
        handleDeleteMultiple,

        // Table Header
        isMultiDeleteButton,
        setDeleteModalMulti,

        // Column Actions
        handleItemDeleteClick,
        handleCheckAllClick,
        handleCheckCellClick,
    } = useDelete(deleteCampaignGuaranteeGroup);

    const handleCampaignGuaranteeGroupClick = useCallback(
        (campaignGuaranteeGroup, modalMode) => {
            setCampaignGuaranteeGroup(campaignGuaranteeGroup);
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
                Header: () => <CheckboxHeader handleCheckAllClick={handleCheckAllClick} />,
                accessor: "id",
                Cell: (cellProps) => <CheckboxCell {...cellProps} handleCheckCellClick={handleCheckCellClick} />,
            },
            {
                Header: "م.",
                Cell: (cellProps) => <Id {...cellProps} />
            },
            {
                Header: "المجموعة",
                accessor: "name",
                Cell: (cellProps) => (
                    <Name
                        id={cellProps.row.original.id}
                        name={cellProps.row.original.name}
                        handleClickedItem={handleSelectCampaignGuaranteeGroup}
                    />
                )
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
                Header: "الهاتف",
                accessor: "phone",
                Cell: (cellProps) => <Phone {...cellProps} />
            },
            // {
            //     Header: "الناخبين",
            //     Cell: (cellProps) =>
            //         <Guarantees
            //             cell={cellProps}
            //             memberId={cellProps.row.original.id}
            //             campaignGuarantees={campaignGuarantees}
            //             campaignRoles={campaignRoles}
            //         />
            // },
            {
                Header: "الحضور",
                accessor: "guaranteesAttended",
                Cell: (cellProps) => <Attended {...cellProps} />
            },
            {
                Header: "نسبة التصويت",
                filterable: false,
                Cell: (cellProps) => <AttendedPercentage {...cellProps} />
            },
            {
                Header: "إجراءات",
                Cell: (cellProps) =>
                    <Actions
                        options={["view", "update", "delete"]}
                        cell={cellProps}
                        schema={electionSlug}
                        handleItemClick={handleCampaignGuaranteeGroupClick}
                        handleItemDeleteClick={handleItemDeleteClick}
                    />
            },
        ], [handleSelectCampaignGuaranteeGroup, electionSlug, handleCheckAllClick, handleCheckCellClick, handleItemDeleteClick, handleCampaignGuaranteeGroupClick, campaignMembers]);

    // Assuming useFilter returns an object with a property named filteredData
    const filterResult = useFilter(campaignGuaranteeGroups);

    // Now, if campaignGuaranteeGroups is truthy, we destructure filteredData from it
    const campaignGuaranteeGroupList = campaignGuaranteeGroups ? filterResult.filteredData : [];

    // Destructuring other properties directly as they are not dependent on campaignGuaranteeGroups
    const { filters, setFilters } = filterResult || [];

    useEffect(() => {
        // Check if selectedCampaignMember and its id exist
        if (selectedCampaignMember && selectedCampaignMember.id) {
            // Update the filters using setFilters function
            setFilters(prevFilters => ({
                ...prevFilters,
                member: selectedCampaignMember.id
            }));
        }
    }, [selectedCampaignMember, setFilters]);


    return (
        <React.Fragment>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={() => handleDeleteItem()}
                onCloseClick={() => setDeleteModal(false)}
            />

            <DeleteModal
                show={deleteModalMulti}
                onDeleteClick={() => {
                    handleDeleteMultiple();
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

            {campaignGuaranteeGroupList ? (
                <TableContainer
                    // Data
                    columns={columns}
                    data={campaignGuaranteeGroupList || []}
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

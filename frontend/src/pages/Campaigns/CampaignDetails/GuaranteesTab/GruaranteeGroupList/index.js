import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuaranteeGroup } from "store/actions";
import { campaignSelector } from 'selectors';

// Shared imports
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader, TableContainerFilter } from "shared/components";
import { CheckboxHeader, CheckboxCell, Id, Name, Phone, Guarantees, Attended, AttendedPercentage, Guarantor, Actions } from "./GuaranteeGroupsCol";
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
        campaignGuarantees,
        campaignGuaranteeGroups,
        campaignMembers,
        isCampaignGuaranteeSuccess,
        error
    } = useSelector(campaignSelector);

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
    } = useDelete(deleteCampaignGuaranteeGroup);


    const handleCampaignGuaranteeClick = useCallback(
        (arg, modalMode) => {
            const campaignGuaranteeGroup = arg;
            setCampaignGuaranteeGroup({
                id: campaignGuaranteeGroup.id,
                member: campaignGuaranteeGroup.member,
                campaign: campaignGuaranteeGroup.campaign,
                name: campaignGuaranteeGroup.name,
                gender: campaignGuaranteeGroup.gender,
                phone: campaignGuaranteeGroup.phone,
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
                accessor: "name",
                Cell: (cellProps) => (
                    <Name
                        cellProps={cellProps}
                        handleSelectCampaignGuaranteeGroup={handleSelectCampaignGuaranteeGroup}
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
                Header: "التليفون",
                accessor: "phone",
                Cell: (cellProps) => <Phone {...cellProps} />
            },
            {
                Header: "الناخبين",
                accessor: "guarantees",
                Cell: (cellProps) => <Guarantees {...cellProps} />
            },

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
                        cellProps={cellProps}
                        handleCampaignGuaranteeClick={handleCampaignGuaranteeClick}
                        onDeleteCheckBoxClick={onDeleteCheckBoxClick}
                    />
            },
        ], [checkedAll, deleteCheckbox, onDeleteCheckBoxClick, handleCampaignGuaranteeClick, campaignMembers]);

    // Assuming useFilter returns an object with a property named filteredData
    const filterResult = useFilter(campaignGuaranteeGroups);

    // Now, if campaignGuaranteeGroups is truthy, we destructure filteredData from it
    const campaignGuaranteeGroupList = campaignGuaranteeGroups ? filterResult.filteredData : [];

    // Destructuring other properties directly as they are not dependent on campaignGuaranteeGroups
    const { filters, setFilters } = filterResult;

    // useEffect(() => {
    //     // Assuming setFilters is a function that updates something related to 'member' with the selectedCampaignMember
    //     setFilters({ member: selectedCampaignMember.id });
    //     console.log("filters: ", filters)
    //     console.log("filterResult: ", filterResult)

    // }, [selectedCampaignMember]); // Include setFilters in dependencies if it's a state setter or could change

    useEffect(() => {
        console.log("filters: ", filters)
        console.log("filterResult: ", filterResult)

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

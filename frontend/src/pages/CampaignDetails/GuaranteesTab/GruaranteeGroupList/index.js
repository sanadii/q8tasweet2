import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuaranteeGroup } from "store/actions";
import { campaignSelector } from 'selectors';

// Shared imports
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader, TableContainerFilter } from "shared/components";
import {
    CheckboxHeader, CheckboxCell, Id, Name,
    SimpleName, DateTime, Badge, CreateBy, Actions,
    Phone, CampaignMember,
    Guarantees,
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


    // Take the guarantee Group
    // we have for now 3 groups
    // and take the guarantees, we have so many, each guarantee has a group
    // sort the guarantee by
    // group Name:, if there is no group Name put member and find his name from guaranteeMembers
    // and put how many guarantee in each group
    // and console log the result

    const [guaranteeGroups, setGuaranteeGroups] = useState([]);

    useEffect(() => {
        // Map campaignMembers by their id for quick access
        const memberMap = campaignMembers.reduce((acc, member) => {
            acc[member.id] = "لا يوجد";
            return acc;
        }, {});

        // Map campaignGuaranteeGroups by their id for quick access
        const groupMap = campaignGuaranteeGroups.reduce((acc, group) => {
            acc[group.id] = group.name;
            return acc;
        }, {});

        // Initialize a result object to store the count of guarantees in each group
        const result = {};

        campaignGuarantees.forEach((guarantee) => {
            // Determine the group name or member name
            const groupName =
                groupMap[guarantee.group] || memberMap[guarantee.member] || "Unknown";

            // Initialize the group in result if not already present
            if (!result[groupName]) {
                result[groupName] = {
                    memberName: memberMap[guarantee.member] || "Unknown",
                    count: 0,
                };
            }

            // Increment the count for the group
            result[groupName].count++;
        });

        // Convert result to an array of objects for returning and setting state
        const sortedResult = Object.keys(result)
            .map((groupName) => ({
                groupName,
                memberName: result[groupName].memberName,
                count: result[groupName].count,
            }))
            .sort((a, b) => a.groupName.localeCompare(b.groupName));

        // Log the sorted result
        console.log("sortedResult: ", sortedResult);

        // Update state with sorted result
        setGuaranteeGroups(sortedResult);

        // Create new guarantee groups for guarantees without a guaranteeGroup
        const newGuaranteeGroups = campaignGuarantees
            .filter((guarantee) => !guarantee.group)
            .map((guarantee) => ({
                id: null,
                name: memberMap[guarantee.member],
                member: guarantee.member,
                phone: "", // Add phone if available
                note: "", // Add note if available
            }));

        // Remove duplicates from newGuaranteeGroups based on member
        const uniqueNewGuaranteeGroups = newGuaranteeGroups.filter(
            (group, index, self) =>
                index === self.findIndex((g) => g.member === group.member)
        );

        // Log the new guarantee groups
        console.log("newGuaranteeGroups: ", uniqueNewGuaranteeGroups);

        // Update state with new guarantee groups
        setGuaranteeGroups((prevGroups) => [
            ...uniqueNewGuaranteeGroups,
            ...campaignGuaranteeGroups,
        ]);

    }, [
        campaignGuarantees,
        campaignGuaranteeGroups,
        campaignMembers,
        isCampaignGuaranteeSuccess,
    ]);

    console.log("guaranteeGroups: ", guaranteeGroups);


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
                    <CampaignMember
                        memberId={cellProps.row.original.member}
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
                Header: "المضامين",
                accessor: "guarantees",
                Cell: (cellProps) =>
                    <Guarantees
                        guaranteeGroupId={cellProps.row.original.id}
                        memberId={cellProps.row.original.member}
                        campaignGuarantees={campaignGuarantees}
                        count="guaranteeGroups"

                    />
            },
            {
                Header: "الحضور",
                accessor: "guaranteesAttended",
                Cell: (cellProps) =>
                    <Guarantees
                        guaranteeGroupId={cellProps.row.original.committeeGroup}
                        campaignGuarantees={campaignGuarantees}
                        count="attendees"
                    />
            },
            {
                Header: "نسبة التصويت",
                Cell: (cellProps) =>
                    <Guarantees
                        memberId={cellProps.row.original.member}
                        campaignGuarantees={campaignGuarantees}
                        count="percentage"
                    />
            },
            {
                Header: "إجراءات",
                Cell: (cellProps) =>
                    <Actions
                        options={["view", "update", "delete"]}
                        cell={cellProps}
                        schema={electionSlug}
                        handleItemClicks={handleCampaignGuaranteeGroupClick}
                        handleItemDeleteClick={handleItemDeleteClick}
                    />
            },
        ], [handleSelectCampaignGuaranteeGroup, electionSlug, campaignGuarantees, handleCheckAllClick, handleCheckCellClick, handleItemDeleteClick, handleCampaignGuaranteeGroupClick, campaignMembers]);

    // Assuming useFilter returns an object with a property named filteredData
    const { filteredData: campaignGuaranteeGroupList, filters, setFilters } = useFilter(guaranteeGroups);

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

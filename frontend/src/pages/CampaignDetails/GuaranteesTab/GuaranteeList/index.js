import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuarantee } from "store/actions";
import { campaignSelector } from 'selectors';

// Shared imports
import { Loader, DeleteModal, TableContainer, TableFilters } from "shared/components";
import { CheckboxHeader, CheckboxCell, Id, Name, Phone, Attended, Status, Guarantor, GuaranteeGroups, Actions } from "./GuaranteesCol";
import { useDelete, useFilter } from "shared/hooks"

// Utility imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GuaranteeList = ({
  toggle,
  setModalMode,
  setCampaignGuarantee
}) => {

  // States
  const {
    campaignGuarantees,
    campaignMembers,
    campaignGuaranteeGroups,
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
  } = useDelete(deleteCampaignGuarantee);


  console.log("isMultiDeleteButton: ", isMultiDeleteButton)
  const handleCampaignGuaranteeClick = useCallback(
    (campaignGuarantee, modalMode) => {
      setCampaignGuarantee(campaignGuarantee);
      setModalMode(modalMode);
      toggle();
    },
    [setModalMode, toggle, setCampaignGuarantee]
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
        Header: "الاسم",
        accessor: row => ({ name: row.name, gender: row.gender }),
        Cell: (cellProps) => <Name {...cellProps} />
      },
      {
        Header: "التليفون",
        accessor: "phone",
        Cell: (cellProps) => <Phone {...cellProps} />
      },
      {
        Header: "الحضور",
        accessor: "attended",
        Cell: (cellProps) => <Attended {...cellProps} />
      },
      {
        Header: "الحالة",
        filterable: false,
        Cell: (cellProps) => <Status {...cellProps} />
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
        Header: "المجموعة",
        filterable: false,
        Cell: (cellProps) =>
          <GuaranteeGroups
            cellProps={cellProps}
            campaignGuaranteeGroups={campaignGuaranteeGroups}
          />
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
      {
        Header:
          isMultiDeleteButton && (
            <button
              className="btn btn-sm btn-soft-danger"
              onClick={() => setDeleteModalMulti(true)}
            >
              <i className="ri-delete-bin-2-line "></i>
            </button>
          ),
        accessor: "delete_action", // Unique accessor
      },
    ], [checkedAll, isMultiDeleteButton, handleCampaignGuaranteeClick, campaignMembers]);

  // Table Filters
  const { filteredData: campaignGuaranteeList, filters, setFilters } = useFilter(campaignGuarantees);

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
        isGenderFilter={true}
        isGuaranteeAttendanceFilter={true}
        isGuaranteeStatusFilter={true}
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

export default GuaranteeList;

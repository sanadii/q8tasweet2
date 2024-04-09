import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuarantee } from "store/actions";
import { campaignSelector } from 'selectors';

// Shared imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { Loader, DeleteModal, TableContainer, TableFilters } from "shared/components";
import { CheckboxHeader, CheckboxCell, Id, Name, Phone, Attended, Status, Guarantor, Actions } from "./GuaranteesCol";
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
    isCampaignGuaranteeSuccess,
    error
  } = useSelector(campaignSelector);

  // Delete Hook
  const {
    handleDeleteItem,
    onClickDelete,
    deleteModal,
    setDeleteModal,
    checkedAll,
    deleteCheckbox,
    isMultiDeleteButton,
    deleteModalMulti,
    setDeleteModalMulti,
    deleteMultiple,
  } = useDelete(deleteCampaignGuarantee);

  // console.log("modal: ", modal, "modalMod: ", modalMode, "campaignGuarantee: ", campaignGuarantee)
  const handleCampaignGuaranteeClick = useCallback(
    (arg, modalMode) => {
      const campaignGuarantee = arg;
      setCampaignGuarantee({
        id: campaignGuarantee.id,
        member: campaignGuarantee.member,
        campaign: campaignGuarantee.campaign,
        civil: campaignGuarantee.civil,
        fullName: campaignGuarantee.fullName,
        gender: campaignGuarantee.gender,
        boxNo: campaignGuarantee.boxNo,
        membershipNo: campaignGuarantee.membershipNo,
        enrollmentDate: campaignGuarantee.enrollmentDate,
        phone: campaignGuarantee.phone,
        status: campaignGuarantee.status,
        notes: campaignGuarantee.notes,
      });

      // Set the modalMode state here
      setModalMode(modalMode);
      toggle();
    },
    [setModalMode, toggle]
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
        Header: "إجراءات",
        Cell: (cellProps) =>
          <Actions
            cellProps={cellProps}
            handleCampaignGuaranteeClick={handleCampaignGuaranteeClick}
            onClickDelete={onClickDelete}
          />
      },
    ], [checkedAll, deleteCheckbox, onClickDelete, handleCampaignGuaranteeClick, campaignMembers]);

  // Table Filters
  const { filteredData: campaignGuaranteeList, filters, setFilters } = useFilter(campaignGuarantees);

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteItem}
        onCloseClick={() => setDeleteModal(false)}
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

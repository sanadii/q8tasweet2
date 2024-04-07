import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuarantee } from "store/actions";
import { campaignSelector } from 'selectors';

// Shared imports
import { Col, Row, Card, CardBody, CardHeader, Nav, NavItem, NavLink } from "reactstrap";
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader, TableContainerFilter } from "shared/components";
import { CheckboxHeader, CheckboxCell, Id, Name, Phone, Attended, Status, Guarantor, Actions } from "./GuaranteesCol";
import { useDelete, useFilter } from "shared/hooks"

import GuaranteesModal from "./GuaranteesModal";

// Utility imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GuaranteesGroupsTab = () => {
  const dispatch = useDispatch();

  // States
  const {
    campaignGuarantees,
    campaignMembers,
    isCampaignGuaranteeSuccess,
    error
  } = useSelector(campaignSelector);

  // Constants
  const [campaignGuarantee, setCampaignGuarantee] = useState(null);

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

  // Modal Constants
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggle = useCallback(() => {
    setIsModalVisible(prevIsModalVisible => !prevIsModalVisible);
  }, []);

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
    [toggle]
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
    ], [handleCampaignGuaranteeClick, campaignMembers]);

  // Filters
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

      <GuaranteesModal
        modal={isModalVisible}
        modalMode={modalMode}
        toggle={toggle}
        campaignGuarantee={campaignGuarantee}
      />

      <Row>
        <Col lg={12}>
          <Card id="memberList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // Title
                  ContainerHeaderTitle="المضامين"
                  toggle={toggle}

                  // Delete Button
                  isMultiDeleteButton={isMultiDeleteButton}
                  setDeleteModalMulti={setDeleteModalMulti}
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
              </div>
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default GuaranteesGroupsTab;

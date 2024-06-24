// React & Redux core
import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

// Compontents, Constants, Hooks
import MembersModal from "./MembersModal";
import { Loader, DeleteModal, TableContainer, TableContainerHeader, TableFilters } from "shared/components";
import { CheckboxHeader, CheckboxCell, Name, Actions, Phone, Role, Team, Guarantees, Attendees, Sorted, Committee, Supervisor } from "shared/components"
import { usePermission, useFilter, useDelete } from "shared/hooks";

// Store & Selectors
import { deleteCampaignMember } from "store/actions";
import { campaignSelector } from 'selectors';

// UI & Utilities
import { Col, Row, Button, Card, CardBody } from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MembersList = () => {

  // State Management
  const {
    currentCampaignMember,
    campaignGuarantees,
    campaignAttendees,
    campaignMembers,
    campaignRoles,
    campaignElectionCommittees,
    isCampaignMemberSuccess,
    error
  } = useSelector(campaignSelector);

  // Permission Hook
  const {
    canChangeConfig,
    canChangeCampaignSupervisor,
    canChangeCampaignCoordinator,
  } = usePermission();

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
  } = useDelete(deleteCampaignMember);

  // Finding Active Role to Show Different Table Columns
  const [activeTab, setActiveTab] = useState("all"); // Initialize with "campaignManagers"
  const [campaignMember, setCampaignMember] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const activeRole = activeTab;

  const isSuperiorCampaignMember = campaignMember && currentCampaignMember.roleId < campaignMember.roleId;

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCampaignMember(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  const handleCampaignMemberClicks = useCallback(
    (campaignMember, modalMode) => {
      setCampaignMember(campaignMember);
      setModalMode(modalMode);
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Add Data
  const handleAddCampaignMemberClick = () => {
    setCampaignMember("");
    setModalMode("add");
    setIsEdit(false);
    toggle();
  };

  // 
  // Table Columns
  // 
  const columnsDefinition = useMemo(() => [
    {
      Header: () => <CheckboxHeader handleCheckAllClick={handleCheckAllClick} />,
      accessor: "id",
      Cell: (cellProps) => <CheckboxCell {...cellProps} handleCheckCellClick={handleCheckCellClick} />,
    },
    {
      Header: "العضو",
      accessor: "fullName",
      Cell: (cellProps) => (
        <Name
          name={cellProps.row.original.name}
        // handleSelectCampaignMember={handleSelectCampaignMember}
        />
      )
    },
    {
      Header: "الهاتف",
      accessor: "mobile",
      Cell: (cellProps) => <Phone {...cellProps} />
    },
    {
      Header: "الرتبة",
      accessor: "roleId",
      // TabsToShow: ["campaignManagers", "all"],
      Cell: (cellProps) =>
        <Role
          cellProps={cellProps}
          campaignRoles={campaignRoles}
        />
    },
    {
      Header: "المسؤول",
      accessor: "supervisor",
      // TabsToShow: ["campaignManagers", "all"],
      Cell: (cellProps) =>
        <Supervisor
          cellProps={cellProps}
          campaignMembers={campaignMembers}
        />
    },

    {
      Header: "الفريق",
      TabsToShow: ["campaignSupervisor"],
      Cell: (cellProps) =>
        <Team
          cellProps={cellProps}
          campaignMembers={campaignMembers}
        />
    },
    {
      Header: "المضامين",
      accessor: "guarantees",
      Cell: (cellProps) =>
        <Guarantees
          memberId={cellProps.row.original.id}
          campaignGuarantees={campaignGuarantees}
          count="guarantees"

        />
    },
    {
      Header: "الحضور",
      accessor: "guaranteesAttended",
      Cell: (cellProps) =>
        <Guarantees
          memberId={cellProps.row.original.id}
          campaignGuarantees={campaignGuarantees}
          count="attendees"
        />
    },
    {
      Header: "نسبة التصويت",
      Cell: (cellProps) =>
        <Guarantees
          memberId={cellProps.row.original.id}
          campaignGuarantees={campaignGuarantees}
          count="percentage"
        />
    },
    {
      Header: "اللجنة",
      TabsToShow: ["campaignAttendant", "campaignSorter"],
      Cell: (cellProps) => <Committee cellProps={cellProps} campaignElectionCommittees={campaignElectionCommittees} />
    },
    {
      Header: "الحضور",
      TabsToShow: ["campaignAttendant"],
      Cell: (cellProps) => <Attendees cellProps={cellProps} campaignAttendees={campaignAttendees} />
    },
    {
      Header: "تم الفرز",
      TabsToShow: ["campaignSorter"],
      Cell: (cellProps) => <Sorted cellProps={cellProps} />
    },
    {
      Header: "الوكيل",
      TabsToShow: ["campaignGuarantor", "campaignAttendant", "campaignSorter"],
      Cell: (cellProps) =>
        <Supervisor
          campaignMembers={campaignMembers} cellProps={cellProps}
        />,
      show: canChangeCampaignSupervisor // Add this line
    },
    {
      Header: "إجراءات",
      Cell: (cellProps) => (
        <Actions
          options={["view", "update", "delete"]}
          cell={cellProps}
          handleItemClicks={handleCampaignMemberClicks}
          handleItemDeleteClick={handleItemDeleteClick}
          canChangeConfig={canChangeConfig}
          campaignMembers={campaignMembers}
          campaignRoles={campaignRoles}
          currentCampaignMember={currentCampaignMember}
        />
      )
    }
  ], [handleCheckCellClick, handleItemDeleteClick, handleCheckAllClick,
    currentCampaignMember, campaignAttendees, campaignElectionCommittees, campaignGuarantees, campaignMembers, campaignRoles, canChangeCampaignSupervisor, canChangeConfig, handleCampaignMemberClicks

  ]);

  const columns = useMemo(() => {
    return columnsDefinition.filter(column => {
      if (column.show === false) return false;
      if (!column.TabsToShow) return true;
      return column.TabsToShow.includes(activeRole);
    });
  }, [activeRole, columnsDefinition]);

  // 
  // Table Filters
  // 
  const { filteredData: campaignMemberList, filters, setFilters } = useFilter(campaignMembers);

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

      <MembersModal
        modal={modal}
        modalMode={modalMode}
        toggle={toggle}
        campaignMember={campaignMember}
        isEdit={isEdit}
        setModal={setModal}

      />

      <Row>
        <Col lg={12}>
          <Card id="memberList">
            <TableContainerHeader
              // Title
              ContainerHeaderTitle="فريق العمل"

              // Add Elector Button
              PrimaryButtonText="إضافة عضو"
              HandlePrimaryButton={handleAddCampaignMemberClick}
              isEdit={isEdit}
              // setIsEdit={setIsEdit}
              toggle={toggle}

              // Delete Button
              isMultiDeleteButton={isMultiDeleteButton}
              setDeleteModalMulti={setDeleteModalMulti}
            />

            <CardBody>
              <div>
                <TableFilters
                  // Filters
                  isMemberRoleFilter={true}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  filters={filters}
                  setFilters={setFilters}
                />


                {campaignMembers && campaignMembers.length ? (
                  <TableContainer
                    // Data----------
                    columns={columns}
                    data={campaignMemberList || []}
                    customPageSize={50}

                    // Sorting---------
                    sortBy="roleId"
                    sortAsc={true}

                    // Styling----------
                    className="custom-header-css"
                    divClass="table-responsive table-card mb-2"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light"
                  />

                ) : (
                  <p>لا يوجد فريق عمل</p>
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

export default MembersList;
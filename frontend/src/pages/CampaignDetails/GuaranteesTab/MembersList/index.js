// React & Redux core
import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

// Compontents, Constants, Hooks
import { Loader, DeleteModal, TableContainer, TableFilters } from "shared/components";
import { usePermission, useFilter, useDelete } from "shared/hooks";
import { Id, CheckboxHeader, CheckboxCell, Name, Mobile, Role, Team, Guarantees, Attendees, Committee, Sorted, Supervisor, Actions } from "./MemberCol";

// Store & Selectors
import { deleteCampaignMember } from "store/actions";
import { campaignSelector } from 'selectors';

// UI & Utilities
import { Card, CardBody } from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MembersList = ({
  toggle,
  setModalMode,
  setCampaignMember,
  handleSelectCampaignMember,
}) => {

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
  } = useDelete(deleteCampaignMember);

  // Finding Active Role to Show Different Table Columns
  const [activeTab, setActiveTab] = useState("all"); // Initialize with "campaignManagers"
  const activeRole = activeTab;

  const handleCampaignMemberClick = useCallback(
    (arg, modalMode) => {
      const campaignMember = arg;

      setCampaignMember({
        id: campaignMember.id,
        campaignId: campaignMember.campaign,
        userId: campaignMember.user.id,
        name: campaignMember.name,
        role: campaignMember.role,
        supervisor: campaignMember.supervisor,
        committee: campaignMember.committee,
        phone: campaignMember.phone,
        notes: campaignMember.notes,
        status: campaignMember.status,
      });
      // Set the modalMode state here
      setModalMode(modalMode);
      toggle();
    },
    [toggle, setCampaignMember, setModalMode]
  );


  // 
  // Table Columns
  // 
  const columnsDefinition = useMemo(() => [
    {
      Header: () => <CheckboxHeader checkedAll={checkedAll} />,
      accessor: "id",
      Cell: (cellProps) => <CheckboxCell {...cellProps} deleteCheckbox={deleteCheckbox} />,
    },
    {
      Header: "العضو",
      accessor: "fullName",
      Cell: (cellProps) => (
        <Name
          cellProps={cellProps}
          handleSelectCampaignMember={handleSelectCampaignMember}
        />
      )
    },
    {
      Header: "الهاتف",
      accessor: "mobile",
      Cell: (cellProps) => <Mobile {...cellProps} />
    },
    {
      Header: "الرتبة",
      accessor: "role",
      // TabsToShow: ["campaignManagers", "all"],
      Cell: (cellProps) => <Role cellProps={cellProps} campaignRoles={campaignRoles} />
    },
    {
      Header: "الفريق",
      TabsToShow: ["campaignSupervisor"],
      Cell: (cellProps) => <Team cellProps={cellProps} campaignMembers={campaignMembers} />
    },
    {
      Header: "المضامين",
      // TabsToShow: ["campaignCandidate", "campaigaignManager", "campaignSupervisor", "campaignGuarantor", "campaignManagers"],
      Cell: (cellProps) => (
        <Guarantees
          cellProps={cellProps}
          campaignGuarantees={campaignGuarantees}
          campaignRoles={campaignRoles}
        />
      )
    },
    {
      Header: "المصوتين",
      // TabsToShow: ["campaignCandidate", "campaigaignManager", "campaignSupervisor", "campaignGuarantor", "campaignManagers"],
      Cell: (cellProps) => (
        <Guarantees
          cellProps={cellProps}
          campaignGuarantees={campaignGuarantees}
          campaignRoles={campaignRoles}
        />
      )
    },
    {
      Header: "نسبة التصويت",
      // TabsToShow: ["campaignCandidate", "campaigaignManager", "campaignSupervisor", "campaignGuarantor", "campaignManagers"],
      Cell: (cellProps) => (
        <span>60 %</span>
      )
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
      Cell: (cellProps) => <Supervisor campaignMembers={campaignMembers} cellProps={cellProps} />,
      show: canChangeCampaignSupervisor // Add this line
    },
    {
      Header: "إجراءات",
      Cell: (cellProps) => (
        <Actions
          cellProps={cellProps}
          handleCampaignMemberClick={handleCampaignMemberClick}
          onDeleteCheckBoxClick={onDeleteCheckBoxClick}
          canChangeConfig={canChangeConfig}
          campaignMembers={campaignMembers}
          campaignRoles={campaignRoles}
        />
      )
    }
  ], [checkedAll, deleteCheckbox, handleSelectCampaignMember, handleCampaignMemberClick, onDeleteCheckBoxClick, campaignAttendees, campaignGuarantees, campaignElectionCommittees, canChangeConfig, canChangeCampaignSupervisor, campaignMembers, campaignRoles]);

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
      <Card id="memberList">
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
    </React.Fragment>
  );
};

export default MembersList;
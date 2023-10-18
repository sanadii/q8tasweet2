// React & Redux core
import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { deleteCampaignMember } from "store/actions";
import { campaignSelector } from 'Selectors';

// Compontents, Constants, Hooks
import MembersModal from "./MembersModal";
import { DeleteModal, TableContainer, TableContainerHeader } from "Components/Common";
import { usePermission, useDelete } from "Components/Hooks";
import { Id, Name, Role, Team, Guarantees, Attendees, Committee, Sorted, Supervisor, Actions } from "./MemberCol";

// UI & Utilities
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MembersTab = () => {

  // States
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
    canChangeConfigs,
  } = usePermission();

  // Delete Hook
  const {
    handleDeleteItem,
    onClickDelete,
    setDeleteModal,
    deleteModal,
  } = useDelete(deleteCampaignMember);

   // Filtering and fining Member Match
  const [filters, setFilters] = useState({
    global: "",
    role: null,
  });

  const matchingRole = campaignRoles.find(role => role.id === filters.role);
  const activeRole = matchingRole?.role;

  // Toggle Function
  const [campaignMember, setCampaignMember] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);

  console.log("campaignMember?", campaignMember)

  const toggle = useCallback(() => {
    if (modal) {
      console.log("model set true false")
      setModal(false);
      // setCampaignMember(null);
    } else {
      setModal(true);
      console.log("model set true")
    }
  }, [modal]);

  const handleCampaignMemberClick = useCallback(
    (arg, modalMode) => {
      const campaignMember = arg;

      setCampaignMember({
        id: campaignMember.id,
        campaignId: campaignMember.campaign,
        userId: campaignMember.user.id,
        name: campaignMember.user.name,
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
    [toggle]
  );

  const handleCampaignMemberClicks = () => {
    setCampaignMember("");
    setModalMode("AddModal");
    toggle();
  };

  const columnsDefinition = [
    {
      Header: "م.",
      accessor: "id",
      Cell: (cellProps) => <Id {...cellProps} />
    },
    {
      Header: "العضو",
      accessor: "fullName",
      Cell: (cellProps) => <Name {...cellProps} />
    },
    {
      Header: "الرتبة",
      accessor: "role",
      Cell: (cellProps) => <Role cellProps={cellProps} campaignRoles={campaignRoles} />
    },
    {
      Header: "المضامين",
      ShowTo: ["CampaignDirector", "CampaigaignAssistant", "CampaignCandidate", "CampaignCoordinator", "CampaignGuarantor", "manager"],
      Cell: (cellProps) => <Guarantees cellProps={cellProps} campaignGuarantees={campaignGuarantees} />
    },
    {
      Header: "الفريق",
      ShowTo: ["CampaignCandidate", "CampaignCoordinator"],
      Cell: (cellProps) => <Team cellProps={cellProps} campaignMembers={campaignMembers} />
    },
    {
      Header: "اللجنة",
      ShowTo: ["CampaignAttendant", "CampaignSorter"],
      Cell: (cellProps) => <Committee cellProps={cellProps} campaignElectionCommittees={campaignElectionCommittees} />
    },
    {
      Header: "الحضور",
      ShowTo: ["CampaignAttendant"],
      Cell: (cellProps) => <Attendees cellProps={cellProps} campaignAttendees={campaignAttendees} />
    },
    {
      Header: "تم الفرز",
      ShowTo: ["CampaignSorter"],
      Cell: (cellProps) => <Sorted cellProps={cellProps} />
    },
    {
      Header: "المشرف",
      ShowTo: ["CampaignGuarantor", "CampaignAttendant", "CampaignSorter"],
      Cell: (cellProps) => <Supervisor campaignMembers={campaignMembers} cellProps={cellProps} />
    },
    {
      Header: "إجراءات",
      Cell: (cellProps) => (
        <Actions
          cellProps={cellProps}
          handleCampaignMemberClick={handleCampaignMemberClick}
          onClickDelete={onClickDelete}
          canChangeConfigs={canChangeConfigs}
        />
      )
    }
  ];

  const columns = useMemo(() => {
    return columnsDefinition.filter(column => {
      if (!column.ShowTo) return true; // always show columns without a ShowTo key
      return column.ShowTo.includes(activeRole);
    });
  }, [activeRole, columnsDefinition]);


  // Table Filters

  const campaignMemberList = campaignMembers.filter(campaignMember => {
    let isValid = true;

    // Check the role if there's a filter set for it
    if (filters.role !== null) {
      if (Array.isArray(filters.role)) {
        isValid = isValid && filters.role.includes(campaignMember.role);
      } else {
        isValid = isValid && campaignMember.role === filters.role;
      }
    }

    // Check the global filter (e.g., for searching by name)
    if (filters.global) {
      isValid = isValid && campaignMember.user.name &&
        typeof campaignMember.user.name === 'string' &&
        campaignMember.user.name.toLowerCase().includes(filters.global.toLowerCase());
    }

    return isValid;
  });
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteItem}
        onCloseClick={() => setDeleteModal(false)}
      />
      <MembersModal
        modal={modal}
        setModal={setModal}
        modalMode={modalMode}
        toggle={toggle}
        campaignMember={campaignMember}
      />
      <Row>
        <Col lg={12}>
          <Card id="memberList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // Title
                  ContainerHeaderTitle="فريق العمل"

                  // Add Button
                  isAddButton={true}
                  AddButtonText="اضافة عضو"
                  handleAddButtonClick={handleCampaignMemberClicks}
                  toggle={toggle}
                />

                {campaignMembers && campaignMembers.length ? (
                  <TableContainer
                    campaignMember={campaignMember}

                    // Filters----------
                    isTableContainerFilter={true}
                    isGlobalFilter={true}
                    preGlobalFilteredRows={true}

                    isMemberRoleFilter={true}
                    isResetFilters={true}

                    // Settings
                    filters={filters}
                    setFilters={setFilters}
                    // preGlobalFilteredRows={true}
                    SearchPlaceholder="البحث..."

                    // Actions
                    // onTabChange={handleTabChange}


                    // Data----------
                    columns={columns}
                    data={campaignMemberList || []}
                    // setCampaignMemberList={setCampaignMemberList}
                    customPageSize={50}
                    // TODO: to find out what is this for and how to be used with the table
                    // handleItemClick={() => handleCampaignMemberClick(campaignMember, "AddModal")}

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

export default MembersTab;
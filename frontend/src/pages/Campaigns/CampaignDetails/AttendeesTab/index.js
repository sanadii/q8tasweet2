// React, Redux & Store imports
import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignAttendee } from "store/actions";
import { campaignSelector } from 'Selectors';

// Component imports
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader } from "components";
import { useDelete, useFilter, useUserRoles } from "hooks";

import AttendeesModal from "./AttendeesModal";
import { Id, Name, Attendant, Actions } from "./AttendeesCol";

// Utility imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AttendeesList = () => {
  const dispatch = useDispatch();

  const {
    campaignDetails,
    campaignElectionCommittees,
    campaignElectionCandidates,
    campaignMembers,
    campaignAttendees,
    campaignRoles,
    isCampaignAttendeeSuccess,
    error
  } = useSelector(campaignSelector);

  const [campaignAttendee, setCampaignAttendee] = useState([]);

  const { isAdmin, isSubscriber, isModerator, isParty, isCandidate, isSupervisor, isGuarantor, isAttendant, isSorter, isBelowSupervisor, isAttendantOrSorter } = useUserRoles();
  const electionId = campaignDetails.election.id;


  // Delete Modal Constants
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);


  // Delete Multiple Constants
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);


  // Delete Data
  const handleDeleteCampaignAttendee = () => {
    if (campaignAttendee) {
      dispatch(deleteCampaignAttendee(campaignAttendee.id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (campaignAttendee) => {
    setCampaignAttendee(campaignAttendee);
    setDeleteModal(true);
  };

  // Modal Constants
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggle = useCallback(() => {
    setIsModalVisible(prev => !prev);
  }, []);

  const handleCampaignAttendeeClick = useCallback(
    (arg, modalMode) => {
      const campaignAttendee = arg;
      setCampaignAttendee({
        id: campaignAttendee.id,
        user: campaignAttendee.user,
        civil: campaignAttendee.civil,
        fullName: campaignAttendee.fullName,
        gender: campaignAttendee.gender,
        boxNo: campaignAttendee.boxNo,
        membershipNo: campaignAttendee.membershipNo,
        enrollmentDate: campaignAttendee.enrollmentDate,
        notes: campaignAttendee.notes,
      });

      // Set the modalMode state here
      setModalMode(modalMode);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".campaignAttendeeCheckBox");

    if (checkall.checked) {
      checkedEntry.forEach((checkedEntry) => {
        checkedEntry.checked = true;
      });
    } else {
      checkedEntry.forEach((checkedEntry) => {
        checkedEntry.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(deleteCampaignAttendee(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(
      ".campaignAttendeeCheckBox:checked"
    );
    checkedEntry.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(checkedEntry);
  };

  const [activeTab, setActiveTab] = useState("0");

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const getGenderIcon = (gender) => {
    if (gender === 2) {
      return <i className="mdi mdi-circle align-middle text-danger me-2"></i>;
    } else if (gender === 1) {
      return <i className="mdi mdi-circle align-middle text-info me-2"></i>;
    }
    return null;
  };

  const findUserById = useCallback((userId) => {
    const member = campaignMembers.find(
      (member) => member.user && member.user.id === userId
    );
    return member?.user?.name || "User not found";
  }, [campaignMembers]); // campaignMembers as dependency

  const findCommitteeById = useCallback((committeeId) => {
    const committee = campaignElectionCommittees.find(
      (committee) => committee && committee.id === committeeId
    );
    return committee?.name || "لا يوجد";
  }, [campaignElectionCommittees]); // campaignElectionCommittees as dependency

  const columns = useMemo(() => [
    // {
    //   Header: (
    //     <input
    //       type="checkbox"
    //       id="checkBoxAll"
    //       className="form-check-input"
    //       onClick={() => checkedAll()}
    //     />
    //   ),
    //   Cell: (cellProps) => {
    //     return (
    //       <input
    //         type="checkbox"
    //         className="campaignAttendeeCheckBox form-check-input"
    //         value={cellProps.row.original.id}
    //         onChange={() => deleteCheckbox()}
    //       />
    //     );
    //   },
    //   id: "#",
    // },
    {
      Header: "م.",
      Cell: (cellProps) => <Id {...cellProps} />
    },
    {
      Header: "الاسم",
      accessor: row => ({ fullName: row.fullName, gender: row.gender }),
      Cell: (cellProps) => <Name {...cellProps} />
    },
    {
      Header: "اللجنة",
      accessor: "committee",
      Cell: (cellProps) => {
        const committeeId = cellProps.row.original.committee; // Directly access the user ID from original data
        const committeeName = findCommitteeById(committeeId);
        return <p>{committeeName}</p>;
      },
    },
    {
      Header: "المحضر",
      accessor: "user",
      Cell: (cellProps) => {
        return <p>{cellProps.row.original.user}</p>;
      },
    },
    // Only for Attendants
    {
      Header: "إجراءات",
      Cell: (cellProps) =>
        <Actions
          cellProps={cellProps}
          handleCampaignAttendeeClick={handleCampaignAttendeeClick}
          onClickDelete={onClickDelete}
          isAdmin={isAdmin}
          isAttendant={isAttendant}
        />
    },
  ],
    // [handleCampaignAttendeeClick, checkedAll, findCommitteeById, findUserById, isAdmin, isAttendant]
    [handleCampaignAttendeeClick, findCommitteeById, findUserById, isAdmin, isAttendant]
  );

  // Filters
  const { filteredData: campaignAttendeeList, filters, setFilters } = useFilter(campaignAttendees);
  console.log("campaignAttendees: ", campaignAttendees)
  console.log("campaignAttendeeList: ", campaignAttendeeList)


  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCampaignAttendee}
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

      <AttendeesModal
        modal={isModalVisible}
        modalMode={modalMode}
        toggle={toggle}
        campaignAttendee={campaignAttendee}
      />

      <Row>
        <Col lg={12}>
          <Card id="memberList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // Title
                  ContainerHeaderTitle="تحضير الناخبين"
                  toggle={toggle}

                  // Delete Button
                  isMultiDeleteButton={isMultiDeleteButton}
                  setDeleteModalMulti={setDeleteModalMulti}
                />

                <TableFilters
                  isGlobalFilter={true}
                  preGlobalFilteredRows={true}
                  isGenderFilter={true}
                  isAttendeeStatusFilter={true}
                  isCommitteeFilter={true}
                  isResetFilters={true}

                  // Settings
                  filters={filters}
                  setFilters={setFilters}
                  SearchPlaceholder="البحث بالاسم أو الرقم المدني..."
                />


                {campaignAttendeeList ? (
                  <TableContainer
                    // Data
                    columns={columns}
                    data={campaignAttendeeList || []}
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

export default AttendeesList;

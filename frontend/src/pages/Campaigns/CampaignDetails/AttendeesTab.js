// --------------- React, Redux & Store imports ---------------
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignAttendee, updateCampaignAttendee } from "../../../store/actions";
import { electionsSelector } from '../../../Selectors/electionsSelector';

// Component imports
import { Col, Row, Card, CardBody, CardHeader } from "reactstrap";
import { Loader, DeleteModal, TableContainer, TableContainerHeader, TableContainerFilter } from "../../../Components/Common";
import CampaignAttendeesModal from "./Modals/CampaignAttendeesModal";
import { GuaranteeStatusOptions } from "../../../Components/constants";
import useUserRoles from "../../../Components/Hooks/useUserRoles";

// Utility imports
import { toast, ToastContainer } from "react-toastify";

// CSS imports
import "react-toastify/dist/ReactToastify.css";

const AttendeesList = () => {
  const dispatch = useDispatch();

  const { campaignDetails, campaignElectionCommittees, campaignElectionCandidates, campaignMembers, campaignAttendees,isCampaignAttendeeSuccess, error  } = useSelector(electionsSelector);
  const { isAdmin, isSubscriber, isModerator, isParty, isCandidate, isSupervisor, isGuarantor, isAttendant, isSorter, isBelowSupervisor, isAttendantOrSorter } = useUserRoles();
  
  const electionId = campaignDetails.election.id;
  // Delete Modal Constants
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [campaignAttendee, setCampaignAttendee] = useState([]);

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
        full_name: campaignAttendee.full_name,
        box_no: campaignAttendee.box_no,
        membership_no: campaignAttendee.membership_no,
        enrollment_date: campaignAttendee.enrollment_date,
        status: campaignAttendee.status,
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
    return committee?.name || "Committee not found";
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
        Header: "الاسم",
        Cell: (cellProps) => {
          return (
            <div>
              {getGenderIcon(cellProps.row.original.gender)}
              <b>{cellProps.row.original.full_name}</b>
              <br />
              {cellProps.row.original.civil}
            </div>
          );
        },
      },
      {
        Header: "اللجنة",
        accessor: "civil",
        Cell: (cellProps) => {
          const committeeId = cellProps.row.original.committee; // Directly access the user ID from original data
          const committeeName = findCommitteeById(committeeId);
          return <p>{committeeName}</p>;
        },
      },
      {
        Header: "الحضور",
        filterable: false,
        Cell: (cellProps) => {
          const userId = cellProps.row.original.user; // Directly access the user ID from original data
          const userName = findUserById(userId);
          return (
            <p className="text-info">
              <strong>{userName}</strong>
            </p>
          );
        },
      },

      // Only for Attendants
      {
        Header: "إجراءات",
        Cell: (cellProps) => {
          return (
            <div className="list-inline hstack gap-2 mb-0">
              <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                  const campaignAttendee = cellProps.row.original;
                  handleCampaignAttendeeClick(
                    campaignAttendee,
                    "GuaranteeViewModal"
                  );
                }}
              >
                <i className="ri-eye-fill align-bottom" />
              </button>
              {(isAdmin || isAttendant) && (
                <>
                  <button
                    to="#"
                    className="btn btn-sm btn-soft-info edit-list"
                    onClick={() => {
                      const campaignAttendee = cellProps.row.original;
                      handleCampaignAttendeeClick(
                        campaignAttendee,
                        "GuaranteeUpdateModal"
                      );
                    }}
                  >
                    <i className="ri-pencil-fill align-bottom" />
                  </button>
                  <button
                    to="#"
                    className="btn btn-sm btn-soft-danger remove-list"
                    onClick={() => {
                      const campaignAttendee = cellProps.row.original;
                      onClickDelete(campaignAttendee);
                    }}
                  >
                    <i className="ri-delete-bin-5-fill align-bottom" />
                  </button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    // [handleCampaignAttendeeClick, checkedAll, findCommitteeById, findUserById, isAdmin, isAttendant]
    [handleCampaignAttendeeClick, findCommitteeById, findUserById, isAdmin, isAttendant]
  );

  // Filters -------------------------
  const [filters, setFilters] = useState({
    global: "",
    gender: null,
    committee: null,
    member: null,
  });

  const campaignAttendeeList = campaignAttendees.filter(campaignAttendee => {
    let isValid = true;
    if (filters.global) {
      const globalSearch = filters.global.toLowerCase();

      const nameIncludes = campaignAttendee.full_name && typeof campaignAttendee.full_name === 'string' && campaignAttendee.full_name.toLowerCase().includes(globalSearch);
      const civilIncludes = campaignAttendee.civil && typeof campaignAttendee.civil === 'number' && String(campaignAttendee.civil).includes(globalSearch);

      isValid = isValid && (nameIncludes || civilIncludes);
    }
    if (filters.gender !== null) {
      isValid = isValid && campaignAttendee.gender === filters.gender;
    }
    if (filters.committee !== null) {
      isValid = isValid && campaignAttendee.committee === filters.committee;
    }
    return isValid;
  });



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

      <CampaignAttendeesModal
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

                  // Add Elector Button
                  // isAddElectorButton={true}
                  // AddButtonText="Add New Guarantee"
                  // handleAddButtonClick={handleCampaignMemberClicks}
                  toggle={toggle}

                  // Delete Button
                  isMultiDeleteButton={isMultiDeleteButton}
                  setDeleteModalMulti={setDeleteModalMulti}
                />
                {campaignAttendeeList ? (
                  <TableContainer
                    // Filters -------------------------
                    isTableContainerFilter={true}
                    isGenderFilter={true}
                    isCommitteeFilter={true}
                    isResetFilters={true}

                    // Settings
                    filters={filters}
                    setFilters={setFilters}

                    // Global Filters
                    isGlobalFilter={true}
                    preGlobalFilteredRows={true}
                    SearchPlaceholder="البحث بالاسم أو الرقم المدني..."
                    onTabChange={handleTabChange}

                    // Data -------------------------
                    columns={columns}
                    data={campaignAttendeeList || []}
                    customPageSize={50}


                    // Styling -------------------------
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

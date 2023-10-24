// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { deleteCandidateElection } from "../../../store/actions";
import CandidateElectionModal from "./Modals/CandidateElectionModal";

// Utility and helper imports
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom component imports
import {
  ImageGenderCircle,
  Loader,
  DeleteModal,
  ExportCSVModal,
  TableContainer,
} from "../../../Common/Components";

// Reactstrap (UI) imports
import { Badge, Col, Container, Row, Card, CardBody } from "reactstrap";

// Additional package imports
import SimpleBar from "simplebar-react";

const CandidatesTab = () => {
  const dispatch = useDispatch();

  const { election_id, candidateElections, isCandidateElectionSuccess, isElectionSuccess, error } = useSelector((state) => ({
    election_id: state.Elections.electionDetails.id,
    candidateElections: state.Elections.candidateElections,
    isCandidateElectionSuccess: state.Elections.isCandidateElectionSuccess,
    isCandidatesSuccess: state.Candidates.isCandidatesSuccess,
    error: state.Candidates.error,
  }));

  const [candidateElection, setCandidateElection] = useState([]);
  const [candidateElectionList, setCandidateElectionList] =
    useState(candidateElections);

  useEffect(() => {
    setCandidateElectionList(candidateElections);
  }, [candidateElections]);

  // Modals: Delete, Set, Edit
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Toggle for Add / Edit Models
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCandidateElection(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteCandidateElection = () => {
    if (candidateElection) {
      dispatch(deleteCandidateElection(candidateElection.id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (candidateElection) => {
    setCandidateElection(candidateElection);
    setDeleteModal(true);
  };

  // Add Dataa
  // handleCandidateElectionClicks Function
  // const handleCandidateElectionClicks = () => {
  //   setCandidateElection(""); // Changed from empty string to null
  //   setIsEdit(false);
  //   toggle();
  // };

  // Update Data
  const handleCandidateElectionClick = useCallback(
    (arg) => {
      const candidateElection = arg;

      setCandidateElection({
        // Basic Information
        id: candidateElection.id,
        election_id: candidateElection.election_id,
        candidate_id: candidateElection.candidate_id,
        name: candidateElection.name,
        votes: candidateElection.votes,
        remarks: candidateElection.remarks,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".candidateElectionCheckBox");

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

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(deleteCandidateElection(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(".candidateElectionCheckBox:checked");
    checkedEntry.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(checkedEntry);
  };

  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="candidateElectionCheckBox form-check-input"
              value={cellProps.row.original.id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "id",
      },
      {
        Header: "Position",
        accessor: "position",
        filterable: false,
        Cell: (cellProps) => {
          return <p>{cellProps.row.original.position}</p>;
        },
      },

      {
        Header: "Candidate",
        filterable: true,
        Cell: (candidateElection) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                {candidateElection.row.original.image ? (
                  // Use the ImageCircle component here
                  <ImageGenderCircle
                    genderValue={candidateElection.row.original.gender}
                    imagePath={candidateElection.row.original.image}
                  />
                ) : (
                  <div className="flex-shrink-0 avatar-xs me-2">
                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                      {candidateElection.row.original.name.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-grow-1 ms-2 name">
                {candidateElection.row.original.name}{" "}
                {candidateElection.row.original.is_winner ? (
                  <Badge color="success" className="badge-label">
                    {" "}
                    <i className="mdi mdi-circle-medium"></i> Winner{" "}
                  </Badge>
                ) : null}
              </div>
            </div>
          </>
        ),
      },

      {
        Header: "Votes",
        accessor: "votes",
        filterable: false,
        Cell: (cellProps) => {
          return <p>{cellProps.row.original.votes}</p>;
        },
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <div className="list-inline hstack gap-2 mb-0">
              <button
                to="#"
                className="btn btn-sm btn-soft-primary edit-list"
                onClick={() => {
                  const candidateElection = cellProps.row.original;
                  setCandidateElection(candidateElection);
                }}
              >
                <i className="ri-phone-line align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-success edit-list"
                onClick={() => {
                  const candidateElection = cellProps.row.original;
                  setCandidateElection(candidateElection);
                }}
              >
                <i className="ri-question-answer-line align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                  const candidateElection = cellProps.row.original;
                  setCandidateElection(candidateElection);
                }}
              >
                <i className="ri-eye-fill align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-info edit-list"
                onClick={() => {
                  const candidateElection = cellProps.row.original;
                  handleCandidateElectionClick(candidateElection);
                }}
              >
                <i className="ri-pencil-fill align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                  const candidateElection = cellProps.row.original;
                  onClickDelete(candidateElection);
                }}
              >
                <i className="ri-delete-bin-5-fill align-bottom" />
              </button>
            </div>
          );
        },
      },
      {
        Header: "ID",
        accessor: "candidate_id",
        filterable: true,
        enableGlobalFilter: false,
        Cell: (cellProps) => {
          return <p>{cellProps.row.original.id}</p>;
        },
        // id: "candidateId", // Make sure id property is defined here
      },
    ],
    [handleCandidateElectionClick, checkedAll]
  );

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  return (
    <React.Fragment>
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={candidateElectionList}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCandidateElection}
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
      <CandidateElectionModal
        modal={modal} // boolean to control modal visibility
        setModal={setModal}
        isEdit={isEdit} // boolean to determine if editing
        toggle={toggle}
        candidateElection={candidateElection}
      />

      <Row>
        <Col>
          <div>
            <button
              className="btn btn-soft-success"
              onClick={() => setIsExportCSV(true)}
            >
              Export
            </button>
          </div>
          <Card id="candidateElectionList">
            <CardBody className="pt-0">
              <div>
                {candidateElectionList && candidateElectionList.length ? (
                  // Log the candidateElectionList array to the console
                    (
                      <TableContainer
                        // Data
                        columns={columns}
                        data2={candidateElectionList}
                        data={candidateElectionList || []}
                        customPageSize={50}

                        // Header
                        isTableContainerHeader={true}
                        ContainerHeaderTitle="Candidate Candidates"
                        AddButton="Add Candidate Candidate"
                        setDeleteModalMulti={setDeleteModalMulti}
                        setIsEdit={setIsEdit}
                        toggle={toggle}

                        // Filters
                        isGlobalFilter={true}
                        isCandidateGenderFilter={true}
                        isMultiDeleteButton={isMultiDeleteButton}
                        SearchPlaceholder="Search for Candidate Candidates..."
                        setCandidateElectionList={setCandidateElectionList}
                        // handleCandidateElectionClick={handleCandidateElectionClicks}

                        // Styling
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap mb-0"
                        theadClass="table-light table-nowrap"
                        thClass="table-light text-muted"
                      />
                    )
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

export default CandidatesTab;

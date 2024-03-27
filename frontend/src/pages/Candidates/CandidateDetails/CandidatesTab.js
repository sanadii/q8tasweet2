// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { deleteCandidate } from "../../../store/actions";
import CandidateModal from "./Modals/CandidateModal";

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
} from "../../../shared/components";

// Reactstrap (UI) imports
import { Badge, Col, Container, Row, Card, CardBody } from "reactstrap";

// Additional package imports
import SimpleBar from "simplebar-react";

const CandidatesTab = () => {
  const dispatch = useDispatch();

  const { election_id, Candidates, isCandidateSuccess, isElectionSuccess, error } = useSelector((state) => ({
    election_id: state.Elections.electionDetails.id,
    Candidates: state.Elections.Candidates,
    isCandidateSuccess: state.Elections.isCandidateSuccess,
    isCandidatesSuccess: state.Candidates.isCandidatesSuccess,
    error: state.Candidates.error,
  }));

  const [Candidate, setCandidate] = useState([]);
  const [CandidateList, setCandidateList] =
    useState(Candidates);

  useEffect(() => {
    setCandidateList(Candidates);
  }, [Candidates]);

  // Modals: Delete, Set, Edit
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Toggle for Add / Edit Models
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCandidate(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteCandidate = () => {
    if (Candidate) {
      dispatch(deleteCandidate(Candidate.id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (Candidate) => {
    setCandidate(Candidate);
    setDeleteModal(true);
  };

  // Add Dataa
  // handleCandidateClicks Function
  // const handleCandidateClicks = () => {
  //   setCandidate(""); // Changed from empty string to null
  //   setIsEdit(false);
  //   toggle();
  // };

  // Update Data
  const handleCandidateClick = useCallback(
    (arg) => {
      const Candidate = arg;

      setCandidate({
        // Basic Information
        id: Candidate.id,
        election_id: Candidate.election_id,
        candidate_id: Candidate.candidate_id,
        name: Candidate.name,
        votes: Candidate.votes,
        remarks: Candidate.remarks,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".CandidateCheckBox");

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
      dispatch(deleteCandidate(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(".CandidateCheckBox:checked");
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
              className="CandidateCheckBox form-check-input"
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
        Cell: (Candidate) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                {Candidate.row.original.image ? (
                  // Use the ImageCircle component here
                  <ImageGenderCircle
                    genderValue={Candidate.row.original.gender}
                    imagePath={Candidate.row.original.image}
                  />
                ) : (
                  <div className="flex-shrink-0 avatar-xs me-2">
                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                      {Candidate.row.original.name.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-grow-1 ms-2 name">
                {Candidate.row.original.name}{" "}
                {Candidate.row.original.isWinner ? (
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
                  const Candidate = cellProps.row.original;
                  setCandidate(Candidate);
                }}
              >
                <i className="ri-phone-line align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-success edit-list"
                onClick={() => {
                  const Candidate = cellProps.row.original;
                  setCandidate(Candidate);
                }}
              >
                <i className="ri-question-answer-line align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                  const Candidate = cellProps.row.original;
                  setCandidate(Candidate);
                }}
              >
                <i className="ri-eye-fill align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-info edit-list"
                onClick={() => {
                  const Candidate = cellProps.row.original;
                  handleCandidateClick(Candidate);
                }}
              >
                <i className="ri-pencil-fill align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                  const Candidate = cellProps.row.original;
                  onClickDelete(Candidate);
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
    [handleCandidateClick, checkedAll]
  );

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  return (
    <React.Fragment>
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={CandidateList}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCandidate}
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
      <CandidateModal
        modal={modal} // boolean to control modal visibility
        setModal={setModal}
        isEdit={isEdit} // boolean to determine if editing
        toggle={toggle}
        Candidate={Candidate}
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
          <Card id="CandidateList">
            <CardBody className="pt-0">
              <div>
                {CandidateList && CandidateList.length ? (
                  // Log the CandidateList array to the console
                    (
                      <TableContainer
                        // Data
                        columns={columns}
                        data2={CandidateList}
                        data={CandidateList || []}
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
                        setCandidateList={setCandidateList}
                        // handleCandidateClick={handleCandidateClicks}

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

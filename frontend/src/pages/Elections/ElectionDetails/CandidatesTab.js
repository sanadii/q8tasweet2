// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Store & Selectors
import { deleteElectionCandidate } from "../../../store/actions";
import { electionSelector } from 'Selectors';

// Components
import ElectionCandidateModal from "./Modals/ElectionCandidateModal";

// Common Components
import { ImageCandidateWinnerCircle, Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "../../../Components/Common";

// UI & Utilities
import { Badge, Col, Container, Row, Card, CardBody } from "reactstrap";
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleBar from "simplebar-react";


const CandidatesTab = () => {
  const dispatch = useDispatch();

  const {
    electionDetails,
    electionCandidates,
    isElectionCandidateSuccess,
    isElectionSuccess,
    error
  } = useSelector(electionSelector);

  // const election_id = electionDetails.id;

  // Constants
  const [electionCandidate, setElectionCandidate] = useState([]);
  const [electionCandidateList, setElectionCandidateList] = useState(electionCandidates);

  useEffect(() => {
    setElectionCandidateList(electionCandidates);
  }, [electionCandidates]);

  // Models
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Toggle for Add / Edit Models
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElectionCandidate(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Modals: Delete, Set, Edit
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  // Delete Data
  const handleDeleteElectionCandidate = () => {
    if (electionCandidate) {
      dispatch(deleteElectionCandidate(electionCandidate.id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (electionCandidate) => {
    setElectionCandidate(electionCandidate);
    setDeleteModal(true);
  };

  // Add Dataa
  // handleElectionCandidateClicks Function
  // const handleElectionCandidateClicks = () => {
  //   setElectionCandidate(""); // Changed from empty string to null
  //   setIsEdit(false);
  //   toggle();
  // };

  // Update Data
  const handleElectionCandidateClick = useCallback(
    (arg) => {
      const electionCandidate = arg;

      setElectionCandidate({
        id: electionCandidate.id,
        election: electionCandidate.election,
        candidate: electionCandidate.candidate,
        name: electionCandidate.name,
        votes: electionCandidate.votes,
        notes: electionCandidate.notes,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".electionCandidateCheckBox");

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
      dispatch(deleteElectionCandidate(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(".electionCandidateCheckBox:checked");
    checkedEntry.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(checkedEntry);
  };

  const handleElectionCandidateClicks = () => {
    setElectionCandidate("");
    setIsEdit(false);
    toggle();
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
              className="electionCandidateCheckBox form-check-input"
              value={cellProps.row.original.id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "id",
      },
      {
        Header: "المركز",
        accessor: "position",
        filterable: false,
        Cell: (cellProps) => {
          return <p>{cellProps.row.original.position}</p>;
        },
      },
      {
        Header: "المرشح",
        filterable: true,
        Cell: (electionCandidate) => (
          <ImageCandidateWinnerCircle
            gender={electionCandidate.row.original.gender}
            name={electionCandidate.row.original.name}
            imagePath={electionCandidate.row.original.image}
            is_winner={electionCandidate.row.original.is_winner}
          />
        ),
      },
      {
        Header: "الأصوات",
        accessor: "votes",
        filterable: false,
        Cell: (cellProps) => {
          return <p>{cellProps.row.original.votes}</p>;
        },
      },
      {
        Header: "إجراءات",
        Cell: (cellProps) => {
          return (
            <div className="list-inline hstack gap-2 mb-0">
              <button
                to="#"
                className="btn btn-sm btn-soft-primary edit-list"
                onClick={() => {
                  const electionCandidate = cellProps.row.original;
                  setElectionCandidate(electionCandidate);
                }}
              >
                <i className="ri-phone-line align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-success edit-list"
                onClick={() => {
                  const electionCandidate = cellProps.row.original;
                  setElectionCandidate(electionCandidate);
                }}
              >
                <i className="ri-question-answer-line align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                  const electionCandidate = cellProps.row.original;
                  setElectionCandidate(electionCandidate);
                }}
              >
                <i className="ri-eye-fill align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-info edit-list"
                onClick={() => {
                  const electionCandidate = cellProps.row.original;
                  handleElectionCandidateClick(electionCandidate);
                }}
              >
                <i className="ri-pencil-fill align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                  const electionCandidate = cellProps.row.original;
                  onClickDelete(electionCandidate);
                }}
              >
                <i className="ri-delete-bin-5-fill align-bottom" />
              </button>
            </div>
          );
        },
      },
      {
        Header: "رمز",
        accessor: "candidate_id",
        filterable: true,
        enableGlobalFilter: false,
        Cell: (cellProps) => {
          return <p>{cellProps.row.original.id}</p>;
        },
        // id: "candidateId", // Make sure id property is defined here
      },
    ],
    [handleElectionCandidateClick, checkedAll]
  );

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  return (
    <React.Fragment>
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={electionCandidateList}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteElectionCandidate}
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
      <ElectionCandidateModal
        modal={modal} // boolean to control modal visibility
        setModal={setModal}
        isEdit={isEdit} // boolean to determine if editing
        toggle={toggle}
        electionCandidate={electionCandidate}
      />

      <Row>
        <Col lg={12}>
          {/* <div>
            <button
              className="btn btn-soft-success"
              onClick={() => setIsExportCSV(true)}
            >
              Export
            </button>
          </div> */}
          <Card id="electionCandidateList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // Title
                  ContainerHeaderTitle="المرشحين"

                  // Add Elector Button
                  isContainerAddButton={true}
                  AddButtonText="إضافة مرشح"
                  isEdit={isEdit}
                  handleEntryClick={handleElectionCandidateClicks}
                  toggle={toggle}

                  // Delete Button
                  isMultiDeleteButton={isMultiDeleteButton}
                  setDeleteModalMulti={setDeleteModalMulti}
                />

                {electionCandidateList && electionCandidateList.length ? (
                  <TableContainer
                    // Data
                    columns={columns}
                    data={electionCandidateList || []}
                    customPageSize={50}

                    // Header
                    setIsEdit={setIsEdit}
                    toggle={toggle}

                    // Filters
                    isGlobalFilter={true}
                    isCandidateGenderFilter={true}
                    isMultiDeleteButton={isMultiDeleteButton}
                    SearchPlaceholder="البحث...."
                    setElectionCandidateList={setElectionCandidateList}
                    // handleElectionCandidateClick={handleElectionCandidateClicks}

                    // Styling
                    divClass="table-responsive table-card mb-3"
                    tableClass="align-middle table-nowrap mb-0"
                    theadClass="table-light table-nowrap"
                    thClass="table-light text-muted"
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

export default CandidatesTab;

// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { electionSelector } from 'Selectors';

import { deleteElectionCommittee } from "../../../store/actions";
import ElectionCommitteeModal from "./Modals/ElectionCommitteeModal";

// Utility and helper imports
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom component imports
import { ImageGenderCircle, Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "../../../Components/Common";

// Reactstrap (UI) imports
import { Badge, Col, Container, Row, Card, CardBody } from "reactstrap";

// Additional package imports
import SimpleBar from "simplebar-react";

const CommitteesTab = () => {
  const dispatch = useDispatch();

  const { electionDetails, electionCommittees, error } = useSelector(electionSelector);
  const election_id = electionDetails.id;

  const [electionCommittee, setElectionCommittee] = useState([]);

  // Modals: Delete, Set, Edit
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Toggle for Add / Edit Models
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElectionCommittee(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteElectionCommittee = () => {
    if (electionCommittee) {
      dispatch(deleteElectionCommittee(electionCommittee.id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (electionCommittee) => {
    setElectionCommittee(electionCommittee);
    setDeleteModal(true);
  };

  // Add Dataa
  // handleElectionCommitteeClicks Function
  // const handleElectionCommitteeClicks = () => {
  //   setElectionCommittee(""); // Changed from empty string to null
  //   setIsEdit(false);
  //   toggle();
  // };

  // Update Data
  const handleElectionCommitteeClick = useCallback(
    (arg) => {
      const electionCommittee = arg;

      setElectionCommittee({
        // Basic Information
        id: electionCommittee.id,
        election_id: electionCommittee.election_id,
        candidate_id: electionCommittee.candidate_id,
        name: electionCommittee.name,
        gender: electionCommittee.gender,
        votes: electionCommittee.votes,
        remarks: electionCommittee.remarks,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".electionCommitteeCheckBox");

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
      dispatch(deleteElectionCommittee(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(".electionCommitteeCheckBox:checked");
    checkedEntry.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(checkedEntry);
  };

  const handleElectionCommitteeClicks = () => {
    setElectionCommittee("");
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
              className="electionCommitteeCheckBox form-check-input"
              value={cellProps.row.original.id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        Header: "اللجنة",
        filterable: true,
        Cell: (electionCommittee) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1 ms-2 name">
                <strong>
                  {electionCommittee.row.original.name}
                </strong>
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "النوع",
        filterable: true,
        Cell: (electionCommittee) => (
          <>
            {electionCommittee.row.original.gender}
          </>
        ),
      },
      {
        Header: "إجراءات",
        Cell: (cellProps) => {
          return (
            <div className="list-inline hstack gap-2 mb-0">
              <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                  const electionCommittee = cellProps.row.original;
                  setElectionCommittee(electionCommittee);
                }}
              >
                <i className="ri-eye-fill align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-info edit-list"
                onClick={() => {
                  const electionCommittee = cellProps.row.original;
                  handleElectionCommitteeClick(electionCommittee);
                }}
              >
                <i className="ri-pencil-fill align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                  const electionCommittee = cellProps.row.original;
                  onClickDelete(electionCommittee);
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
    [handleElectionCommitteeClick, checkedAll]
  );

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);


  // Filters----------
  const [filters, setFilters] = useState({
    global: "",
    gender: null,
  });

  const electionCommitteeList = electionCommittees.filter(electionCommittee => {
    let isValid = true;
    if (filters.global) {
      isValid = isValid && electionCommittee.name && typeof electionCommittee.name === 'string' && electionCommittee.name.toLowerCase().includes(filters.global.toLowerCase());
    }

    if (filters.gender !== null) {
      isValid = isValid && electionCommittee.gender === filters.gender;
    }
    return isValid;
  });



  return (
    <React.Fragment>
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={electionCommitteeList}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteElectionCommittee}
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
      <ElectionCommitteeModal
        modal={modal}
        setModal={setModal}
        isEdit={isEdit}
        toggle={toggle}
        electionCommittee={electionCommittee}
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
          <Card id="electionCommitteeList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // Title
                  ContainerHeaderTitle="لجان الإنتخابات"

                  // Add Elector Button
                  isContainerAddButton={true}
                  AddButtonText="إضافة لجنة"
                  isEdit={isEdit}
                  handleEntryClick={handleElectionCommitteeClicks}
                  setIsEdit={setIsEdit}
                  toggle={toggle}

                  // Delete Button
                  isMultiDeleteButton={isMultiDeleteButton}
                  setDeleteModalMulti={setDeleteModalMulti}
                />

                <TableContainer
                  // Data
                  columns={columns}
                  data={electionCommitteeList || []}
                  customPageSize={50}

                  // Filters
                  isTableContainerFilter={true}
                  isGlobalFilter={true}
                  preGlobalFilteredRows={true}
                  isGenderFilter={true}

                  // Settings
                  filters={filters}
                  setFilters={setFilters}

                  SearchPlaceholder="البحث..."
                  // handleElectionCommitteeClick={handleElectionCommitteeClicks}

                  // Styling
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light table-nowrap"
                  thClass="table-light text-muted"
                />

              </div>
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CommitteesTab;

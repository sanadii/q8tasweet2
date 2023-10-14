// ------------ React & Redux ------------
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Row, Card, CardBody } from "reactstrap";

// ------------ Actions ------------
import { getCandidates, deleteCandidate, getModeratorUsers } from "../../../store/actions";

// ------------ Custom Components & ConstantsImports ------------
import { AvatarMedium, Loader, DeleteModal, TableContainer, TableContainerHeader } from "../../../Components/Common";
import CandidateModal from "./CandidateModal"
import { Id, Name, Status, Priority, CreateBy, Moderators, Actions } from "./CandidateListCol";

// ------------ Toast & Styles ------------
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ------------ React FilePond & Styles ------------
import { registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AllCandidates = () => {
  const dispatch = useDispatch();

  // ------------ State Management ------------
  const { candidates, moderators, isCandidateSuccess, error } = useSelector((state) => ({
    candidates: state.Candidates.candidates,
    moderators: state.Users.moderators,
    isCandidateSuccess: state.Candidates.isCandidateSuccess,
    error: state.Candidates.error,
  }));

  const [candidate, setCandidate] = useState([]);
  const [candidateElections, setCandidateElections] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // Candidate Data
  useEffect(() => {
    if (candidates && !candidates.length) {
      dispatch(getCandidates());
    }
  }, [dispatch, candidates]);

  // Moderators
  useEffect(() => {
    if (moderators && !moderators.length) {
      dispatch(getModeratorUsers());
    }
  }, [dispatch, moderators]);

  const [moderatorsMap, setModeratorsMap] = useState({});

  useEffect(() => {
    Promise.resolve(moderators).then((moderatorsList) => {
      const map = moderatorsList.reduce((acc, moderator) => {
        acc[moderator.id] = moderator;
        return acc;
      }, {});

      setModeratorsMap(map);
    });
  }, [moderators]);


  // Delete Candidate
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCandidate(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);

  // Delete Data
  const onClickDelete = (candidate) => {
    setCandidate(candidate);
    setDeleteModal(true);
  };

  // Delete Data
  const handleDeleteCandidate = () => {
    if (candidate) {
      dispatch(deleteCandidate(candidate.id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCandidateClick = useCallback(
    (arg) => {
      const candidate = arg;

      setCandidate({
        id: candidate.id,
        name: candidate.name,
        image:
          candidate && candidate.image
            ? process.env.REACT_APP_API_URL + candidate.image
            : "",

        candidateCount: candidate.candidateCount,
        description: candidate.description,

        // Admin
        status: candidate.status,
        priority: candidate.priority,
        moderators: candidate.moderators,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Add Data
  const handleCandidateClicks = () => {
    setCandidate("");
    setIsEdit(false);
    toggle();
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".candidateCheckBox");

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
    const checkedEntry = document.querySelectorAll(".candidateCheckBox:checked");
    checkedEntry.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(checkedEntry);
  };

  // Add Data
  const handleElectionClicks = () => {
    setCandidate("");
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
              className="candidateCheckBox form-check-input"
              value={cellProps.row.original.id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        Header: "ID",
        accessor: "id",
        filterable: false,
        Cell: (cellProps) => {
          return <Id {...cellProps} />;
        },
      },

      {
        name: "Image",
        title: "Image",
        accessor: "image",
        Cell: (cellProps) => (
          <AvatarMedium imagePath={cellProps.row.original.image} />
        ),
      },

      {
        Header: "Candidates",
        accessor: "name",
        filterable: false,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        filterable: true,
        // useFilters: true,

        Cell: (cellProps) => {
          return <Status status={cellProps.row.original.status} />;
        },
      },
      {
        Header: "Priority",
        accessor: "priority",
        filterable: true,
        Cell: (cellProps) => {
          return <Priority {...cellProps} />;
        },
      },
      {
        Header: "Moderators",
        accessor: "moderators",
        filterable: false,
        Cell: (cell) => {
          return <Moderators {...cell} />;
        },
      },
      {
        Header: "Created By",
        accessor: "createdBy",
        filterable: false,
        useFilters: true,

        Cell: (cellProps) => {
          return <CreateBy {...cellProps} />;
        },
      },
      {
        Header: "Actions",
        accessor: "candidate",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <Actions
              {...cellProps}
              handleCandidateClick={handleCandidateClick}
              onClickDelete={onClickDelete}
            />
          );
        },
      },
    ],
    [handleCandidateClick, checkedAll]
  );

  // Dates
  const defaultdate = () => {
    let d = new Date();
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const [dueDate, setDate] = useState(defaultdate());


  // Filters----------
  const [filters, setFilters] = useState({
    global: "",
    gender: null,
    status: null,
    priority: null,
  });

  const candidateList = candidates.filter(candidate => {
    let isValid = true;

    if (filters.global) {
      isValid = isValid && candidate.name && typeof candidate.name === 'string' && candidate.name.toLowerCase().includes(filters.global.toLowerCase());

    }

    if (filters.gender !== null) {
      isValid = isValid && candidate.gender === filters.gender;
    }

    if (filters.status !== null) {
      isValid = isValid && candidate.status === filters.status;
    }

    if (filters.priority !== null) {
      isValid = isValid && candidate.priority === filters.priority;
    }

    return isValid;
  });


  return (
    <React.Fragment>
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
        modal={modal}
        toggle={toggle}
        candidate={candidate}
        isEdit={isEdit}
        setModal={setModal}
      />
      <Row>
        <Col lg={12}>
          <Card id="memberList">
            <CardBody>
              <TableContainerHeader
                // Title
                ContainerHeaderTitle="Candidates"

                // Add Elector Button
                isContainerAddButton={true}
                AddButtonText="Add New Candidate"
                isEdit={isEdit}
                handleEntryClick={handleElectionClicks}
                toggle={toggle}

                // Delete Button
                isMultiDeleteButton={isMultiDeleteButton}
                setDeleteModalMulti={setDeleteModalMulti}
              />

              {isCandidateSuccess && candidates.length ? (
                <TableContainer
                  // Header
                  isTableContainerHeader={true}
                  setDeleteModalMulti={setDeleteModalMulti}
                  setIsEdit={setIsEdit}
                  toggle={toggle}
                  isMultiDeleteButton={isMultiDeleteButton}

                  isContainerAddButton={true}
                  AddButtonText="Add New Candidate"
                  isEdit={isEdit}

                  // Filters----------
                  isTableContainerFilter={true}
                  isGlobalFilter={true}
                  preGlobalFilteredRows={true}
                  isGenderFilter={true}
                  isStatusFilter={true}
                  isPriorityFilter={true}
                  isResetFilters={true}

                  // FilterSettings
                  filters={filters}
                  setFilters={setFilters}
                  SearchPlaceholder="Search for elections or something..."

                  // Table
                  columns={columns}
                  data={candidateList || []}


                  // useFilters={true}
                  customPageSize={20}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light table-nowrap"
                  thClass="table-light text-muted"
                  handleEntryClick={handleCandidateClicks}
                />
              ) : (
                <Loader error={error} />
              )}
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AllCandidates;

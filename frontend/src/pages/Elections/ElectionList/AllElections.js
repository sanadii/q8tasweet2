// ------------ React & Redux ------------
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Row, Card, CardBody } from "reactstrap";

// ------------ Actions ------------
import { getElections, addElection, updateElection, deleteElection, getModeratorUsers, getCategories } from "../../../store/actions";

// ------------ Custom Components & ConstantsImports ------------
import { ImageLargeCircle, Loader, DeleteModal, TableContainer, TableContainerHeader } from "../../../Components/Common";
import ElectionModal from "./ElectionModal"
import { Id, Name, CandidateCount, DueDate, Status, Priority, Category, CreateBy, Moderators, Actions } from "./ElectionListCol";

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

const AllElections = () => {
  const dispatch = useDispatch();

  // ------------ State Management ------------
  const { elections, moderators, categories, subCategories, isElectionSuccess, user, error } = useSelector((state) => ({
    elections: state.Elections.elections,
    moderators: state.Users.moderators,
    categories: state.Categories.categories,
    subCategories: state.Categories.subCategories,
    isElectionSuccess: state.Elections.isElectionSuccess,
    user: state.Profile.user,
    error: state.Elections.error,
  }));

  const [election, setElection] = useState([]);
  const [category, setCategory] = useState([]);
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [userName, setUserName] = useState("Admin");
  const [userId, setUserId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Election Data
  useEffect(() => {
    if (elections && !elections.length) {
      dispatch(getElections());
    }
  }, [dispatch, elections]);

  // Election Categories
  useEffect(() => {
    if (categories && !categories.length) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);

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


  // Delete Election
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElection(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);

  // Delete Data
  const onClickDelete = (election) => {
    setElection(election);
    setDeleteModal(true);
  };

  // Delete Data
  const handleDeleteElection = () => {
    if (election) {
      dispatch(deleteElection(election.id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleElectionClick = useCallback(
    (arg) => {
      const election = arg;

      setElection({
        id: election.id,
        name: election.name,
        image:
          election && election.image
            ? process.env.REACT_APP_API_URL + election.image
            : "",

        dueDate: election.dueDate,
        candidateCount: election.candidateCount,
        description: election.description,

        // Taxonomies
        category: election.category,
        subCategory: election.subCategory,
        tags: election.tags,

        // Election Spesifications
        type: election.type,
        result: election.result,
        votes: election.votes,
        seats: election.seats,
        electors: election.electors,
        attendees: election.attendees,

        // Admin
        status: election.status,
        priority: election.priority,
        moderators: election.moderators,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Add Data
  const handleElectionClicks = () => {
    setElection("");
    setIsEdit(false);
    toggle();
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".electionCheckBox");

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
      dispatch(deleteElection(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(".electionCheckBox:checked");
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
              className="electionCheckBox form-check-input"
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
          <ImageLargeCircle imagePath={cellProps.row.original.image} />
        ), // Use the CircleImage component
      },

      {
        Header: "Elections",
        accessor: "name",
        filterable: false,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Candidates",
        accessor: "candidateCount",
        filterable: false,
        Cell: (cellProps) => {
          return <CandidateCount {...cellProps} />;
        },
      },

      {
        Header: "Due Date",
        accessor: "dueDate",
        filterable: false,
        Cell: (cellProps) => {
          return <DueDate {...cellProps} />;
        },
      },
      {
        Header: "Category",
        accessor: "category",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <Category
              category={cellProps.row.original.category}
              subCategory={cellProps.row.original.subCategory}
            />
          );
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
        accessor: "election",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <Actions
              {...cellProps}
              handleElectionClick={handleElectionClick}
              onClickDelete={onClickDelete}
            />
          );
        },
      },
    ],
    [handleElectionClick, checkedAll]
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


  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    category: null, // Newly added
  });


  const electionList = elections.filter(election => {
    let isValid = true;

    if (filters.status !== null) {
      isValid = isValid && election.status === filters.status;
    }

    if (filters.priority !== null) {
      isValid = isValid && election.priority === filters.priority;
    }

    if (filters.category !== null) {
      isValid = isValid && election.category === filters.category;
    }

    return isValid;
  });

  // ... add other filter checks similarly ...
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteElection}
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
      <ElectionModal
        modal={modal}
        toggle={toggle}
        election={election}
        isEdit={isEdit}
        setModal={setModal}
      />
      <Row>
        <Col lg={12}>
          <Card id="memberList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // Title
                  ContainerHeaderTitle="Election Guarantees"

                  // Add Elector Button
                  isContainerAddButton={true}
                  AddButtonText="Add New Election"
                  isEdit={isEdit}
                  handleEntryClick={handleElectionClicks}
                  toggle={toggle}

                  // Delete Button
                  isMultiDeleteButton={isMultiDeleteButton}
                  setDeleteModalMulti={setDeleteModalMulti}
                />
                {isElectionSuccess && elections.length ? (
                  <TableContainer
                    filters={filters}
                    setFilters={setFilters}

                    // Header
                    ContainerHeaderTitle="Election Guarantees"


                    // Filters -------------------------
                    isTableContainerFilter={true}
                    isSearchFilter={true}
                    searchField="name"
                    isGlobalFilter={true}
                    preGlobalFilteredRows={true}
                    isElectionCategoryFilter={true}
                    isStatusFilter={true}
                    isPriorityFilter={true}
                    isResetFilters={true}

                    // isGlobalSearch={true}
                    // isElectionListFilter={true}
                    // isCustomerFilter={isCustomerFilter}
                    // FieldFiters
                    // isTestFilter={true}

                    // Data -------------------------
                    columns={columns}
                    data={electionList || []}
                    customPageSize={20}

                    // isStatusFilter={true}
                    // isGlobalPagination={true}
                    // isColumnFilter={true} // Change the prop name
                    // isElectionSelectionFilter={true}
                    // isSelectionFilter={true}

                    SearchPlaceholder="Search for elections or something..."
                    // useFilters={true}

                    // Styling -------------------------
                    className="custom-header-css"
                    divClass="table-responsive table-card mb-2"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light"
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

export default AllElections;

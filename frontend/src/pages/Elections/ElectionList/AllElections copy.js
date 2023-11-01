// React & Redux core
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { electionSelector, categorySelector, userSelector } from 'Selectors';
import { getElections, deleteElection, getModeratorUsers, getCategories } from "../../../store/actions";

// Components & Columns
import ElectionModal from "./ElectionModal";
import { AvatarList, Loader, DeleteModal, TableContainer, TableContainerHeader } from "../../../Common/Components";
import { Id, DueDate, Status, Priority, Category, CreateBy, Moderators, Actions } from "./ElectionListCol";

// UI, Styles & Notifications
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AllElections = () => {
  const dispatch = useDispatch();

  // State Management
  const { elections, isElectionSuccess, error } = useSelector(electionSelector);
  const { categories, subCategories } = useSelector(electionSelector);
  const { moderators } = useSelector(categorySelector);
  const [election, setElection] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Election Data
  useEffect(() => {
    if (!elections || !elections.length) {
      dispatch(getElections());
    }
  }, [dispatch, elections]);

  // Election Categories
  useEffect(() => {
    if (!categories || !categories.length) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);




  // Delete Election ------------
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

  // Delete Data ------------
  const onClickDelete = (election) => {
    setElection(election);
    setDeleteModal(true);
  };

  // Delete Data ------------
  const handleDeleteElection = () => {
    if (election) {
      dispatch(deleteElection(election.id));
      setDeleteModal(false);
    }
  };

  // Update Data ------------
  const handleElectionClick = useCallback(
    (arg) => {
      const election = arg;

      setElection({
        id: election.id,
        dueDate: election.dueDate,
        candidateCount: election.candidateCount,

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

        // Task
        status: election.status,
        priority: election.priority,
        moderators: election.moderators,
      });
      console.log("election:", election)

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
        Header: "م.",
        accessor: "id",
        filterable: false,
        Cell: (cellProps) => {
          return <Id {...cellProps} />;
        },
      },
      {
        name: "الإنتخابات",
        title: "name",
        accessor: "name",
        Cell: (cellProps) => cellProps.row ? <AvatarList row={cellProps.row} /> : null,

      },
      {
        Header: "الموعد",
        accessor: "dueDate",
        filterable: false,
        Cell: (cellProps) => {
          return <DueDate {...cellProps} />;
        },
      },
      {
        Header: "المجموعة",
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
        Header: "الحالة",
        accessor: "status",
        filterable: true,
        // useFilters: true,

        Cell: (cellProps) => {
          return <Status status={cellProps.row.original.status} />;
        },
      },
      {
        Header: "الأولية",
        accessor: "priority",
        filterable: true,
        Cell: (cellProps) => {
          return <Priority {...cellProps} />;
        },
      },
      {
        Header: "المشرفون",
        accessor: "moderators",
        filterable: false,
        Cell: (cell) => {
          return <Moderators {...cell} />;
        },
      },
      {
        Header: "بواسطة",
        accessor: "createdBy",
        filterable: false,
        useFilters: true,

        Cell: (cellProps) => {
          return <CreateBy {...cellProps} />;
        },
      },
      {
        Header: "إجراءات",
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

  // Filters----------
  const [filters, setFilters] = useState({
    global: "",
    status: null,
    priority: null,
    category: null, // Newly added
  });

  const electionList = elections.filter(election => {
    let isValid = true;

    if (filters.category !== null) {
      isValid = isValid && election.category === filters.category;
    }

    if (filters.global) {
      isValid = isValid && election.name && typeof election.name === 'string' && election.name.toLowerCase().includes(filters.global.toLowerCase());
    }

    if (filters.status !== null) {
      isValid = isValid && election.status === filters.status;
    }

    if (filters.priority !== null) {
      isValid = isValid && election.priority === filters.priority;
    }

    return isValid;
  });


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
          <Card id="electionList">
            <CardBody>
              <TableContainerHeader
                // Title
                ContainerHeaderTitle="الإنتخابات"

                // Add Elector Button
                isContainerAddButton={true}
                AddButtonText="إضافة إنتخابات"
                isEdit={isEdit}
                handleEntryClick={handleElectionClicks}
                toggle={toggle}

                // Delete Button
                isMultiDeleteButton={isMultiDeleteButton}
                setDeleteModalMulti={setDeleteModalMulti}
              />
              {isElectionSuccess && elections.length ? (
                <TableContainer

                  // Filters----------
                  isTableContainerFilter={true}
                  isGlobalFilter={true}
                  preGlobalFilteredRows={true}
                  isElectionCategoryFilter={true}
                  isStatusFilter={true}
                  isPriorityFilter={true}
                  isResetFilters={true}

                  // Filter Settings
                  filters={filters}
                  setFilters={setFilters}
                  SearchPlaceholder="البحث بالاسم..."

                  // Data----------
                  columns={columns}
                  data={electionList || []}
                  customPageSize={20}

                  // Styling----------
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-2"
                  tableClass="align-middle table-nowrap"
                  theadClass="table-light"
                  thClass="table-light text-muted"


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

export default AllElections;

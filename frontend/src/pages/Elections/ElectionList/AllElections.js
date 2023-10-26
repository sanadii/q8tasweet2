// React & Redux core
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { electionSelector, categorySelector, userSelector } from 'Selectors';
import { getElections, deleteElection, getCategories } from "store/actions";

// Components & Columns
import ElectionModal from "./ElectionModal";
import { Loader, DeleteModal, TableContainer, TableContainerHeader } from "Common/Components";
import { Id, CheckboxHeader, CheckboxCell, Name, DueDate, Status, Priority, Category, CreateBy, Actions } from "./ElectionListCol";

// Hooks
import { useDelete, useFetchDataIfNeeded } from "Common/Hooks"

// UI, Styles & Notifications
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AllElections = () => {
  const dispatch = useDispatch();

  // State Management
  const { elections, isElectionSuccess, error } = useSelector(electionSelector);
  const { categories } = useSelector(categorySelector);

  // Delete Hook
  const {
    handleDeleteItem,
    onClickDelete,
    deleteModal,
    setDeleteModal,
    checkedAll,
    deleteCheckbox,
    isMultiDeleteButton,
    deleteModalMulti,
    setDeleteModalMulti,
    handleDeleteMultiple,
  } = useDelete(deleteElection);

  // Fetch Data If Needed Hook
  useFetchDataIfNeeded(elections, getElections);
  useFetchDataIfNeeded(categories, getCategories);

  // Dates
  const defaultdate = () => {
    let d = new Date();
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const [dueDate, setDate] = useState(defaultdate());

  // Model & Toggle Function
  const [election, setElection] = useState(null);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  console.log("election?", election)

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElection(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);


  // Update Data
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
        electType: election.electType,
        electResult: election.electResult,
        electVotes: election.electVotes,
        electSeats: election.seats,
        electors: election.electors,
        attendees: election.attendees,

        // Task
        status: election.task.status,
        priority: election.task.priority,
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


  // Table Columns
  const columns = useMemo(
    () => [
      {
        Header: () => <CheckboxHeader checkedAll={checkedAll} />,
        accessor: "id",
        Cell: (cellProps) => <CheckboxCell {...cellProps} deleteCheckbox={deleteCheckbox} />,
      },
      {
        Header: "م.",
        Cell: (cellProps) => <Id {...cellProps} />
      },
      {
        Header: "الإنتخابات",
        accessor: "name",
        Cell: (cellProps) => <Name {...cellProps} />

      },
      {
        Header: "الموعد",
        accessor: "dueDate",
        Cell: (cellProps) => <DueDate {...cellProps} />
      },
      {
        Header: "المجموعة",
        accessor: "category",
        Cell: (cellProps) =>
          <Category
            category={cellProps.row.original.category}
            subCategory={cellProps.row.original.subCategory}
          />
      },
      {
        Header: "الحالة",
        accessor: "status",
        Cell: (cellProps) => <Status status={cellProps.row.original.task.status} />
      },
      {
        Header: "الأولية",
        accessor: "priority",
        Cell: (cellProps) => <Priority {...cellProps} />
      },
      {
        Header: "بواسطة",
        accessor: "createdBy",
        Cell: (cellProps) => <CreateBy {...cellProps} />
      },
      {
        Header: "إجراءات",
        accessor: "election",
        Cell: (cellProps) =>
          <Actions
            {...cellProps}
            handleElectionClick={handleElectionClick}
            onClickDelete={onClickDelete}
          />
      },
    ],
    [handleElectionClick, checkedAll]
  );

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
        onDeleteClick={handleDeleteItem}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          handleDeleteMultiple();
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

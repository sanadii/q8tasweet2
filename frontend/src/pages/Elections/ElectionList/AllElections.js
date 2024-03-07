// React & Redux core
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { electionSelector, categorySelector } from 'Selectors';
import { getElections, deleteElection, getCategories } from "store/actions";

// Components & Columns
import ElectionModal from "./ElectionModal";
import { Id, CheckboxHeader, CheckboxCell, Name, DueDate, Status, Priority, Category, CreateBy, Actions } from "./ElectionListCol";
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader } from "shared/components";
import { useDelete, useFilter, useFetchDataIfNeeded } from "shared/hooks"

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
    deleteMultiple,
  } = useDelete(deleteElection);
  console.log("checkedAll: ", checkedAll)

  // Fetch Data If Needed Hook
      // Election Data
      useEffect(() => {
        if (!isElectionSuccess) {
          dispatch(getElections('admin'));
        }
    }, [dispatch, isElectionSuccess]);


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
  const [activeTab, setActiveTab] = useState("0"); // Initialize with "campaignManagers"
  const activeRole = activeTab;

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
        electionMethod: election.electionMethod,
        electionResult: election.electionResult,
        electVotes: election.electVotes,
        electSeats: election.seats,
        electors: election.electors,
        attendees: election.attendees,

        // Task
        status: election.status,
        priority: election.priority,
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
        Cell: (cellProps) => <Status {...cellProps} />
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

  // Filters
  const { filteredData: electionList, filters, setFilters } = useFilter(elections);

  console.log("filters: ", filters);
  console.log("filters: electionList: ", electionList);
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

                // Add Button
                isContainerAddButton={true}
                AddButtonText="إضافة إنتخابات"
                isEdit={isEdit}
                handleEntryClick={handleElectionClicks}
                toggle={toggle}

                // Delete Button
                isMultiDeleteButton={isMultiDeleteButton}
                setDeleteModalMulti={setDeleteModalMulti}
              />

              <TableFilters
                // Filters
                isGlobalFilter={true}
                preGlobalFilteredRows={true}
                isElectionCategoryFilter={true}
                isStatusFilter={true}
                isPriorityFilter={true}
                isResetFilters={true}

                // Settings
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                filters={filters}
                setFilters={setFilters}
                SearchPlaceholder="البحث بالاسم..."
              />
              
              {isElectionSuccess && elections.length ? (
                <TableContainer
                  // Data
                  columns={columns}
                  data={electionList || []}
                  customPageSize={20}
                  sortBy="dueDate"
                  sortDesc={true}

                  // Styling
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

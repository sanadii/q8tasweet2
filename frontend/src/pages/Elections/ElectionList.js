// React & Redux core
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { electionSelector, categorySelector } from 'selectors';
import { getElections, deleteElection, getCategories } from "store/actions";

// Components & Columns
import ElectionModal from "./ElectionModal";
import { Id, CheckboxHeader, CheckboxCell, Name, DueDate, Status, Priority, Category, CreateBy, Actions } from "./ElectionListCol";
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader } from "shared/components";
import { useDelete, useFilter } from "shared/hooks"
import { defaultDate } from "shared/utils"

// UI, Styles & Notifications
import { Col, Row, Card, CardHeader, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ElectionList = () => {
  const dispatch = useDispatch();

  // State Management
  const { elections, isElectionSuccess, error } = useSelector(electionSelector);
  const [dueDate, setDate] = useState(defaultDate());

  // Model & Toggle Function
  const [election, setElection] = useState(null);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("0"); // Initialize with "campaignManagers"
  const activeRole = activeTab;

  // Delete Hook
  const {
    // Delete Modal
    handleDeleteItem,
    deleteModal,
    setDeleteModal,
    deleteModalMulti,
    handleDeleteMultiple,

    // Table Header
    isMultiDeleteButton,
    setDeleteModalMulti,

    // Column Actions
    handleItemDeleteClick,
    handleCheckAllClick,
    handleCheckCellClick,
  } = useDelete(deleteElection);


  // Election Data
  useEffect(() => {
    if (elections && elections.length === 0) {
      dispatch(getElections('admin'));
      dispatch(getCategories());
    }
  }, [dispatch, elections]);


  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElection(null);
    } else {
      setModal(true);
      setDate(defaultDate());
    }
  }, [modal]);

  const handleElectionClick = useCallback(
    (electionData) => {
      setElection(electionData);
      setIsEdit(true);
      toggle();
    }, [toggle]);

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
        Header: () => <CheckboxHeader handleCheckAllClick={handleCheckAllClick} />,
        accessor: "id",
        Cell: (cellProps) => <CheckboxCell {...cellProps} handleCheckCellClick={handleCheckCellClick} />,
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
            handleItemDeleteClick={handleItemDeleteClick}
          />
      },
    ],
    [handleCheckCellClick, handleCheckAllClick, handleElectionClick, handleItemDeleteClick]
  );

  // Filters
  const { filteredData: electionList, filters, setFilters } = useFilter(elections);

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteItem()}
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

            <CardBody>

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

export default ElectionList;

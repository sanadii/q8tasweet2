// React & Redux
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { getCandidates, deleteCandidate } from "store/actions";
import { candidateSelector } from 'selectors';

// Custom Components, Constants & Hooks Imports
import CandidateModal from "./CandidateModal"
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader } from "shared/components";
import { CheckboxHeader, CheckboxCell, Id, NameAvatar, Badge, CreateBy, Actions } from "shared/components"

import { useDelete, useFilter } from "shared/hooks"

// Toast & Styles
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllCandidates = () => {
  const dispatch = useDispatch();

  // State Management
  const { candidates, isCandidateSuccess, error } = useSelector(candidateSelector);
  const [candidate, setCandidate] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
  } = useDelete(deleteCandidate);

  // Candidate Data
  useEffect(() => {
    if (candidates && !candidates.length) {
      dispatch(getCandidates());
    }
  }, [dispatch, candidates]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCandidate(null);
    } else {
      setModal(true);
    }
  }, [modal]);


  // Update Data
  const handleCandidateClick = useCallback(
    (candidate) => {
      setCandidate(candidate);
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

  const columns = useMemo(
    () => [
      {
        Header: () =>
          <CheckboxHeader
            handleCheckAllClick={handleCheckAllClick}
          />,
        accessor: "id",
        Cell: (cellProps) =>
          <CheckboxCell
            {...cellProps}
            handleCheckCellClick={handleCheckCellClick}
          />,
      },
      {
        Header: "م.",
        Cell: (cellProps) => <Id {...cellProps} />
      },
      {
        Header: "المرشح",
        accessor: "name",
        Cell: (cellProps) =>
          <NameAvatar
            name={cellProps.row.original.name}
            image={cellProps.row.original.image}
            slug={cellProps.row.original.slug}
            dirName="candidates"
          />
      },
      {
        Header: "الحالة",
        Cell: (cellProps) =>
          <Badge
            option="status"
            value={cellProps.row.original.task.status}
          />
      },
      {
        Header: "الأولية",
        Cell: (cellProps) =>
          <Badge
            option="priority"
            value={cellProps.row.original.task.priority}
          />
      },
      {
        Header: "بواسطة",
        Cell: (cellProps) =>
          <CreateBy {...cellProps} />
      },
      {
        Header: "إجراءات",
        accessor: "candidate",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <Actions
              options={["view", "update", "delete"]}
              cell={cellProps}
              handleItemClicks={handleCandidateClick}
              handleItemDeleteClick={handleItemDeleteClick}
            />
          );
        },
      },
    ],
    [handleCheckCellClick, handleCheckAllClick, handleCandidateClick, handleItemDeleteClick]
  );

  // Filters
  const { filteredData: candidateList, filters, setFilters } = useFilter(candidates);

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
                ContainerHeaderTitle="المرشحين"

                // Add Button
                isContainerAddButton={true}
                AddButtonText="إضافة مرشح"
                isEdit={isEdit}
                handleEntryClick={handleCandidateClicks}
                toggle={toggle}

                // Delete Button
                isMultiDeleteButton={isMultiDeleteButton}
                setDeleteModalMulti={setDeleteModalMulti}
              />
              <TableFilters
                // Filters
                isGlobalFilter={true}
                preGlobalFilteredRows={true}
                isGenderFilter={true}
                isStatusFilter={true}
                isPriorityFilter={true}
                isResetFilters={true}

                // Settings
                filters={filters}
                setFilters={setFilters}
                SearchPlaceholder="البحث..."
              />

              {isCandidateSuccess && candidates.length ? (
                <TableContainer
                  // Table Data
                  columns={columns}
                  data={candidateList || []}
                  customPageSize={200}

                  // useFilters={true}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light table-nowrap"
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

export default AllCandidates;

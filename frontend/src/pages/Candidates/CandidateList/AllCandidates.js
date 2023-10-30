// React & Redux
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Row, Card, CardBody } from "reactstrap";

// Store & Selectors
import { getCandidates, deleteCandidate, getModeratorUsers } from "store/actions";
import { candidateSelector } from 'Selectors';

// Custom Components, Constants & Hooks Imports
import { Loader, DeleteModal, TableContainer, TableContainerHeader } from "Common/Components";
import CandidateModal from "./CandidateModal"
import { Id, CheckboxHeader, CheckboxCell, Name, Status, Priority, CreateBy, Actions } from "./CandidateListCol";
import { useDelete, useFetchDataIfNeeded } from "Common/Hooks"

// Toast & Styles
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllCandidates = () => {
  const dispatch = useDispatch();

  // State Management
  const { candidates, isCandidateSuccess, error } = useSelector(candidateSelector);
  const [modal, setModal] = useState(false);
  const [candidate, setCandidate] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

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
    (arg) => {
      const candidate = arg;

      setCandidate({
        id: candidate.id,
        name: candidate.name,
        gender: candidate.gender,
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
        Header: "المرشح",
        accessor: "name",
        Cell: Name,
      },

      {
        Header: "الحالة",
        Cell: (cellProps) => <Status {...cellProps} />
      },
      {
        Header: "الأولية",
        Cell: (cellProps) => <Priority {...cellProps} />
      },
      {
        Header: "بواسطة",
        Cell: (cellProps) => <CreateBy {...cellProps} />
      },
      {
        Header: "إجراءات",
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

  // Filters
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

                // Add Elector Button
                isContainerAddButton={true}
                AddButtonText="إضافة جديد"
                isEdit={isEdit}
                handleEntryClick={handleCandidateClicks}
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
                  SearchPlaceholder="البحث..."

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

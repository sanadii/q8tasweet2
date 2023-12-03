// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { electionSelector } from 'Selectors';

import { deleteElectionCommittee } from "store/actions";
import CommitteeModal from "./CommitteeModal";
import { Id, CheckboxHeader, CheckboxCell, Name, Gender, Position, Votes, Actions } from "./CommitteesCol";
import { usePermission, useDelete } from "hooks";

// Utility and helper imports
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom component imports
import { DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "components";

// Reactstrap (UI) imports
import { Badge, Col, Container, Row, Card, CardBody } from "reactstrap";

// Additional package imports
import SimpleBar from "simplebar-react";

const CommitteesTab = () => {
  const { electionDetails, electionCommittees, error } = useSelector(electionSelector);
  const [electionCommittee, setElectionCommittee] = useState([]);

  // Modals: Delete, Set, Edit
  const [modal, setModal] = useState(false);
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
  } = useDelete(deleteElectionCommittee);


  // Toggle for Add / Edit Models
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElectionCommittee(null);
    } else {
      setModal(true);
    }
  }, [modal]);



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


  const handleElectionCommitteeClicks = () => {
    setElectionCommittee("");
    setIsEdit(false);
    toggle();
  };

  const columns = useMemo(
    () => [
      {
        Header: () => <CheckboxHeader checkedAll={checkedAll} />,
        Cell: (cellProps) => <CheckboxCell {...cellProps} deleteCheckbox={deleteCheckbox} />,
        id: "id",
      },
      {
        Header: "اللجنة",
        filterable: true,
        Cell: (cellProps) => <Name {...cellProps} />
      },
      {
        Header: "النوع",
        filterable: true,
        Cell: (cellProps) => <Gender {...cellProps} />
      },
      {
        Header: "إجراءات",
        Cell: (cellProps) => (
          <Actions
            {...cellProps}
            setElectionCommittee={setElectionCommittee}
            handleElectionCommitteeClick={handleElectionCommitteeClick}
            onClickDelete={onClickDelete}
          />
        )
      },
      {
        Header: "رمز",
        accessor: "committee_id",
        Cell: (cellProps) => <Id {...cellProps} />
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
      <CommitteeModal
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
                  isMultiDeleteButton={isMultiDeleteButton}

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

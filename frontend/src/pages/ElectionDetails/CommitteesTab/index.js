// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { electionSelector } from 'selectors';

import { deleteElectionCommittee } from "store/actions";
import { Id, CheckboxHeader, CheckboxCell, Name, Gender, Circle, Areas, Voters, Sorter, Actions, Expanded } from "./CommitteesCol";
import { usePermission, useDelete } from "shared/hooks";

// Components
import CommitteeModal from "./CommitteeModal";
import CommitteeExpandedContent from './CommitteeExpandedContent';


// Utility and helper imports
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom component imports
import { DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "shared/components";

// Reactstrap (UI) imports
import { Col, Row, Card, CardBody } from "reactstrap";


const CommitteesTab = () => {
  const { electionDetails, electionCommittees, electionSorters, electionCampaigns, error } = useSelector(electionSelector);
  const [electionCommittee, setElectionCommittee] = useState([]);

  // Modals: Delete, Set, Edit
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);


  // Delete Hook
  const {
    handleDeleteItem,
    onDeleteCheckBoxClick,
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
        name: electionCommittee.name,
        gender: electionCommittee.gender,
        sorter: electionCommittee.sorter,
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
        Header: "م",
        filterable: true,
        Cell: (cellProps) => <Id {...cellProps} />
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
        Header: "الدائرة",
        filterable: true,
        Cell: (cellProps) => <Circle {...cellProps} />
      },
      {
        Header: "المنطقة",
        filterable: true,
        Cell: (cellProps) => <Areas {...cellProps} />
      },
      {
        Header: "الناخبين",
        filterable: true,
        Cell: (cellProps) => <Voters {...cellProps} />
      },
      {
        Header: "الفارز",
        filterable: true,
        Cell: (cellProps) => (
          <Sorter
            cellProps={cellProps}
            electionSorters={electionSorters}
            electionCampaigns={electionCampaigns}
          />
        )
      },
      {
        Header: "إجراءات",
        Cell: (cellProps) => (
          <Actions
            {...cellProps}
            setElectionCommittee={setElectionCommittee}
            handleElectionCommitteeClick={handleElectionCommitteeClick}
            onDeleteCheckBoxClick={onDeleteCheckBoxClick}
          />
        )
      },
      {
        // Expander column
        id: 'expander',
        Header: ({ getToggleAllRowsExpandedProps }) => (
          <span {...getToggleAllRowsExpandedProps()}>اللجان الفرعية</span>
        ),
        Cell: (cellProps) => (
          <Expanded
            {...cellProps}
          />
        )
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
                  ExpandedComponent={CommitteeExpandedContent}

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

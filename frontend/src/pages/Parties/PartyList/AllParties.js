// React & Redux
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { getParties, deleteParty, getModeratorUsers } from "store/actions";
import { partySelector } from 'selectors';

// Custom Components, Constants & Hooks Imports
import PartyModal from "./PartyModal"
import { Id, CheckboxHeader, CheckboxCell, Name, Status, Priority, CreateBy, Actions } from "./PartyListCol";
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader } from "shared/components";
import { useDelete, useFilter } from "shared/hooks"

// Toast & Styles
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllParties = () => {
  const dispatch = useDispatch();

  // State Management
  const { parties, isPartySuccess, error } = useSelector(partySelector);

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
  } = useDelete(deleteParty);

  // Party Data
  useEffect(() => {
    if (parties && !parties.length) {
      dispatch(getParties());
    }
  }, [dispatch, parties]);

  // Model & Toggle Function
  const [party, setParty] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setParty(null);
    } else {
      setModal(true);
    }
  }, [modal]);


  // Update Data
  const handlePartyClick = useCallback(
    (arg) => {
      const party = arg;

      setParty({
        id: party.id,
        image: party.image,
        name: party.name,
        gender: party.gender,
        description: party.description,

        // Admin
        status: party.task.status,
        priority: party.task.priority,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Add Data
  const handlePartyClicks = () => {
    setParty("");
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
        accessor: "party",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <Actions
              {...cellProps}
              handlePartyClick={handlePartyClick}
              onClickDelete={onClickDelete}
            />
          );
        },
      },
    ],
    [handlePartyClick, checkedAll]
  );

  // Filters
  const { filteredData: partyList, filters, setFilters } = useFilter(parties);

  console.log("filters: ", filters);
  console.log("filters: partyList: ", partyList);

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
      <PartyModal
        modal={modal}
        toggle={toggle}
        party={party}
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
                handleEntryClick={handlePartyClicks}
                toggle={toggle}

                // Delete Button
                isMultiDeleteButton={isMultiDeleteButton}
                setDeleteModalMulti={setDeleteModalMulti}
              />
              <TableFilters
                // Filters
                isGlobalFilter={true}
                preGlobalFilteredRows={true}
                isStatusFilter={true}
                isPriorityFilter={true}
                isResetFilters={true}

                // Settings
                filters={filters}
                setFilters={setFilters}
                SearchPlaceholder="البحث..."
              />

              {isPartySuccess && parties.length ? (
                <TableContainer
                  // Table Data
                  columns={columns}
                  data={partyList || []}
                  customPageSize={20}

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

export default AllParties;

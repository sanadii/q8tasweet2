// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { deleteElectionCandidate } from "store/actions";
import { electionSelector } from 'selectors';
import { Id, CheckboxHeader, CheckboxCell, Name, Position, Votes, Actions } from "./CandidatesCol";

// Common Components
import ElectionCandidateModal from "./ElectionCandidateModal";
import { Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "shared/components";
// import { calculateCandidatePosition } from "./CandidateCalculations"
import { usePermission, useDelete } from "shared/hooks";

// UI & Utilities
import { Col, Row, Card, CardBody } from "reactstrap";
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";

const CandidatesTab = () => {
  const dispatch = useDispatch();

  const { election, electionCandidates, error } = useSelector(electionSelector);

  // Constants
  const [electionCandidate, setElectionCandidate] = useState([]);
  const [electionCandidateList, setElectionCandidateList] = useState(electionCandidates);

  // Sort List by Candidate Position
  useEffect(() => {
    const calculateCandidatePosition = (candidates) => {
      // Sort candidates by votes in desending order
      let sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

      // Assign positions
      for (let i = 0; i < sortedCandidates.length; i++) {
        sortedCandidates[i].position = i + 1;
      }

      // Set isWinner property based on electSeats
      const electSeats = election.electSeats || 0;
      sortedCandidates = sortedCandidates.map(candidate => ({
        ...candidate,
        isWinner: candidate.position <= electSeats
      }));

      // Sort candidates by positions in ascending order (issue in react its always reversing)
      sortedCandidates = sortedCandidates.sort((a, b) => b.position - a.position);
      return sortedCandidates;
    };

    const sortedCandidates = calculateCandidatePosition(electionCandidates);
    setElectionCandidateList(sortedCandidates);

  }, [electionCandidates, election.electSeats]);

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
  } = useDelete(deleteElectionCandidate);


  // Models
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Toggle for Add / Edit Models
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElectionCandidate(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Update Data
  const handleElectionCandidateClick = useCallback(
    (arg) => {
      const electionCandidate = arg;

      setElectionCandidate({
        id: electionCandidate.id,
        election: electionCandidate.election,
        candidate: electionCandidate.candidate,
        name: electionCandidate.name,
        votes: electionCandidate.votes,
        notes: electionCandidate.notes,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  const handleElectionCandidateClicks = () => {
    setElectionCandidate("");
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
        Header: "المركز",
        accessor: "position",
        Cell: (cellProps) => <Position {...cellProps} />
      },
      {
        Header: "المرشح",
        filterable: true,
        Cell: (cellProps) => <Name {...cellProps} />
      },
      {
        Header: "الأصوات",
        accessor: "votes",
        Cell: (cellProps) => <Votes {...cellProps} />
      },
      {
        Header: "إجراءات",
        Cell: (cellProps) => (
          <Actions
            {...cellProps}
            setElectionCandidate={setElectionCandidate}
            handleElectionCandidateClick={handleElectionCandidateClick}
            onClickDelete={onClickDelete}
          />
        )
      },
      {
        Header: "رمز",
        accessor: "candidate_id",
        Cell: (cellProps) => <Id {...cellProps} />
      },
    ],
    [handleElectionCandidateClick, checkedAll]
  );

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  return (
    <React.Fragment>
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={electionCandidateList}
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
      <ElectionCandidateModal
        modal={modal}
        setModal={setModal}
        isEdit={isEdit}
        toggle={toggle}
        electionCandidate={electionCandidate}
      />

      <Row>
        <Col lg={12}>
          <Card id="electionCandidateList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // CSS: Table-border-Color
                  // Title
                  ContainerHeaderTitle="المرشحين"

                  // Add Elector Button
                  isContainerAddButton={true}
                  AddButtonText="إضافة مرشح"
                  handleEntryClick={handleElectionCandidateClicks}
                  toggle={toggle}

                  // Delete Button
                  isMultiDeleteButton={isMultiDeleteButton}
                  setDeleteModalMulti={setDeleteModalMulti}
                />

                {electionCandidateList && electionCandidateList.length ? (
                  <TableContainer
                    // Data
                    columns={columns}
                    data={electionCandidateList || []}
                    customPageSize={50}

                    // Header
                    setIsEdit={setIsEdit}
                    toggle={toggle}

                    // Filters
                    isGlobalFilter={true}
                    isCandidateGenderFilter={true}
                    isMultiDeleteButton={isMultiDeleteButton}
                    SearchPlaceholder="البحث...."
                    setElectionCandidateList={setElectionCandidateList}
                    // handleElectionCandidateClick={handleElectionCandidateClicks}

                    // Styling
                    divClass="table-responsive table-card mb-3"
                    tableClass="align-middle table-nowrap mb-0"
                    theadClass="table-light table-nowrap"
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

export default CandidatesTab;

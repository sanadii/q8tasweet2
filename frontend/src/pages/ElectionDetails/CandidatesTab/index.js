// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { deleteElectionCandidate, deleteElectionParty, deleteElectionPartyCandidate, addCampaign } from "store/actions";
import { electionSelector } from 'selectors';

// import { Id, CheckboxHeader, CheckboxCell, Name, Position, Votes, Actions } from "./CandidatesCol";
import { CheckboxHeader, CheckboxCell, NameAvatar, Name, Actions } from "shared/components";

// Common Components
import ElectionCandidateModal from "./Candidates/ElectionCandidateModal";
import Candidates from "./Candidates/ElectionCandidates";
import Parties from "./Parties";
import ElectionPartyModal from "./Parties/ElectionPartyModal";

import { DeleteModal, ExportCSVModal, TableContainerHeader } from "shared/components";
import { useDelete } from "shared/hooks";

// UI & Utilities
import { Col, Row, Card, CardBody } from "reactstrap";

const CandidatesTab = () => {
  const dispatch = useDispatch();

  const { election, electionMethod, electionCandidates, electionParties, error } = useSelector(electionSelector);

  // Constants
  const [electionParty, setElectionParty] = useState([]);
  const [electionPartyCandidate, setElectionPartyCandidate] = useState([]);
  // const [electionPartyList, setElectionPartyList] = useState(electionParties);

  const [electionCandidate, setElectionCandidate] = useState([]);
  const [electionCandidateList, setElectionCandidateList] = useState(electionCandidates);

  const [partyCandidateView, setCandidatePartyView] = useState(
    (electionMethod === "candidateOnly" || electionMethod === "partyCandidateOriented") ? false : true
  )

  let deleteAction;
  if (partyCandidateView === true) {
    // If the action is on electionParty
    deleteAction = deleteElectionParty;
    // setIsElectionPartyAction(false); // Set isElectionPartyAction to true when this button is clicked


  } else {
    // If electionMethod is 1
    deleteAction = deleteElectionCandidate;
  }

  // Delete Hook
  const {
    handleDeleteItem,
    handleItemDeleteClick,
    deleteModal,
    setDeleteModal,
    handleCheckAllClick,
    handleCheckCellClick,
    isMultiDeleteButton,
    deleteModalMulti,
    setDeleteModalMulti,
    handleDeleteMultiple,
  } = useDelete(deleteAction);










  const handleCandidatePartyViewSwitch = () => {
    if (partyCandidateView === false) {
      setCandidatePartyView(true)
    } else {
      setCandidatePartyView(false)
    }
  }

  // Function to close the candidate modal
  const closeCandidateModal = () => {
    setCandidateModal(false);
  };


  // State for the candidate modal
  const [candidateModal, setCandidateModal] = useState(false);
  const [partyModal, setPartyModal] = useState(false);
  const [isEditCandidate, setIsEditCandidate] = useState(false);
  const [isEditParty, setIsEditParty] = useState(false);
  const [isEditPartyCandidate, setIsEditPartyCandidate] = useState(false);

  // State for the campaign modal
  const [isElectionPartyAction, setIsElectionPartyAction] = useState(false);


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
  // const handleElectionPartyCandidateClick = useCallback(
  //   (electionPartyCandidate) => {
  //     setElectionPartyCandidate(electionPartyCandidate);
  //     // setCampaignModal(false);
  //     setCandidateModal(true);
  //     setIsEdit(true);
  //     toggle();
  //   },
  //   [toggle]
  // );


  // Campaign
  const handleAddNewCampaign = (electionCandidateId) => {
    const newCampaign = {
      electionCandidate: electionCandidateId,
    };
    dispatch(addCampaign(newCampaign));
  };


  // Election Party
  const handleAddElectionParty = (electionParty = null) => {
    setElectionParty(electionParty);
    setIsEditParty(!!electionParty);
    setPartyModal(true);
    setIsEdit(false);
    toggle();
  };

  const handleElectionPartyClicks = useCallback(
    (electionParty) => {
      setElectionParty(electionParty);
      // setCampaignModal(false);
      setPartyModal(true);
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Election Candidate
  const handleAddElectionCandidate = (candidate = null) => {
    setElectionCandidate(candidate);
    setIsEditCandidate(!!candidate);
    setCandidateModal(true);
    setIsEdit(false);
    toggle();
  };

  const handleElectionCandidateClick = useCallback(
    (electionCandidate, modalMode) => {
      if (modalMode === "addCampaign") {
        handleAddNewCampaign(electionCandidate.id,)
      } else {
        // console.log("lets do something else")
        setElectionCandidate(electionCandidate);
        // setCampaignModal(false);
        setCandidateModal(true);
        setIsEdit(true);
        toggle();
      }
    }, [toggle]
  );


  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: () => <CheckboxHeader handleCheckAllClick={handleCheckAllClick} />,
        accessor: "id",
        Cell: (cellProps) => <CheckboxCell {...cellProps} handleCheckCellClick={handleCheckCellClick} />,
      },
      {
        Header: "المرشح",
        filterable: true,
        Cell: (cellProps) =>
          <NameAvatar
            name={cellProps.row.original.name}
            image={cellProps.row.original.image}
            slug={cellProps.row.original.slug}
            dirName="elections"
          />
      },
      {
        Header: "القائمة",
        filterable: true,
        Cell: (cellProps) => {
          const party = electionParties.find(party => party.id === cellProps.row.original.party);
          const partyName = party ? party.name : "مرشح مستقل";
          return (
            <Name name={partyName} />
          );
        }
      },
      {
        Header: "إجراءات",
        accessor: "election",
        Cell: (cellProps) =>
          <Actions
            cell={cellProps}
            options={["view", "update", "delete", "addCampaign"]}
            handleItemClicks={handleElectionCandidateClick}
            handleItemDeleteClick={handleItemDeleteClick}
          />
      },
    ],
    [electionParties, handleElectionCandidateClick, handleCheckCellClick, handleCheckAllClick, handleItemDeleteClick]
  );

  const PartyColumns = useMemo(() => {
    return columns.filter(column =>
      column.Header === "المرشح"
      || column.Header === "إجراءات"
    );
  }, [columns]);


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
          handleDeleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />

      <ElectionCandidateModal
        modal={candidateModal}
        setModal={setCandidateModal}
        isEdit={isEdit}
        toggle={toggle}
        electionCandidate={electionCandidate}
      />

      <ElectionPartyModal
        modal={partyModal}
        setModal={setPartyModal}
        isEdit={isEdit}
        toggle={toggle}
        electionParty={electionParty}
      />

      <Row>
        <Col lg={12}>
          <Card id="electionCandidateList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // NEW
                  isElectionCandidateButtons={true}

                  // Title
                  ContainerHeaderTitle="المرشحين والنتائج"

                  // Buttons
                  {...(electionMethod !== "candidateOnly" && {
                    HandlePrimaryButton: handleAddElectionParty,
                    PrimaryButtonText: "إضافة قائمة"
                  })}

                  HandleSecondaryButton={handleAddElectionCandidate}
                  SecondaryButtonText="إضافة مرشح"

                  HandleTertiaryButton={handleCandidatePartyViewSwitch}
                  TertiaryButtonText="قائمة"

                  toggle={toggle}

                  // Delete Button
                  isMultiDeleteButton={isMultiDeleteButton}
                  setDeleteModalMulti={setDeleteModalMulti}
                />

                {
                  partyCandidateView === false ?
                    <Candidates
                      columns={columns}
                    />
                    :
                    <Parties
                      columns={PartyColumns}
                      handleElectionPartyClicks={handleElectionPartyClicks}
                      handleItemDeleteClick={handleItemDeleteClick}
                    />
                }
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CandidatesTab;

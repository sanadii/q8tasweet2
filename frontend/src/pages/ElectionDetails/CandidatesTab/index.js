// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { deleteElectionCandidate, deleteElectionParty, deleteElectionPartyCandidate } from "store/actions";
import { electionSelector } from 'selectors';
import { Id, CheckboxHeader, CheckboxCell, Name, Position, Votes, Actions } from "./CandidatesCol";

// Common Components
import ElectionCandidateModal from "./ElectionCandidateModal";
import ElectionPartyModal from "./ElectionPartyModal";
import CampaignModal from "../CampaignsTab/CampaignModal";
import Candidates from "./Candidates";
import Parties from "./Parties";

import { Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "shared/components";
import { usePermission, useDelete } from "shared/hooks";

// UI & Utilities
import { Button, Col, Row, Card, CardBody, Nav, NavItem, NavLink } from "reactstrap";
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import classnames from "classnames";

const CandidatesTab = () => {

  const { election, electionMethod, electionCandidates, electionParties, error } = useSelector(electionSelector);

  // Constants
  const [electionParty, setElectionParty] = useState([]);
  const [electionPartyCandidate, setElectionPartyCandidate] = useState([]);
  // const [electionPartyList, setElectionPartyList] = useState(electionParties);

  const [electionCandidate, setElectionCandidate] = useState([]);
  const [electionCandidateList, setElectionCandidateList] = useState(electionCandidates);

  const [electionCampaign, setElectionCampaign] = useState([]);
  const [electionCampaignList, setElectionCampaignList] = useState(electionCampaign);


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
  const [campaignModal, setCampaignModal] = useState(false);
  const [isEditCampaign, setIsEditCampaign] = useState(false);
  const [isElectionPartyAction, setIsElectionPartyAction] = useState(false);

  console.log("isElectionPartyAction: ", isElectionPartyAction)
  let deleteAction;

  if (electionMethod !== "candidateOnly") {
    if (isElectionPartyAction) {
      // If the action is on electionParty
      deleteAction = deleteElectionParty;
      // setIsElectionPartyAction(false); // Set isElectionPartyAction to true when this button is clicked

    } else {
      // If the action is on electionPartyCandidate
      deleteAction = deleteElectionPartyCandidate;
    }
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
    handlehandleDeleteMultiple,
  } = useDelete(deleteAction);

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
  const handleElectionPartyClick = useCallback(
    (arg) => {
      const electionParty = arg;

      setElectionParty({
        id: electionParty.id,
        election: electionParty.election,
        candidate: electionParty.candidate,
        name: electionParty.name,
        votes: electionParty.votes,
        notes: electionParty.notes,
      });
      // setCampaignModal(false);
      setPartyModal(true);
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  const handleElectionPartyCandidateClick = useCallback(
    (arg) => {
      const electionPartyCandidate = arg;

      setElectionPartyCandidate({
        id: electionPartyCandidate.id,
        electionParty: electionPartyCandidate.electionParty,
        candidate: electionPartyCandidate.candidate,
        name: electionPartyCandidate.name,
        votes: electionPartyCandidate.votes,
        notes: electionPartyCandidate.notes,
      });
      // setCampaignModal(false);
      setCandidateModal(true);
      setIsEdit(true);
      toggle();

    },
    [toggle]
  );

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
      // setCampaignModal(false);
      setCandidateModal(true);
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  const handleElectionCampaignClick = useCallback(
    (arg) => {
      const electionCampaign = arg;

      setElectionCandidate({
        id: electionCampaign.id,
      });
      // setCampaignModal(false);
      setCampaignModal(true);
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );


  const handleElectionPartyClicks = (electionParty = null) => {
    setElectionParty(electionParty);
    setIsEditParty(!!electionParty);
    setPartyModal(true);
    setIsEdit(false);
    toggle();
  };

  const handleElectionCandidateClicks = (candidate = null) => {
    setElectionCandidate(candidate);
    setIsEditCandidate(!!candidate);
    setCandidateModal(true);
    setIsEdit(false);
    toggle();
  };

  const handleElectionCampaignClicks = (campaign = null) => {
    setElectionCampaign(campaign);
    setIsEditCampaign(!!campaign);
    setCampaignModal(true);
    setIsEdit(false);
    toggle();
  };


  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: () => <CheckboxHeader handleCheckAllClick={handleCheckAllClick} />,
        Cell: (cellProps) => <CheckboxCell {...cellProps} handleCheckCellClick={handleCheckCellClick} />,
        id: "id",
      },
      {
        Header: "المرشح",
        filterable: true,
        Cell: (cellProps) => <Name {...cellProps} />
      },
      {
        Header: "إجراءات",
        Cell: (cellProps) => (
          <Actions
            {...cellProps}
            setElectionCandidate={setElectionCandidate}
            handleElectionCandidateClick={handleElectionCandidateClick}
            setIsElectionPartyAction={setIsElectionPartyAction}
            handleItemDeleteClick={handleItemDeleteClick}
          />
        )
      },
    ],
    [handleElectionCandidateClick, handleCheckAllClick]
  );


  const electionPartyButtons = useMemo(
    () => [
      {
        Name: "تعديل",
        action: (electionParty) =>
          <button
            to="#"
            className="btn btn-sm btn-soft-info edit-list"
            onClick={() => {
              setIsElectionPartyAction(true);
              handleElectionPartyClick(electionParty);
            }}
          >
            <i className="ri-pencil-fill align-bottom" />
          </button>
      },
      {
        Name: "حذف",
        action: (electionParty) => (
          <button
            className="btn btn-sm btn-soft-danger remove-list"
            onClick={() => {
              setIsElectionPartyAction(true);
              handleItemDeleteClick(electionParty);
            }}
          >
            <i className="ri-delete-bin-5-fill align-bottom" />
          </button>
        )
      }
    ],
    []
  );



  const PartyColumns = useMemo(() => {
    return columns.filter(column =>
      column.Header === "المرشح"
      || column.Header === "إجراءات"
    );
  }, [columns]);
  console.log("electionParty: ", electionParty)


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
          handlehandleDeleteMultiple();
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
      <CampaignModal
        modal={campaignModal}
        setModal={setCampaignModal}
        isEdit={isEditCampaign}
        toggle={toggle}
        electionCampaign={electionCampaign}
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
                    HandlePrimaryButton: { handleElectionPartyClicks },
                    PrimaryButtonText: "إضافة قائمة"
                  })}

                  HandleSecondaryButton={handleElectionCandidateClicks}
                  SecondaryButtonText="إضافة مرشح"

                  HandleTertiaryButton={handleElectionCampaignClicks}
                  TertiaryButtonText="إضافة حملة"

                  toggle={toggle}

                  // Delete Button
                  isMultiDeleteButton={isMultiDeleteButton}
                  setDeleteModalMulti={setDeleteModalMulti}
                />
                {
                  electionMethod !== "candidateOnly" ?
                    <Parties
                      columns={PartyColumns}
                      electionPartyButtons={electionPartyButtons}
                    />
                    :
                    <Candidates
                      columns={columns}
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

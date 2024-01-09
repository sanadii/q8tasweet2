// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { deleteElectionCandidate } from "store/actions";
import { electionSelector } from 'Selectors';
import { Id, CheckboxHeader, CheckboxCell, Name, Position, Votes, Actions } from "./CandidatesCol";

// Common Components
import ElectionCandidateModal from "./ElectionCandidateModal";
import ElectionPartyModal from "./ElectionPartyModal";
import CampaignModal from "../CampaignsTab/CampaignModal";
import Candidates from "./Candidates";
import Parties from "./Parties";

import { Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "components";
// import { calculateCandidatePosition } from "./CandidateCalculations"
import { usePermission, useDelete } from "hooks";

// UI & Utilities
import { Col, Row, Card, CardBody, Nav, NavItem, NavLink } from "reactstrap";
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import classnames from "classnames";

const CandidatesTab = () => {

  const { election, electionCandidates, electionParties, error } = useSelector(electionSelector);

  // Constants
  const [electionParty, setElectionParty] = useState([]);
  const [electionPartyCandidate, setElectionPartyCandidate] = useState([]);
  // const [electionPartyList, setElectionPartyList] = useState(electionParties);

  const [electionCandidate, setElectionCandidate] = useState([]);
  const [electionCandidateList, setElectionCandidateList] = useState(electionCandidates);

  const [electionCampaign, setElectionCampaign] = useState([]);
  const [electionCampaignList, setElectionCampaignList] = useState(electionCampaign);

  console.log("electionParties: ", electionParties)
  // console.log("electionCandidateList: ", electionPartyList)

  // const mainTabs = [
  //   { id: "1", title: "النتائج", icon: 'ri-activity-line', },
  //   { id: "2", title: "النتائج التفصيلية", icon: 'ri-activity-line', },
  //   { id: "3", title: "إضافة النتائج", icon: 'ri-activity-line', }
  // ];

  // Function to close the candidate modal
  const closeCandidateModal = () => {
    setCandidateModal(false);
  };


  // Function to close the campaign modal




  // State for the candidate modal
  const [candidateModal, setCandidateModal] = useState(false);
  const [partyModal, setPartyModal] = useState(false);
  const [isEditCandidate, setIsEditCandidate] = useState(false);
  const [isEditParty, setIsEditParty] = useState(false);
  const [isEditPartyCandidate, setIsEditPartyCandidate] = useState(false);

  // State for the campaign modal
  const [campaignModal, setCampaignModal] = useState(false);
  const [isEditCampaign, setIsEditCampaign] = useState(false);

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

      console.log("CHECK: modal:", modal);
      console.log("CHECK: isEdit:", isEdit);
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

      console.log("CHECK: modal:", modal);
      console.log("CHECK: isEdit:", isEdit);
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


  const handleElectionPartyClicks = (party = null) => {
    setElectionParty(party);
    setIsEditParty(!!party);
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

  const handleElectionResultClicks = () => {
    setActiveTab("8");
  };

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  //Tab
  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
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
      // {
      //   Header: "الأصوات",
      //   accessor: "votes",
      //   Cell: (cellProps) => <Votes {...cellProps} />
      // },
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


  const PartyColumns = useMemo(() => {
    return columns.filter(column =>
      column.Header === "المرشح" || column.accessor === "candidate_id"
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
          deleteMultiple();
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

                  // CSS: Table-border-Color
                  // Title
                  ContainerHeaderTitle="المرشحين والنتائج"

                  // Buttons
                  HandlePrimaryButton={handleElectionPartyClicks}
                  PrimaryButtonText="إضافة قائمة"

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
                  election.electType !== 1 ?
                    <Parties
                      columns={PartyColumns}
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

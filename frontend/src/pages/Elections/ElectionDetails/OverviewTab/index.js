import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import { ImageGenderCircle, Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "components";
import { electionSelector } from 'Selectors';

// Components
import ElectionResults from "./ElectionResults"
import ElectionDetailsWidget from "./ElectionDetailsWidget";
import ElectionModerators from "./ElectionModerators";
import ElectionCampaigns from "./ElectionCampaigns";
import ElectionDatabase from "./ElectionDatabase";
import ElectionDetails from "./ElectionDetails";
import ElectionComments from "./ElectionComments";
import ElectionPrevious from "./ElectionPrevious";

//SimpleBar
import SimpleBar from "simplebar-react";

const OverviewTab = () => {

  const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);

  const moderators = Array.isArray(election.moderators)
    ? election.moderators
    : [];

  return (
    <React.Fragment>

      <Row>
        <Col xl={9} lg={8}>
          <ElectionResults />
          <ElectionPrevious />
          <ElectionComments />
        </Col>

        <Col xl={3} lg={4}>
          <ElectionDetails />
          <ElectionDetailsWidget election={election} electionCandidates={electionCandidates} />
          {/* <ElectionModerators /> */}
          {/* <ElectionCampaigns /> */}
          {/* <ElectionDatabase /> */}
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OverviewTab;

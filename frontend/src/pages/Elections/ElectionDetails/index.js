import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getElectionDetails,
  // getElectionCandidates,
  getElectionCampaigns,
} from "../../../store/actions";
import { isEmpty } from "lodash";
import Section from "./Section";

const ElectionDetails = () => {
  useEffect(() => {
    document.title =
      "Election Details | Q8Tasweet - React Admin & Dashboard Template";
  }, []);

  const [election, setElection] = useState({
    id: useParams().id,
  });

  const { electionDetails, electionCandidates, electionCampaigns } =
    useSelector((state) => ({
      electionDetails: state.Elections.electionDetails,
      electionCandidates: state.Elections.electionCandidates,
      electionCampaigns: state.Elections.electionCampaigns,
      // error: state.Elections.error,
    }));

  const dispatch = useDispatch();

  useEffect(() => {
    if (election.id && !isEmpty(election)) {
      dispatch(getElectionDetails(election));
    }
  }, [dispatch, election, election.id]);

  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Section
            election={electionDetails}
            electionCandidates={electionCandidates}
            electionCampaigns={electionCampaigns}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ElectionDetails;

import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getElectionDetails,
  // getCandidateElections,
  getElectionCampaigns,
} from "../../../store/actions";
import { isEmpty } from "lodash";
import Section from "./Section";

const ElectionDetails = () => {
  useEffect(() => {
    document.title =
      "Candidate Details | Q8Tasweet - React Admin & Dashboard Template";
  }, []);

  const [candidate, setElection] = useState({
    id: useParams().id,
  });

  const { electionDetails, candidateElections, electionCampaigns } =
    useSelector((state) => ({
      electionDetails: state.Elections.electionDetails,
      candidateElections: state.Elections.candidateElections,
      electionCampaigns: state.Elections.electionCampaigns,
      // error: state.Elections.error,
    }));

  const dispatch = useDispatch();

  useEffect(() => {
    if (candidate.id && !isEmpty(candidate)) {
      dispatch(getElectionDetails(candidate));
    }
  }, [dispatch, candidate, candidate.id]);

  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Section
            candidate={electionDetails}
            candidateElections={candidateElections}
            electionCampaigns={electionCampaigns}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ElectionDetails;

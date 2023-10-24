import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getElectionDetails,
  // getCandidates,
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

  const { electionDetails, Candidates, electionCampaigns } =
    useSelector((state) => ({
      electionDetails: state.Elections.electionDetails,
      Candidates: state.Elections.Candidates,
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
            Candidates={Candidates}
            electionCampaigns={electionCampaigns}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ElectionDetails;

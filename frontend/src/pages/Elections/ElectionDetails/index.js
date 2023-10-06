// React & Redux core
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { getElectionDetails, getCategories } from "../../../store/actions";
import { electionsSelector } from '../../../Selectors/electionsSelector';

// Components
import Section from "./Section";

// UI & Utilities
import { Container } from "reactstrap";
import { isEmpty } from "lodash";

const ElectionDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const {
    electionDetails, 
    electionCandidates, 
    electionCampaigns, 
    electionCommittees, 
    categories
  } = useSelector(electionsSelector);

  const [election, setElection] = useState({ id });

  useEffect(() => {
    document.title = "الانتخابات | Q8Tasweet - React Admin & Dashboard Template";

    if (election.id && !isEmpty(election)) {
      dispatch(getElectionDetails(election));
    }

    if (categories && !categories.length) {
      dispatch(getCategories());
    }
  }, [dispatch, election, categories]);

  return (
    <div className="page-content">
      <Container fluid>
        <Section
          election={electionDetails}
          electionCandidates={electionCandidates}
          electionCampaigns={electionCampaigns}
          electionCommittees={electionCommittees}
        />
      </Container>
    </div>
  );
};

export default ElectionDetails;

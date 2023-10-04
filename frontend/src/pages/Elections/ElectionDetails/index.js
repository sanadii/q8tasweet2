import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getElectionDetails, getCategories } from "../../../store/actions";
import { electionsSelector } from '../../../Selectors/electionsSelector';

import { isEmpty } from "lodash";
import Section from "./Section";

const ElectionDetails = () => {
  const dispatch = useDispatch();

  document.title = "الانتخابات | Q8Tasweet - React Admin & Dashboard Template";

  const { electionDetails, electionCandidates, electionCampaigns, electionCommittees, categories } = useSelector(electionsSelector);
  const [election, setElection] = useState({
    id: useParams().id,
  });

  useEffect(() => {
    if (election.id && !isEmpty(election)) {
      dispatch(getElectionDetails(election));
    }
  }, [dispatch, election, election.id]);


  // Election Categories
  useEffect(() => {
    if (categories && !categories.length) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default ElectionDetails;

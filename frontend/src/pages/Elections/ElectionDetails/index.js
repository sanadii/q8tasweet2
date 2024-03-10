// React & Redux core
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { getElectionDetails } from "store/actions";
import { electionSelector } from 'selectors';

// Components
import Section from "./Section";

// UI & Utilities
import { Container } from "reactstrap";
import { isEmpty } from "lodash";

const ElectionDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { election } = useSelector(electionSelector);

  useEffect(() => {
    // Set the document title
    document.title = "الانتخابات | كويت تصويت";

    // Fetch election details if the slug is available and candidate is empty
    if (slug && (isEmpty(election) || election.slug !== slug)) {
      dispatch(getElectionDetails(slug));
    }
  }, [dispatch, slug]);


  return (
    <div className="page-content">
      <Container fluid>
        <Section
          election={election}
          electionCandidates={election}
          electionCampaigns={election}
          electionCommittees={election}
        />
      </Container>
    </div>
  );
};

export default ElectionDetails;

// React & Redux core
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { getElectionDetails, getCategories } from "store/actions";
import { electionSelector, categorySelector } from 'Selectors';

// Components
import Section from "./Section";

// UI & Utilities
import { Container } from "reactstrap";
import { isEmpty } from "lodash";

const ElectionDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { categories } = useSelector(categorySelector);
  const {
    election,
    electionCandidates,
    electionCampaigns,
    electionCommittees,
  } = useSelector(electionSelector);

  useEffect(() => {
    // Set the document title
    document.title = "الانتخابات | كويت تصويت";

    // Fetch election details if the slug is available and candidate is empty
    if (slug && (isEmpty(election) || election.slug !== slug)) {
      dispatch(getElectionDetails(slug));
    }
    if (categories && !categories.length) {
      dispatch(getCategories());
    }

  }, [dispatch, slug, categories]);


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

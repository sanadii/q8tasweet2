// React & Redux core
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { getElectionDetails, getElectionDatas, getElectorStatistics, getElectionSchemaDetails } from "store/actions";
import { electionSelector } from 'selectors';

// Shared: hooks
import { usePermission } from 'shared/hooks';

// Components
import Section from "./Section";

// UI & Utilities
import { Container } from "reactstrap";
import { isEmpty } from "lodash";

const ElectionDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { election } = useSelector(electionSelector);

  const {
    isStaff,
   } = usePermission();

  const hasElectionHasSchema = election?.hasSchema
  useEffect(() => {
    // Set the document title
    document.title = "الانتخابات | كويت تصويت";

    // Fetch election details if the slug is available and candidate is empty
    if (slug && (isEmpty(election) || election.slug !== slug)) {
      dispatch(getElectionDetails(slug));
    }

  }, [dispatch, election, slug]);

console.log("hasElectionHasSchema: ", hasElectionHasSchema)
  useEffect(() => {

    // Fetch election details if the slug is available and candidate is empty
    if (election && hasElectionHasSchema) {
      dispatch(getElectionSchemaDetails(slug))
      dispatch(getElectorStatistics(slug));
      // dispatch(getElectionDataDetails(slug));
    }
  }, [dispatch, election, slug, hasElectionHasSchema]);


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

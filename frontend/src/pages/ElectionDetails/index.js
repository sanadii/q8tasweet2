// React & Redux core
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { getElectionDetails, getElectionDatas, getElectorsByAll, getElectionSchemaDetails } from "store/actions";
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

  const electionSlug = election?.slug
  const electionHasSchema = election?.hasSchema

  const {
    isStaff,
  } = usePermission();

  useEffect(() => {
    document.title = "الانتخابات | كويت تصويت";
    if (slug && (electionSlug !== slug)) {
      dispatch(getElectionDetails(slug));
    }
  }, [dispatch, electionSlug, slug]);

  useEffect(() => {
    if (election && electionSlug && electionHasSchema) {
      dispatch(getElectionSchemaDetails(electionSlug));
      dispatch(getElectorsByAll({ schema: electionSlug }));
    }
  }, [election, electionSlug, electionHasSchema]);



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

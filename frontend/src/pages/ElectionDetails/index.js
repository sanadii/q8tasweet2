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
  const { election, schemaDetails } = useSelector(electionSelector);

  const electionSlug = election?.slug
  const electionHasSchema = election?.hasSchema

  const {
    isStaff,
  } = usePermission();

  const newElectionSlug = slug && (electionSlug !== slug)
  
  useEffect(() => {
    document.title = "الانتخابات | كويت تصويت";
    if (newElectionSlug) {
      dispatch(getElectionDetails(slug));
    }
  }, [newElectionSlug, slug, dispatch]);

  useEffect(() => {
    if (electionSlug && schemaDetails) {
      // dispatch(getElectionSchemaDetails(electionSlug));
      dispatch(getElectorsByAll({ schema: electionSlug }));
    }
  }, [electionSlug, schemaDetails, dispatch]);



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

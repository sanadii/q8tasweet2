// React & Redux core
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { getCandidateDetails } from "store/actions";
import { candidateSelector } from 'Selectors';

// Components
import Section from "./Section";

// UI & Utilities
import { Container } from "reactstrap";
import { isEmpty } from "lodash";

const CandidateDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  // Use selectors to directly get data from the Redux store
  const { candidate } = useSelector(candidateSelector);

  useEffect(() => {
    // Set the document title
    document.title = "الانتخابات | كويت تصويت";

    // Fetch candidate details if the slug is available and candidate is empty
    if (slug && (isEmpty(candidate) || candidate.slug !== slug)) {
      dispatch(getCandidateDetails(slug));
    }

  }, [dispatch, slug, candidate]);

  return (
    <div className="page-content">
      <Container fluid>
        <p>هذه الصفحة لازالت قيد الإنشاء</p>
        <h1>{candidate.name}</h1>
      </Container>
    </div>
  );
};

export default CandidateDetails;

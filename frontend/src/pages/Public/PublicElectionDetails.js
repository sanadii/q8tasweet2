// React & Redux core
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { getElectionDetails } from "store/actions";
import { electionSelector } from 'selectors';

// Components
import SectionHeader from "pages/Elections/ElectionDetails/SectionHeader";
import OverviewTab from "pages/Elections/ElectionDetails/OverviewTab";

// UI & Utilities
import { Container } from "reactstrap";
import { isEmpty } from "lodash";

const PublicElectionDetails = () => {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const { election } = useSelector(electionSelector);
    const viewType = 'public';

    useEffect(() => {
        document.title = "الانتخابات | كويت تصويت";

        // Fetch election details if the slug is available and candidate is empty
        if (slug && (isEmpty(election) || election.slug !== slug)) {
            dispatch(getElectionDetails(slug, viewType));
        }
    }, [dispatch, slug]);


    return (
        <div className="page-content">
            <Container fluid>
                <SectionHeader />
                <OverviewTab />
            </Container>
        </div>
    );
};

export default PublicElectionDetails;

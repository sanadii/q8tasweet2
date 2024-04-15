import React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { electionSelector } from 'selectors';



const StatisticsTab = () => {
    const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);

    return (
        <React.Fragment>
            <Row>

            </Row>
        </React.Fragment>
    );
};

export default StatisticsTab;

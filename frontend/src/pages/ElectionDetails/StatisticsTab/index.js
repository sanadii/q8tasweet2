import React from "react";

// Redux
import { useSelector } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';

import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import { ElectorsByFamilyPieChart, ElectorsByAreaPieChart } from "../Charts/ElectorCharts"

const StatisticsTab = () => {
    const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);
    const { electorsByGender, electorsByFamily, electorsByArea } = useSelector(electorSelector)

    console.log("electorsByFamily: ", electorsByFamily)
    return (
        <React.Fragment>
            <Row>
                <Card>
                    <CardHeader>
                        <h4 className="card-title mb-0">حسب المناطق السكنية</h4>
                    </CardHeader>
                    <CardBody>
                        {/* <ElectorsByFamilyPieChart electorsByFamily={electorsByFamily} /> */}
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h4 className="card-title mb-0">عدد الناخبين حسب القبيلة\العائلة - أول 12</h4>
                    </CardHeader>
                    <CardBody>
                        <ElectorsByAreaPieChart electorsByArea={electorsByArea} />
                    </CardBody>
                </Card>
            </Row>
        </React.Fragment>
    );
};

export default StatisticsTab;

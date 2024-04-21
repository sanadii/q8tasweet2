import React, { useState, dispatch } from "react";

// Redux
import { useSelector } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';

import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import { ElectorsByFamilyPieChart, ElectorsByAreaPieChart } from "../Charts/ElectorCharts"

import { ElectorsOverviewCharts, FamilyCharts } from './DashboardAnalyticsCharts';
import classNames from "classnames";



const StatisticsTab = () => {
    const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);
    const { electorsByGender, electorsByFamily, electorsByArea, electorsByCommittee } = useSelector(electorSelector)

    const [chartInfo, setChartInfo] = useState({
        type: 'byFamily',
        dataSeries: electorsByFamily
    });

    const onChangeElectorChartType = (button) => {
        setChartInfo({
            type: button.period,
            dataSeries: button.dataSeries
        });
    };

    const chartElectorButtons = [
        { period: 'byFamily', label: 'By Family', dataSeries: electorsByFamily },
        { period: 'byArea', label: 'By Area', dataSeries: electorsByArea },
        { period: 'byGender', label: 'By Gender', dataSeries: electorsByGender },
        { period: 'byCommittee', label: 'By Committee', dataSeries: electorsByCommittee }
    ];


    return (
        <React.Fragment>
            <Row>

                <Card>
                    <CardHeader className="border-0 align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Electors Overview</h4>
                        <div className="d-flex gap-1">
                            {chartElectorButtons.map((button, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`btn ${chartInfo.type === button.period ? 'btn-soft-primary' : 'btn-soft-secondary'} btn-sm`}
                                    onClick={() => onChangeElectorChartType(button)}
                                >
                                    {button.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardHeader className="p-0 border-0 bg-light-subtle">
                        {/* <Row className="g-0 text-center">
                            <Col xs={6} sm={3}>
                                <div className="p-3 border border-dashed border-start-0">
                                    <h5 className="mb-1"><span className="counter-value" data-target="9851">
                                        <CountUp
                                            start={0}
                                            end={9851}
                                            separator={","}
                                            duration={4}
                                        />
                                    </span></h5>
                                    <p className="text-muted mb-0">Number of Projects</p>
                                </div>
                            </Col>
                            <Col xs={6} sm={3}>
                                <div className="p-3 border border-dashed border-start-0">
                                    <h5 className="mb-1"><span className="counter-value">
                                        <CountUp
                                            start={0}
                                            end={1026}
                                            separator={","}
                                            duration={4}
                                        />
                                    </span></h5>
                                    <p className="text-muted mb-0">Active Projects</p>
                                </div>
                            </Col>
                            <Col xs={6} sm={3}>
                                <div className="p-3 border border-dashed border-start-0">
                                    <h5 className="mb-1">$<span className="counter-value" data-target="228.89">
                                        <CountUp
                                            start={0}
                                            end={228.89}
                                            decimals={2}
                                            duration={4}
                                        />
                                    </span>k</h5>
                                    <p className="text-muted mb-0">Revenue</p>
                                </div>
                            </Col>
                            <Col xs={6} sm={3}>
                                <div className="p-3 border border-dashed border-start-0 border-end-0">
                                    <h5 className="mb-1 text-success"><span className="counter-value" data-target="10589">
                                        <CountUp
                                            start={0}
                                            end={10589}
                                            separator={","}
                                            duration={4}
                                        />
                                    </span>h</h5>
                                    <p className="text-muted mb-0">Working Hours</p>
                                </div>
                            </Col>
                        </Row> */}
                    </CardHeader>
                    <CardBody className="p-0 pb-2">
                        <div>
                            <div dir="ltr" className="apex-charts">
                                <ElectorsOverviewCharts
                                    dataSeries={chartInfo.dataSeries}
                                    dataColors='["--vz-primary", "--vz-warning", "--vz-success"]'
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>


                {/* 
                <Card className="card-height-100">
                    <div className="card-header align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Sessions by Countries</h4>
                        <div className="d-flex gap-1">
                            <button type="button" className={classNames({ active: periodType === "all" }, "btn btn-soft-secondary btn-sm")} onClick={() => { onChangeChartPeriod("all"); }}>
                                ALL
                            </button>
                            <button type="button" className={classNames({ active: periodType === "monthly" }, "btn btn-soft-primary btn-sm")} onClick={() => { onChangeChartPeriod("monthly"); }}>
                                1M
                            </button>
                            <button type="button" className={classNames({ active: periodType === "halfyearly" }, "btn btn-soft-secondary btn-sm")} onClick={() => { onChangeChartPeriod("halfyearly"); }}>
                                6M
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div>
                            <FamilyCharts
                                electorsByFamily={electorsByFamily}
                                dataColors='["--vz-info", "--vz-info", "--vz-info", "--vz-info", "--vz-danger", "--vz-info", "--vz-info", "--vz-info", "--vz-info", "--vz-info"]'
                            />
                        </div>
                    </div>
                </Card> */}

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
                        {/* <ElectorsByAreaPieChart electorsByArea={electorsByArea} /> */}
                    </CardBody>
                </Card>
            </Row>
        </React.Fragment>
    );
};

export default StatisticsTab;

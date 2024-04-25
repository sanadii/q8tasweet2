
import React from "react";
import { Row, Col, CardHeader } from "reactstrap";
import CountUp from "react-countup";

const ElectorStatisticCounter = ({ dataSource }) => {

    return (
        <CardHeader className="p-0 border-0 bg-light-subtle">
            <Row className="g-0 text-center">
                <Col xs={6} sm={3}>
                    <div className="p-3 border border-dashed border-start-0">
                        <h5 className="mb-1"><span className="counter-value" data-target="9851">
                            <CountUp
                                start={0}
                                // end={electionStatistics?.electors?.total}
                                end={dataSource.statistics.electors.total || 0}
                                separator={","}
                                duration={2}
                            />
                        </span></h5>
                        <p className="text-muted mb-0">عدد الناخبين</p>
                        <span class="badge bg-light text-info mb-0 fs-12">
                            <i class="ri-arrow-down-line align-middle"></i>
                            {dataSource.statistics.electors.male || 0}
                        </span>
                        <span class="badge bg-light text-pink mb-0 fs-12">
                            <i class="ri-arrow-down-line align-middle"></i>
                            {dataSource.statistics.electors.female || 0}
                        </span>
                    </div>
                </Col>
                <Col xs={6} sm={3}>
                    <div className="p-3 border border-dashed border-start-0">
                        <h5 className="mb-1"><span className="counter-value">
                            <CountUp
                                start={0}
                                // end={electionStatistics?.areas}
                                end={dataSource.statistics.areas}
                                separator={","}
                                duration={2}
                            />
                        </span></h5>
                        <p className="text-muted mb-0">عدد المناطق</p>
                    </div>
                </Col>
                <Col xs={6} sm={3}>
                    <div className="p-3 border border-dashed border-start-0">
                        <h5 className="mb-1"><span className="counter-value">
                            <CountUp
                                start={0}
                                // end={electionStatistics?.committeeSites?.total}
                                end={dataSource.statistics.committeeSites.total || 0}
                                separator={","}
                                duration={2}
                            />
                        </span></h5>
                        <p className="text-muted mb-0">عدد اللجان الأصلية</p>
                        <span class="badge bg-light text-info mb-0 fs-12">
                            <i class="ri-arrow-down-line align-middle"></i>
                            {dataSource.statistics.committeeSites.male || 0}
                        </span>
                        <span class="badge bg-light text-pink mb-0 fs-12">
                            <i class="ri-arrow-down-line align-middle"></i>
                            {dataSource.statistics.committeeSites.female || 0}
                        </span>

                    </div>
                </Col>


                <Col xs={6} sm={3}>
                    <div className="p-3 border border-dashed border-start-0">
                        <h5 className="mb-1"><span className="counter-value">
                            <CountUp
                                start={0}
                                // end={electionStatistics?.committees?.total}
                                end={dataSource.statistics.committees.total || 0}

                                separator={","}
                                duration={2}
                            />
                        </span></h5>
                        <p className="text-muted mb-0">عدد اللجان الكلي</p>
                        <span class="badge bg-light text-info mb-0 fs-12">
                            <i class="ri-arrow-down-line align-middle"></i>
                            {dataSource.statistics.committees.male}
                        </span>
                        <span class="badge bg-light text-pink mb-0 fs-12">
                            <i class="ri-arrow-down-line align-middle"></i>
                            {dataSource.statistics.committees.female}
                        </span>

                    </div>
                </Col>
            </Row>
        </CardHeader>
    )
}

export default ElectorStatisticCounter
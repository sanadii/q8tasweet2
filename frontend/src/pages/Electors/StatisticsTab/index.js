import React, { useState, useEffect, useCallback } from "react";


// Redux & Selectors
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';

// Related
import useElectorDataSource from './useElectorDataSource';

// Components
import { ElectorSimpleBarChart, ElectorSimplePieChart, ElectorSimpleBubbleChart, ElectorMultipleHeatmap, MultipleHeatmap } from './Charts';
import ChartLeftSideBar from "./ChartSidebar";
import ElectorStatisticCounter from "./ElectorChartCounter";

// UI & UX
import { Row, Col, Card, CardHeader, CardBody, Button } from "reactstrap";
import classNames from 'classnames';

const StatisticsTab = () => {
    const { electionStatistics, electorsByFamily, electorsByArea,
        electorsByCommittee, electorsByCategories,
        electorsByBranchFamilies, electorsByFamilyBranch, electorsByFamilyBranchArea
    } = useSelector(electorSelector);

    const { electionDetails } = useSelector(electionSelector);
    const isElectorAddress = electionDetails?.isElectorAddress
    const isElectorCommittee = electionDetails?.isElectorCommittee

    const [viewState, setViewState] = useState({
        selectionFilters: {
            // for dispatching
            selectedFamilies: [],
            selectedBranches: [],
            selectedAreas: [],
            selectedCommittees: [],
        },
        viewSettings: {
            resultsToShow: "10",

            displayAllElectors: true,                         // options: true / false
            familyBranchOption: "branch",                      // Options:  branch, area, committee
            areaCommitteeOption: isElectorAddress ? "area" : "",                      // Options:  branch, area, committee

            displayByGender: false,
            reverseView: false,
            displayChartType: "bar",
        },
    });

    const { selectionFilters, viewSettings } = viewState;

    const dataSource = useElectorDataSource(viewState);

    return (
        <Row>
            <Col>
                <Card>
                    <CardHeader className="border-0">
                        <div className="align-items-center d-flex mb-2">
                            <h2 className="mb-0 flex-grow-1">إحصائيات الناخبين</h2>
                            <div className="d-flex gap-1">
                                {/* {Object.entries(dataSource).map(([key, value]) => (
                                    <Button
                                        key={key}
                                        className={classNames('btn btn-sm', {
                                            'btn-primary': viewSettings.xx === key,
                                            'btn-soft-secondary': viewSettings.xx !== key
                                        })}
                                        onClick={() => functionIfNeeded(key)}
                                    >
                                        {value.label}
                                    </Button>
                                ))} */}
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="chat-wrapper d-lg-flex mt-n4">
                            <ChartLeftSideBar
                                setViewState={setViewState}
                                viewState={viewState}
                            />
                            <div className="file-manager-content w-100 p-4 pb-0">
                                <ElectorStatisticCounter
                                    dataSource={dataSource}
                                    electionStatistics={electionStatistics}
                                />

                                {viewSettings.displayChartType === "bar" &&
                                    <ElectorSimpleBarChart
                                        dataSource={dataSource}
                                    />
                                }
                                {viewSettings.displayChartType === "pie" &&
                                    <ElectorSimplePieChart
                                        dataSource={dataSource}
                                    />
                                }

                                {/* <ElectorSimpleBubbleChart
                                    dataSource={dataSource}
                                    dataColors='["--vz-primary", "--vz-info", "--vz-warning", "--vz-success"]' /
                                    > */}
                                {viewSettings.displayChartType === "heatMap" &&
                                    <ElectorMultipleHeatmap
                                        dataSource={dataSource}
                                    />
                                }
                                <MultipleHeatmap dataColors='["--vz-primary", "--vz-secondary", "--vz-success", "--vz-info", "--vz-warning", "--vz-danger", "--vz-dark", "--vz-primary", "--vz-card-custom"]' />

                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default StatisticsTab;

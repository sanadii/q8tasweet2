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
        electorsByBranchFamilies, electorsByFamilyBranch, electorsByFamilyBranchArea } = useSelector(electorSelector);

    const [viewState, setViewState] = useState({
        selectionFilters: {
            selectedFamilies: [],
            selectedAreas: [],

            // for dispatching
            selectedFamily: null,
            selectedFamilyBranches: [],
            selectedFamilyBranchesAreas: [],
            selectedFamilyBranchesCommittees: [],
        },
        viewSettings: {
            resultsToShow: "10",
            displayChartType: "bar",

            displayAllElectors: true,                         // options: true / false
            familyBranchOption: "branch",                      // Options:  branch, area, committee
            areaCommitteeOption: "area",                      // Options:  branch, area, committee

            displayByGender: false,                         // options: true / false

            displayByOption: false,                           // Options:  true / false
            displayAllOption: "branch",                 // Options:  branch, area, committee
            displayWithOption: [],
            displaySeries: "all",                           // options: all, branch, area, committees
            activeView: 'electorsByFamily',
            swapView: false,
        },
        viewDetails: {
            activeFamilyView: "",
            activeAreaView: "",
            activeCommitteeView: ""
        }
        // All / Male/Female
    });

    const { selectionFilters, viewSettings, viewDetails } = viewState;

    // console.log("viewState.viewSettings.displaySeries: ", viewState.viewSettings.displaySeries)
    const dataSource = useElectorDataSource(
        viewState,
    );

    // console.log("dataSource:", dataSource)

    const handleViewChange = useCallback((viewType) => {
        setViewState(prev => ({
            ...prev,
            viewSettings: { ...prev.viewSettings, activeView: viewType }
        }));
    }, []);

    return (
        <Row>
            <Col>
                <Card>
                    <CardHeader className="border-0">
                        <div className="align-items-center d-flex mb-2">
                            <h2 className="mb-0 flex-grow-1">إحصائيات الناخبين</h2>
                            <div className="d-flex gap-1">
                                {Object.entries(dataSource).map(([key, value]) => (
                                    <Button
                                        key={key}
                                        className={classNames('btn btn-sm', {
                                            'btn-primary': viewSettings.activeView === key,
                                            'btn-soft-secondary': viewSettings.activeView !== key
                                        })}
                                        onClick={() => handleViewChange(key)}
                                    >
                                        {value.label}
                                    </Button>
                                ))}
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
                                    dataSource={dataSource[viewSettings.activeView]}
                                    electionStatistics={electionStatistics}
                                />

                                {viewSettings.displayChartType === "bar" && <ElectorSimpleBarChart
                                    dataSource={dataSource[viewSettings.activeView]}
                                />
                                }
                                {viewSettings.displayChartType === "pie" &&
                                    <ElectorSimplePieChart
                                        dataSource={dataSource[viewSettings.activeView]}
                                    />
                                }

                                {/* <ElectorSimpleBubbleChart
                                    dataSource={dataSource[viewSettings.activeView]}
                                    dataColors='["--vz-primary", "--vz-info", "--vz-warning", "--vz-success"]' /
                                    > */}
                                {viewSettings.displayChartType === "heatMap" &&
                                    <ElectorMultipleHeatmap
                                        dataSource={dataSource[viewSettings.activeView]}
                                    />
                                }
                                    <MultipleHeatmap dataColors='["--vz-primary", "--vz-secondary", "--vz-success", "--vz-info", "--vz-warning", "--vz-danger", "--vz-dark", "--vz-primary", "--vz-card-custom"]'/>

                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default StatisticsTab;

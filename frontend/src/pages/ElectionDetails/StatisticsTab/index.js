import React, { useState, useEffect, useCallback } from "react";


// Redux & Selectors
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';

// Related
import useElectorDataSource from './useElectorDataSource';

// Components
import { ElectorsOverviewCharts } from './Charts';
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

            // 
            selectedFamily: null,
            selectedFamilyBranches: [],
            selectedFamilyBranchesAreas: [],
            selectedFamilyBranchesCommittees: [],
        },
        viewSettings: {
            resultsToShow: "10",
            display: "all",                  // options: gender, all, branch, area, committees
            displaySeries: "all",                  // options: gender, all, branch, area, committees
            activeView: 'electorsByFamily',
        },
        viewDetails: {
            activeFamilyView: "",
            activeAreaView: "",
            activeCommitteeView: ""
        }
    });

    const { selectionFilters, viewSettings, viewDetails } = viewState;

    console.log("viewState.viewSettings.displaySeries: ", viewState.viewSettings.displaySeries)
    const dataSource = useElectorDataSource(
        viewState,
    );

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

                                <ElectorsOverviewCharts
                                    dataSource={dataSource[viewSettings.activeView]}
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default StatisticsTab;

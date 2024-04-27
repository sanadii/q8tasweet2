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
        electorsByBranchFamilies, electorsByFamilyBranches, electorsByFamilyDivision } = useSelector(electorSelector);

    const [viewState, setViewState] = useState({
        selectionFilters: {
            selectedFamilies: [],
            selectedAreas: [],

            // 
            selectedFamily: null,
            selectedFamilyBranches: [],
            selectedFamilyBranchesAreas: [],
        },
        displaySettings: {
            resultsToShow: "10",
            filterByGender: true,
            activeView: 'electorsByFamily',
        },
        viewDetails: {
            activeFamilyView: "",
            activeAreaView: "",
            activeCommitteeView: ""
        }
    });

    const { selectionFilters, displaySettings, viewDetails } = viewState;


    const dataSource = useElectorDataSource(
        electionStatistics,
        electorsByFamily,
        electorsByArea,
        electorsByCommittee,
        electorsByCategories,
        electorsByBranchFamilies, electorsByFamilyBranches,
        viewState,
    );

    const handleViewChange = useCallback((viewType) => {
        setViewState(prev => ({
            ...prev,
            displaySettings: { ...prev.displaySettings, activeView: viewType }
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
                                            'btn-primary': displaySettings.activeView === key,
                                            'btn-soft-secondary': displaySettings.activeView !== key
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
                                    dataSource={dataSource[displaySettings.activeView]}
                                    electionStatistics={electionStatistics}
                                />

                                <ElectorsOverviewCharts
                                    dataSource={dataSource[displaySettings.activeView]}
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

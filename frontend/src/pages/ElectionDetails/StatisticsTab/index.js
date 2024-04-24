import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';
import { useElectorData, useElectorDataSource } from "shared/hooks";  // Adjust the import path according to your project structure
import { Row, Col, Card, CardHeader, CardBody, Button } from "reactstrap";
import { ElectorsOverviewCharts } from './DashboardAnalyticsCharts';
import ElectorStatisticCounter from "./ElectorStatisticCounter";
import ChartLeftSideBar from "./ChartLeftSideBar";
import classNames from 'classnames';

const StatisticsTab = () => {
    const { electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee } = useSelector(electorSelector);
    const { election } = useSelector(electionSelector);

    const [options, setOptions] = useState({
        selected: {
            familyDivision: [],
            families: [],
            areas: [],
            resultsToDisplay: "10",
            resultByGender: true, // Ensure this is correctly set initially
            currentView: 'electorsByArea',
        },
        detailedChart: {
            familyChart: false,
            areaChart: false,
            committeeChart: false,
        }
    });
    

    // Destructure for easier access
    const { selected, detailedChart } = options;

    useElectorData(selected, election.slug);  // Assuming dispatch is used within the hook
    const dataSource = useElectorDataSource(electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee, selected, detailedChart);

    const handleChartTypeChange = useCallback((view) => {
        setOptions(prev => ({
            ...prev,
            selected: {
                ...prev.selected,
                currentView: view
            }
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
                                            'btn-primary px-5': selected.currentView === key,
                                            'btn-soft-secondary': selected.currentView !== key
                                        })}
                                        onClick={() => handleChartTypeChange(key)}
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
                                handleFamilySelectionChange={(type, option) => setOptions(prev => ({
                                    ...prev,
                                    selected: {
                                        ...prev.selected,
                                        [type]: option || [],
                                    },
                                    detailedChart: {
                                        ...prev.detailedChart,
                                        familyChart: true
                                    }
                                }))}
                                setOptions={setOptions}
                                options={options}
                            />
                            <div className="file-manager-content w-100 p-4 pb-0">
                                <ElectorStatisticCounter dataSource={dataSource[selected.currentView]} electionStatistics={electionStatistics} />
                                <ElectorsOverviewCharts dataSource={dataSource[selected.currentView]} />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default StatisticsTab;

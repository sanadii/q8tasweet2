import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';
import useElectorData from "./useElectorData";
import useElectorDataSource from "./useElectorDataSource";
import { Row, Col, Card, CardHeader, CardBody, Button } from "reactstrap";
import { ElectorsOverviewCharts } from './Charts';
import ElectorStatisticCounter from "./ChartCounter";
import ChartLeftSideBar from "./ChartSideBar";
import classNames from 'classnames';

import { useDispatch } from 'react-redux';
import { getElectorsByCategory, getElectorFamilyDivisions } from "store/actions";


const StatisticsTab = () => {
    const dispatch = useDispatch();

    const { electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee, electorsByCategories } = useSelector(electorSelector);
    const { election } = useSelector(electionSelector);

    const [options, setOptions] = useState({
        selected: {
            family: [],
            familyDivisions: [],
            families: [],
            areas: [],
            resultsToDisplay: "10",
            resultByGender: true, // Ensure this is correctly set initially
            currentView: 'electorsByFamily',
        },
        detailedChart: {
            familyChart: false,
            areaChart: false,
            committeeChart: false,
        }
    });

    // Destructure for easier access
    const { selected, detailedChart } = options;

    // useElectorData(selected, election.slug);  // Assuming dispatch is used within the hook
    const dataSource = useElectorDataSource(electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee, electorsByCategories, options);

    const handleChartTypeChange = useCallback((view) => {
        setOptions(prev => ({
            ...prev,
            selected: { ...prev.selected, currentView: view }
        }));
    }, []);

    const handleFamilySelectionChange = useCallback((type, selectedOptions) => {
        setOptions(prev => ({
            ...prev,
            selected: { ...prev.selected, [type]: selectedOptions || [] },
            detailedChart: { ...prev.detailedChart, familyChart: true }
        }));

    }, [setOptions]);

    useEffect(() => {
        const selectedFamilies = selected.families.map(option => option.value);
        const selectedAreas = selected.areas.map(option => option.value);

        // family_division
        const selectedFamily = selected.family.value;
        const selectedFamilyDivisions = selected.familyDivisions.map(option => option.value);
        // console.log("THE SELECTED family:", selectedFamily);

        if (selectedFamilies.length > 0 || selectedAreas.length > 0) {
            dispatch(getElectorsByCategory({
                slug: election.slug,
                families: selectedFamilies,
                areas: selectedAreas
            }));

        }

        if (selectedFamily) {
            // console.log("THE SELECTED families:", selectedFamilies);
            // console.log("THE SELECTED areas:", selectedAreas);
            console.log("THE SELECTED family: ", selectedFamily);
            // console.log("THE SELECTED: dispatch(getElectorsFamilyDivisions");

            const electorData = {
                slug: election.slug,
                family: selectedFamily

            }
            dispatch(getElectorFamilyDivisions(electorData));
        }

    }, [selected]);  // Make sure this logs the updated state


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
                                handleFamilySelectionChange={handleFamilySelectionChange}
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

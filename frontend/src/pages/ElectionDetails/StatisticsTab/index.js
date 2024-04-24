import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';
import { getElectorsByCategory } from "store/actions";

import { Row, Col, Card, CardHeader, CardBody, Label, Input, Button } from "reactstrap";
import Select from "react-select";

import { ElectorsOverviewCharts } from './DashboardAnalyticsCharts';
import ElectorStatisticCounter from "./ElectorStatisticCounter";
import ChartLeftSideBar from "./ChartLeftSideBar"

const StatisticsTab = () => {
    const dispatch = useDispatch();
    const { electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee, electorsByCategories } = useSelector(electorSelector);
    const { election } = useSelector(electionSelector);

    const [selectedOptions, setSelectedOptions] = useState({
        family: [],
        family_division: [],
        families: [],
        areas: [],
        resultsToDisplay: "10",
        resultByGender: true,
        currentView: 'electorsByAreas'
    });

    const areaCategories = electorsByCategories?.areaCategories;
    const areaDataSeries = electorsByCategories?.areaDataSeries;
    const familyCategories = electorsByCategories?.familyCategories;
    const familyDataSeries = electorsByCategories?.familyDataSeries;

    // Use useMemo to compute the top 20 families only once when electorsByFamily changes
    const electorsBy20Family = useMemo(() => electorsByFamily.slice(0, 20), [electorsByFamily]);


    console.log("AAA areaDataSeries: ", areaDataSeries)
    console.log("AAA familyDataSeries: ", familyDataSeries)
    const dataSource = useMemo(() => ({
        electorsByFamilyArea: {
            period: 'electorsByFamilyArea',
            label: 'مفصل',
            statistics: electionStatistics,
            categories: (selectedOptions.resultByGender ? familyCategories : areaCategories) || [],
            series: (selectedOptions.resultByGender ? areaDataSeries : familyDataSeries) || [],
            colors: selectedOptions.resultByGender ? ['var(--vz-info)', 'var(--vz-pink)'] : ['var(--vz-success)'],
        },
        electorsByFamily: {
            period: 'electorsByFamily',
            label: 'العائلة - القبيلة',
            statistics: electionStatistics,
            categories: electorsBy20Family.map(elector => elector.category) || [],
            series: selectedOptions.resultByGender ? [{
                name: "رجال",
                data: electorsBy20Family.map(elector => elector.male) || []
            }, {
                name: "نساء",
                data: electorsBy20Family.map(elector => elector.female) || []
            }] : [{
                name: "الناخبين",
                data: electorsBy20Family.map(elector => elector.total) || []
            }],
            colors: selectedOptions.resultByGender ? ['var(--vz-info)', 'var(--vz-pink)'] : ['var(--vz-success)'],
        },
        electorsByAreas: {
            period: 'electorsByAreas',
            label: 'المناطق السكنية',
            statistics: electionStatistics,
            categories: electorsByArea.map(elector => elector.category) || [],
            series: selectedOptions.resultByGender ? [
                { name: "رجال", data: electorsByArea.map(elector => elector.male) || [] },
                { name: "نساء", data: electorsByArea.map(elector => elector.female) || [] }]
                :
                [{ name: "الناخبين", data: electorsByArea.map(elector => elector.total) || [] }],
            colors: selectedOptions.resultByGender ? ['var(--vz-info)', 'var(--vz-pink)'] : ['var(--vz-success)'],
        },
        electorsByCommittees: {
            period: 'electorsByCommittees',
            label: 'اللجان الإنتخابية',
            statistics: electionStatistics,
            categories: electorsByCommittee.map(elector => elector.category) || [],
            series: selectedOptions.resultByGender ? [{
                name: "رجال",
                data: electorsByCommittee.map(elector => elector.male) || []
            }, {
                name: "نساء",
                data: electorsByCommittee.map(elector => elector.female) || []
            }] : [{
                name: "الناخبين",
                data: electorsByCommittee.map(elector => elector.total) || []
            }],
            colors: selectedOptions.resultByGender ? ['var(--vz-info)', 'var(--vz-pink)'] : ['var(--vz-success)'],
        }
    }), [selectedOptions.resultByGender, electorsByFamily, electorsByCategories]);

    const onChangeElectorChartType = useCallback((period) => {
        setSelectedOptions(prev => ({ ...prev, currentView: period }));
    }, []);

    const handleSelectionChange = useCallback((type, view = 'currentView') => (selectedOptions) => {
        setSelectedOptions(prev => {
            const update = { ...prev, [type]: selectedOptions || [] };

            // Conditionally update the `view` if necessary
            if (prev[view] !== 'electorsByFamilyArea') {
                update[view] = 'electorsByFamilyArea';
            }

            return update;
        });
    }, []);


    useEffect(() => {
        // Assuming that you need to dispatch some action when these values change
        if (selectedOptions.families.length || selectedOptions.areas.length || selectedOptions.family) {
            dispatch(getElectorsByCategory({
                slug: election.slug,
                family: selectedOptions.family.map(opt => opt.value),
                families: selectedOptions.families.map(opt => opt.value),
                areas: selectedOptions.areas.map(opt => opt.value),
            }));
        }
    }, [selectedOptions, dispatch, election.slug]); // Reacting to changes in selectedOptions


    console.log("selectedOptions: ", selectedOptions)
    return (
        <Row>
            <Col>
                <Card>
                    <CardHeader className="border-0">
                        <div className="align-items-center d-flex mb-2">
                            <h2 className="card-title mb-0 flex-grow-1">إحصائيات شاملة</h2>
                            <div className="d-flex gap-1">
                                {Object.entries(dataSource).map(([key, value], index) => (
                                    <Button
                                        key={index}
                                        type="button"
                                        className={`btn ${selectedOptions.currentView === key ? 'btn-primary' : 'btn-soft-secondary'} btn-sm`}
                                        onClick={() => onChangeElectorChartType(key)}
                                    >
                                        {value.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="chat-wrapper d-lg-flex mx-n4 mt-n4 p-1">
                            <ChartLeftSideBar
                                handleSelectionChange={handleSelectionChange}
                                setSelectedOptions={setSelectedOptions}
                                selectedOptions={selectedOptions}
                            />
                            <div className="file-manager-content w-100 p-4 pb-0">
                                <ElectorStatisticCounter
                                    dataSource={dataSource[selectedOptions.currentView]}
                                    electionStatistics={electionStatistics}
                                />
                                <ElectorsOverviewCharts
                                    dataSource={dataSource[selectedOptions.currentView]}
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row >
    );
};

export default StatisticsTab;

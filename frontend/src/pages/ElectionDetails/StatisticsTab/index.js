import React, { useState, useEffect, useMemo } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';
import { getElectorsByCategory } from "store/actions";

// Related Components
import { ElectorsOverviewCharts } from './DashboardAnalyticsCharts';
import ElectorStatisticCounter from "./ElectorStatisticCounter"

// UI&UX
import { Row, Col, Card, CardHeader, CardBody, Label, Input } from "reactstrap";
import Select from "react-select";

const StatisticsTab = () => {
    const dispatch = useDispatch();

    const { electionStatistics, electorsByCategories, electorsByFamily, electorsByFamilyArea, electorsByArea, electorsByCommittee } = useSelector(electorSelector)
    const { election } = useSelector(electionSelector)
    const [resultsToDisplay, setResultsToDisplay] = useState("10")
    const [resultByGender, setResultByGender] = useState(true)
    const [selectedFamilies, setSelectedFamilies] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [familyAreaView, setFamilyAreaView] = useState("familyArea");


    // Details FamilyArea
    const areaCategories = electorsByCategories?.areaCategories;
    const areaDataSeries = electorsByCategories?.areaDataSeries;
    const areaFamilyDataSeries = electorsByCategories?.areaFamilyDataSeries;
    const areaFamilyDataSeriesTotal = electorsByCategories?.areaFamilyDataSeries?.total;

    const familyCategories = electorsByCategories?.familyCategories;
    const familyDataSeries = electorsByCategories?.familyDataSeries;
    const familyAreaDataSeries = electorsByCategories?.familyAreaDataSeries;
    const familyAreaDataSeriesTotal = electorsByCategories?.familyAreaDataSeries?.total;

    // let electorsByCommitteeDataSeries;

    // useEffect(() => {
    //     // Check if electorsByFamilyArea is not empty
    //     if (familyAreaView === "familyArea") {
    //         electorsByCommitteeDataSeries = familyAreaDataSeries
    //     } else {
    //         electorsByCommitteeDataSeries = areaFamilyDataSeries

    //     }
    // }, [electorsByCategories]);



    // const electorsByCategoriesSeries = electorsByCategories?.electorsByFamily

    console.log("electorsByFamilyArea:", electorsByFamilyArea)

    const [chartInfo, setChartInfo] = useState({
        type: 'byFamily',
        // dataSeries: electorsByFamilyArea
        dataSeries: electorsByFamily
    });

    const chartElectorButtons = [
        { period: 'byFamily', label: 'العائلة - القبيلة', dataSeries: electorsByFamily },
        { period: 'byArea', label: 'المناطق السكنية', dataSeries: electorsByArea },
        // { period: 'byCommittee', label: 'اللجان الإنتخابية', dataSeries: electorsByCommitteeDataSeries },
        { period: 'byFamilyArea', label: 'مفصل', dataSeries: electorsByCommittee },

    ];


    const familyOptions = useMemo(() => (
        electorsByFamily.map(elector => ({ label: `${elector.category} - ${elector.total} ناخب`, value: elector.category }))
    ), [electorsByFamily]);

    const areaOptions = useMemo(() => (
        electorsByArea.map(elector => ({ label: `${elector.category} - ${elector.total} ناخب`, value: elector.category }))
    ), [electorsByArea]);


    const onChangeElectorChartType = (button) => {
        setChartInfo({
            type: button.period,
            dataSeries: button.dataSeries
        });
    };

    console.log("electorsByFamilyArea: ", electorsByFamilyArea)

    useEffect(() => {
        const familyValues = selectedFamilies.map(option => option.value);
        const areaValues = selectedAreas.map(option => option.value);
        if (familyValues.length || areaValues.length) {
            dispatch(getElectorsByCategory({ slug: election.slug, families: familyValues, areas: areaValues }));
        }

    }, [selectedFamilies, selectedAreas, resultsToDisplay, election.slug, dispatch]);

    useEffect(() => {
        // Check if electorsByFamilyArea is not empty
        if (Object.keys(electorsByFamilyArea).length > 0) {
            // Run your code here
            // setChartInfo({
            //     type: 'byFamilyArea',
            //     dataSeries: electorsByFamilyArea,
            // });
        }
    }, [electorsByFamilyArea]); // Run effect when electorsByFamilyArea changes



    const handleFamilySelection = (selectedOptions) => {
        setSelectedFamilies(selectedOptions || []);
    };

    const handleAreaSelection = (selectedOptions) => {
        setSelectedAreas(selectedOptions || []);
    };

    const handleNumberToDisplayChange = (event) => {
        setResultsToDisplay(event.target.value);
    };

    const handleGenderDisplayChange = (event) => {
        setResultByGender(event.target.checked);
    };



    return (
        <React.Fragment>
            <Row>
                <Card>
                    <CardHeader className="border-0  ">
                        <div className="align-items-center d-flex mb-2">
                            <h2 className="card-title mb-0 flex-grow-1">إحصائيات شاملة</h2>
                            <div className="d-flex gap-1">
                                {chartElectorButtons.map((button, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`btn ${chartInfo.type === button.period ? 'btn-primary' : 'btn-soft-secondary'} btn-sm`}
                                        onClick={() => onChangeElectorChartType(button)}
                                    >
                                        {button.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="chat-wrapper d-lg-flex mx-n4 mt-n4 p-1">
                            <div className="chat-leftsidebar bg-light">
                                <div className="px-2 pt-2 mb-2">
                                    {/* Display Category */}
                                    <div className="mb-3">
                                        <h4>طريقة العرض</h4>

                                    </div>
                                    <div className="mt-3 mt-sm-0">

                                        {/* Selections */}
                                        <Label>القبائل</Label>
                                        <Select
                                            value={selectedFamilies}
                                            isMulti={true}
                                            onChange={(e) => {
                                                handleFamilySelection(e);
                                            }}
                                            options={familyOptions}
                                            classNamePrefix="js-example-basic-multiple mb-0"
                                        // styles={customStyles}
                                        />

                                        <Label>المناطق</Label>
                                        <Select
                                            value={selectedAreas}
                                            isMulti={true}
                                            onChange={(e) => {
                                                handleAreaSelection(e);
                                            }}
                                            options={areaOptions}
                                            classNamePrefix="js-example-basic-multiple mb-0"
                                        // styles={customStyles}
                                        />
                                    </div>


                                    {/* OnOff & Pagination */}
                                    <h4>طريقة العرض</h4>

                                    <div className="form-check form-switch form-check-right form-switch-sm">
                                        <Input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="flexSwitchCheckRightDisabled"
                                            checked={resultByGender}
                                            onChange={handleGenderDisplayChange}
                                        />
                                        <Label className="form-check-label" for="flexSwitchCheckRightDisabled">النوع</Label>
                                    </div>
                                    <select
                                        className="form-select w-25"
                                        aria-label="Default select example"
                                        onChange={handleNumberToDisplayChange}
                                        value={resultsToDisplay}
                                    >
                                        <option disabled>العرض</option>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="25">25</option>
                                    </select>
                                </div>
                            </div>
                            <div className="file-manager-content w-100 p-4 pb-0">
                                {electionStatistics &&
                                    <ElectorStatisticCounter
                                        electionStatistics={electionStatistics} />
                                }
                                <CardBody className="p-0 pb-2">
                                    <div>
                                        <div dir="ltr" className="apex-charts">
                                            <ElectorsOverviewCharts
                                                electorsByCategories={electorsByCategories}
                                                resultByGender={resultByGender}
                                                resultsToDisplay={resultsToDisplay}
                                                dataSeries={chartInfo.dataSeries}
                                            />
                                        </div>
                                    </div>
                                </CardBody>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Row>
        </React.Fragment >
    );
};

export default StatisticsTab;

import React, { useState, useEffect, useMemo } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';
import { getElectorsByCategory } from "store/actions";

// Related Components
import { ElectorsOverviewCharts } from './Charts';
import ElectorStatisticCounter from "./ElectorChartCounter"

// UI&UX
import { Row, Col, Card, CardHeader, CardBody, Label, Input } from "reactstrap";
import Select from "react-select";

const StatisticsTab = () => {
    const dispatch = useDispatch();

    const { electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee, electorsByCategories, electorsByFamiliesArea } = useSelector(electorSelector)
    const { election } = useSelector(electionSelector)
    const [resultsToDisplay, setResultsToDisplay] = useState("10")
    const [resultByGender, setResultByGender] = useState(true)
    const [selectedFamilies, setSelectedFamilies] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [familyAreaView, setFamilyAreaView] = useState("familyArea");





    //     categories: slicedSeries.map(elector => elector.category),
    //     series: resultByGender ? resultsByCategory : resultTotal,
    //     datacolors: resultByGender ? ['var(--vz-info)', 'var(--vz-pink)'] : ['var(--vz-success)'],

    // let electorsByCommitteeDataSeries;

    // useEffect(() => {
    //     // Check if electorsByFamiliesArea is not empty
    //     if (familyAreaView === "familyArea") {
    //         electorsByCommitteeDataSeries = familyAreaDataSeries
    //     } else {
    //         electorsByCommitteeDataSeries = areaFamilyDataSeries

    //     }
    // }, [electorsByCategories]);



    // const electorsByCategoriesSeries = electorsByCategories?.electorsByFamily

    // console.log("electorsByFamiliesArea:", electorsByFamiliesArea)

    const [chartInfo, setChartInfo] = useState({
        type: 'byFamily',
        // dataSeries: electorsByFamiliesArea
        dataSeries: electorsByFamily
    });






    const resultTotal = [
        { name: "الناخبين", data: electorsByCommittee.map(elector => elector.total) }
    ]
    const resultsByCategory = [
        { name: "رجال", data: electorsByCommittee.map(elector => elector.male) },
        { name: "نساء", data: electorsByCommittee.map(elector => elector.female) }
    ]



    // Details FamilyArea
    const areaCategories = electorsByCategories?.areaCategories;
    const areaDataSeries = electorsByCategories?.areaDataSeries;
    const areaFamilyDataSeries = electorsByCategories?.areaFamilyDataSeries;
    const areaFamilyDataSeriesTotal = electorsByCategories?.areaFamilyDataSeries?.total;

    const familyCategories = electorsByCategories?.familyCategories;
    const familyDataSeries = electorsByCategories?.familyDataSeries;
    const familyAreaDataSeries = electorsByCategories?.familyAreaDataSeries;
    const familyAreaDataSeriesTotal = electorsByCategories?.familyAreaDataSeries?.total;

    const dataSource = {
        electorsByFamiliesArea: {
            // statistics: "12",
            categories: resultByGender ? familyCategories : areaCategories,
            series: resultByGender ? areaFamilyDataSeries : familyAreaDataSeries,
            colors: resultByGender ? ['var(--vz-info)', 'var(--vz-pink)'] : ['var(--vz-success)'],
        },

        electorsByFamily: {
            statistics: electionStatistics,
            categories: electorsByCommittee.map(elector => elector.category),
            series: resultByGender ? resultsByCategory : resultTotal,
            colors: resultByGender ? ['var(--vz-info)', 'var(--vz-pink)'] : ['var(--vz-success)'],
        }
    };

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

    // console.log("electorsByFamiliesArea: ", electorsByFamiliesArea)

    useEffect(() => {
        const familyValues = selectedFamilies.map(option => option.value);
        const areaValues = selectedAreas.map(option => option.value);
        if (familyValues.length || areaValues.length) {
            dispatch(getElectorsByCategory({ slug: election.slug, families: familyValues, areas: areaValues }));
        }

    }, [selectedFamilies, selectedAreas, resultsToDisplay, election.slug, dispatch]);

    useEffect(() => {
        // Check if electorsByFamiliesArea is not empty
        if (Object.keys(electorsByFamiliesArea).length > 0) {
            // Run your code here
            // setChartInfo({
            //     type: 'byFamilyArea',
            //     dataSeries: electorsByFamiliesArea,
            // });
        }
    }, [electorsByFamiliesArea]); // Run effect when electorsByFamiliesArea changes

    const chartElectorButtons = [
        { period: 'byFamily', label: 'العائلة - القبيلة', dataSource: dataSource.electorsByFamily },
        { period: 'byArea', label: 'المناطق السكنية', dataSource: dataSource.electorsByArea },
        { period: 'byCommittee', label: 'اللجان الإنتخابية', dataSource: dataSource.electorsByCommittee },
        { period: 'byFamilyArea', label: 'مفصل', dataSource: dataSource.electorsByFamiliesArea },

    ];


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


    console.log("dataSource areaFamilyDataSeries: ", dataSource)
    // console.log("dataSource electorsByCommittee: ", electorsByCommittee)


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
                                {dataSource && dataSource.statistics &&
                                    <ElectorStatisticCounter
                                        dataSource={dataSource}
                                        electionStatistics={electionStatistics} />
                                }
                                <CardBody className="p-0 pb-2">
                                    <div>
                                        <div dir="ltr" className="apex-charts">
                                            <ElectorsOverviewCharts
                                                electorsByCategories={electorsByCategories}
                                                resultByGender={resultByGender}
                                                resultsToDisplay={resultsToDisplay}
                                                dataSource={dataSource}
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
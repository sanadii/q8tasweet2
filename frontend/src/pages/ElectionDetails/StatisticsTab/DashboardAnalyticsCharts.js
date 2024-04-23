import React from 'react';
import ReactApexChart from "react-apexcharts";

import { getChartColorsArray } from "shared/components";


const ElectorsOverviewCharts = ({ electorsByCategories, electorsByFamilyArea, resultsToDisplay, resultByGender, dataSeries }) => {


    console.log("electorsByCategories: ", electorsByCategories)    // get the number of results to display

    // Calculate the slice endpoint based on the length of dataSeries
    const sliceEndpoint = Math.min(resultsToDisplay, dataSeries.length);

    // Slice the dataSeries array
    const slicedSeries = dataSeries.slice(0, sliceEndpoint);
    const categories = slicedSeries.map(elector => elector.category);

    const totalCount = slicedSeries.map(elector => elector.total);
    const maleCount = slicedSeries.map(elector => elector.male);
    const femaleCount = slicedSeries.map(elector => elector.female);


    // Details FamilyArea
    const areaCategories = electorsByCategories?.areaCategories;
    const areaDataSeries = electorsByCategories?.areaDataSeries;
    const areaFamilyDataSeries = electorsByCategories?.areaFamilyDataSeries;
    const areaFamilyDataSeriesTotal = electorsByCategories?.areaFamilyDataSeries?.total;

    const familyCategories = electorsByCategories?.familyCategories;
    const familyDataSeries = electorsByCategories?.familyDataSeries;
    const familyAreaDataSeries = electorsByCategories?.familyAreaDataSeries;
    const familyAreaDataSeriesTotal = electorsByCategories?.familyAreaDataSeries?.total;



    // General Settings
    const resultTotal = [
        { name: "الناخبين", data: totalCount }
    ]
    const resultsByCategory = [
        { name: "رجال", data: maleCount },
        { name: "نساء", data: femaleCount }
    ]

    const selecteData = {
        totalElectors: "12",
        totalCommittees: "12",
        totalAreas: "12",
        totalCommitteeSites: "12",
        categories: resultByGender ? familyCategories : areaCategories,
        series: resultByGender ? areaFamilyDataSeries : familyAreaDataSeries,
        datacolors: resultByGender ? ['var(--vz-info)', 'var(--vz-pink)'] : ['var(--vz-success)'],
    };

    // const selecteData = {
    //     categories: slicedSeries.map(elector => elector.category),
    //     series: resultByGender ? resultsByCategory : resultTotal,
    //     datacolors: resultByGender ? ['var(--vz-info)', 'var(--vz-pink)'] : ['var(--vz-success)'],
    // };


    var options = {
        chart: {
            height: 374,
            type: 'bar', // Set the chart type to bar
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '30%',
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toString();
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },
        xaxis: {
            categories: selecteData.categories,
        },
        yaxis: {
            title: {
                text: 'Count'
            },
        },
        grid: {
            borderColor: '#f1f1f1',
        },
        colors: selecteData.dataColors,
    };

    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                options={options}
                series={selecteData.series} // Ensure series data is correctly structured
                type="bar"
                height="374"
                className="apex-charts"
            />
        </React.Fragment>
    );
};



const FamilyCharts = ({ electorsByFamily, dataColors }) => {

    const slicedElectors = electorsByFamily.slice(0, 10);

    const seriesData = slicedElectors.map(elector => elector.count);
    const familyNames = slicedElectors.map(elector => elector.lastName);

    console.log("seriesData: ", seriesData)
    console.log("familyNames: ", familyNames)

    const series = [{
        name: "Count",
        data: seriesData
    }];

    var barchartCountriesColors = getChartColorsArray(dataColors);

    var options = {
        chart: {
            type: 'bar',
            height: 436,
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,  // Set to false for vertical bars
                distributed: true,
            }
        },
        colors: barchartCountriesColors,
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
                fontWeight: 400,
                colors: ['#adb5bd']
            }
        },
        legend: {
            show: false,
        },
        grid: {
            show: false,
        },
        xaxis: {
            categories: familyNames,
        },
    };

    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                options={options}
                series={series}
                type="bar"
                height="436"
                className="apex-charts"
            />
        </React.Fragment>
    );
};




export { ElectorsOverviewCharts, FamilyCharts, };
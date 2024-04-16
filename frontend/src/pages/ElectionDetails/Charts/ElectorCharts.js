import React from "react";
import ReactApexChart from "react-apexcharts";
import { getChartColorsArray } from "shared/components";

const ElectorsByFamilyPieChart = ({ electorsByFamily }) => {

    // Take first 19 families
    const slicedElectors = electorsByFamily.slice(0, 19);

    // Extract data for the first 19 families
    const seriesData = slicedElectors.map((family) => family.count);
    const familyNames = slicedElectors.map((family) => family.lastName);

    // Sum the rest of the families' counts
    const othersCount = electorsByFamily.slice(19).reduce((acc, family) => acc + family.count, 0);

    // Add 'Others' to the seriesData and familyNames arrays
    seriesData.push(othersCount);
    familyNames.push('Others');

    // Get the chart colors
    const dataColors = '["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info","--vz-gray","--vz-pink","--vz-purple","--vz-secondary", "--vz-dark"]';
    var BasicColors = getChartColorsArray(dataColors);

    // Prepare the series object for the chart
    const series = [{
        data: seriesData
    }];

    // Prepare the options object for the chart
    const options = {
        chart: {
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: BasicColors,
        grid: {
            borderColor: "#f1f1f1",
        },
        xaxis: {
            categories: familyNames,
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                className="apex-charts"
                options={options}
                series={series}
                type="bar"
                height={350}
            />
        </React.Fragment>
    );
};



const ElectorsByAreaPieChart = ({ electorsByArea }) => {
    console.log("electorsByArea: ", electorsByArea)
    // Extract data for the first 19 families
    const seriesData = electorsByArea.map((area) => area.count);
    const areaNames = electorsByArea.map((area) => area.area);

    // Get the chart colors
    const dataColors = '["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info","--vz-gray","--vz-pink","--vz-purple","--vz-secondary", "--vz-dark"]';
    var BasicColors = getChartColorsArray(dataColors);

    // Prepare the series object for the chart
    const series = [{
        data: seriesData
    }];

    // Prepare the options object for the chart
    const options = {
        chart: {
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: BasicColors,
        grid: {
            borderColor: "#f1f1f1",
        },
        xaxis: {
            categories: areaNames,
        }
    };

    if (!electorsByArea) {
        return <p>Loading electors data...</p>; // Or display a loading indicator
    }


    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                className="apex-charts"
                options={options}
                series={series}
                type="bar"
                height={350}
            />
        </React.Fragment>
    );
};


// const ElectorsByFamilyPieChart = ({ electionCandidates }) => {

//     const maleCandidates = electionCandidates.filter((candidate) => candidate.gender === 1).length;
//     const femaleCandidates = electionCandidates.filter((candidate) => candidate.gender === 2).length;

//     const dataColors = '["--vz-info", "--vz-pink"]'

//     var chartdonutBasicColors = getChartColorsArray(dataColors);
//     const series = [maleCandidates, femaleCandidates];
//     var options = {
//       labels: [`رجال ${maleCandidates}`, `نساء ${femaleCandidates}`],
//       chart: {
//         height: 333,
//         type: "donut",
//       },
//       legend: {
//         position: "bottom",
//       },
//       stroke: {
//         show: false,
//       },
//       dataLabels: {
//         dropShadow: {
//           enabled: false,
//         },
//       },
//       colors: chartdonutBasicColors,
//     };
//     return (
//       <React.Fragment>
//         <ReactApexChart dir="ltr" options={options} series={series} type="donut" height="333" className="apex-charts" />
//       </React.Fragment>
//     );
//   };
export { ElectorsByFamilyPieChart, ElectorsByAreaPieChart };

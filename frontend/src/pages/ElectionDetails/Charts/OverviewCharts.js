import React from 'react';
import ReactApexChart from "react-apexcharts";
import { getChartColorsArray } from "shared/components";

const ElectionCandidatesByGender = ({ electionCandidates }) => {

    const maleCandidates = electionCandidates.filter((candidate) => candidate.gender === 1).length;
    const femaleCandidates = electionCandidates.filter((candidate) => candidate.gender === 2).length;
    const dataColors = '["--vz-primary", "--vz-pink"]'


    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = [maleCandidates, femaleCandidates]
    var options = {
        chart: {
            height: 300,
            type: 'pie',
        },
        labels: [`رجال ${maleCandidates}`, `نساء ${femaleCandidates}`],
        legend: {
            position: 'bottom'
        },
        dataLabels: {
            dropShadow: {
                enabled: false,
            }
        },
        colors: chartPieBasicColors
    };
    return (
        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={series}
            options={options}
            type="pie"
            height={300}
        />
    )
}

const ElectionVotersByGender = ({ electionMaleVoters, electionFemaleVoters }) => {
    // Convert values to numbers if they are not already numbers
    const maleVoters = isNaN(electionMaleVoters) ? 0 : Number(electionMaleVoters);
    const femaleVoters = isNaN(electionFemaleVoters) ? 0 : Number(electionFemaleVoters);

    const dataColors = '["--vz-primary", "--vz-pink"]';
    var chartPieBasicColors = getChartColorsArray(dataColors);

    const series = [maleVoters, femaleVoters]
    var options = {
        chart: {
            height: 300,
            type: 'pie',
        },
        labels: [`رجال ${maleVoters}`, `نساء ${femaleVoters}`],
        legend: {
            position: 'bottom'
        },
        dataLabels: {
            dropShadow: {
                enabled: false,
            }
        },
        colors: chartPieBasicColors
    };
    return (
        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={series}
            options={options}
            type="pie"
            height={300}
        />
    )
}

export {

    ElectionCandidatesByGender,
    ElectionVotersByGender,
}
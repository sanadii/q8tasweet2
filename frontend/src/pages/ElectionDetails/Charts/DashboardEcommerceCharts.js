import React from "react";
import ReactApexChart from "react-apexcharts";
import { getChartColorsArray } from "shared/components";

const ElectionCandidatesByGender = ({ electionCandidates }) => {

  const maleCandidates = electionCandidates.filter((candidate) => candidate.gender === 1).length;
  const femaleCandidates = electionCandidates.filter((candidate) => candidate.gender === 2).length;

  const dataColors = '["--vz-info", "--vz-pink"]'

  var chartdonutBasicColors = getChartColorsArray(dataColors);
  const series = [maleCandidates, femaleCandidates];
  var options = {
    labels: [`رجال ${maleCandidates}`, `نساء ${femaleCandidates}`],
    chart: {
      height: 333,
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
    colors: chartdonutBasicColors,
  };
  return (
    <React.Fragment>
      <ReactApexChart dir="ltr" options={options} series={series} type="donut" height="333" className="apex-charts" />
    </React.Fragment>
  );
};

const ElectionVotersByGender = ({
  electionMaleVoters,
  electionFemaleVoters
}) => {

  const dataColors = '["--vz-info", "--vz-pink"]'

  var chartdonutBasicColors = getChartColorsArray(dataColors);
  const series = [electionMaleVoters, electionFemaleVoters];
  var options = {
    labels: [`رجال ${parseInt(electionMaleVoters)}`, `نساء ${parseInt(electionFemaleVoters)}`],
    chart: {
      height: 333,
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
    colors: chartdonutBasicColors,
  };
  return (
    <React.Fragment>
      <ReactApexChart dir="ltr"
        options={options}
        series={series}
        type="donut"
        height="333"
        className="apex-charts"
      />
    </React.Fragment>
  );
};



export {
  ElectionCandidatesByGender,
  ElectionVotersByGender,

  // ElectionVotersByGender, AttendeesGroupes 
};

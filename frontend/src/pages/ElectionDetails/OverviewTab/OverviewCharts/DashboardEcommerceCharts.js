import React from "react";
import ReactApexChart from "react-apexcharts";
import { getChartColorsArray } from "shared/components";

// const ElectionCandidatesByGender = ({ electionCandidates }) => {

//   const maleCandidates = electionCandidates.filter((candidate) => candidate.gender === 1).length;
//   const femaleCandidates = electionCandidates.filter((candidate) => candidate.gender === 2).length;

//   const dataColors = '["--vz-info", "--vz-pink"]'

//   var chartDonutBasicColors = getChartColorsArray(dataColors);
//   const series = [maleCandidates, femaleCandidates];
//   var options = {
//     labels: [`رجال ${maleCandidates}`, `نساء ${femaleCandidates}`],
//     chart: {
//       height: 333,
//       type: "donut",
//     },
//     legend: {
//       position: "bottom",
//     },
//     stroke: {
//       show: false,
//     },
//     dataLabels: {
//       dropShadow: {
//         enabled: false,
//       },
//     },
//     colors: chartDonutBasicColors,
//   };
//   return (
//     <React.Fragment>
//       <ReactApexChart dir="ltr" options={options} series={series} type="donut" height="333" className="apex-charts" />
//     </React.Fragment>
//   );
// };

const ElectionVotersByGender = ({
  electionMaleVoters,
  electionFemaleVoters
}) => {

  const dataColors = '["--vz-info", "--vz-pink"]'

  var chartDonutBasicColors = getChartColorsArray(dataColors);
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
    colors: chartDonutBasicColors,
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


// const AttendeesGroupes = ({ dataColors }) => {
const AttendeesGroupes = ({ dataColors }) => {
  var chartGroupbarColors = getChartColorsArray(dataColors);
  const series = [
    {
      data: [44, 55, 41, 64, 22, 43, 21],
    },
    {
      data: [53, 32, 33, 52, 13, 44, 32],
    },
  ];

  var options = {
    chart: {
      type: 'bar',
      height: 410,
      toolbar: {
        show: false,
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    tooltip: {
      shared: true,
      intersect: false
    },
    xaxis: {
      categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
    },
    colors: chartGroupbarColors
  };
  return (
    <React.Fragment>
      <ReactApexChart dir="ltr"
        className="apex-charts"
        options={options}
        series={series}
        type="bar"
        height={410}
      />
    </React.Fragment>
  );
};




export { ElectionVotersByGender, AttendeesGroupes };

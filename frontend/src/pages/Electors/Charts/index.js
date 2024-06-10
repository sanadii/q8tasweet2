import React from 'react';
import ReactApexChart from "react-apexcharts";

//Import images
// import smallImage1 from 'assets/images/small/img-1.jpg';
// import smallImage2 from 'assets/images/small/img-2.jpg';
// import smallImage3 from 'assets/images/small/img-3.jpg';
// import smallImage4 from 'assets/images/small/img-4.jpg';

import { getChartColorsArray } from "shared/components";

const CandidateGenderPieChart = ({ electionCandidates }) => {

    const chartWidth = "250";
    const chartHeight = "250";
    const dataColors = '["--vz-info", "--vz-pink"]';


    const maleCandidates = electionCandidates.filter(
        (candidate) => candidate.gender === 1
    ).length;
    const femaleCandidates = electionCandidates.filter(
        (candidate) => candidate.gender === 2
    ).length;

    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = [maleCandidates, femaleCandidates]
    var options = {
        chart: {
            height: 100,
            type: 'pie',
        },
        labels: ['رجال', 'نساء'],
        legend: {
            position: 'bottom',
            show: true
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
            width={chartWidth}
            height={chartHeight}

        />
    )
}

const VoterAttendanceChart = () => {

    const dataColors = '["--vz-primary", "--vz-success"]'

    var chartColumnColors = getChartColorsArray(dataColors);
    const series = [
        {
            name: "Net Profit",
            data: [46, 57,],
        },
        {
            name: "Revenue",
            data: [74, 83,],
        },

    ];

    var options: any = {
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        colors: chartColumnColors,
        xaxis: {
            categories: ['Feb', 'Mar',],
        },
        yaxis: {
            title: {
                text: '$ (thousands)'
            }
        },
        grid: {
            borderColor: '#f1f1f1',
        },
        fill: {
            opacity: 1

        },
        tooltip: {
            y: {
                formatter: function (val: any) {
                    return "$ " + val + " thousands";
                }
            }
        }
    };


    return (
        <ReactApexChart dir="ltr" className="apex-charts"
            series={series}
            options={options}
            type="bar"
            height={350}
        />
    );
};

const SimplePie = ({ dataColors, chartWidth, chartHeight, maleCandidates, femaleCandidates }) => {
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = [maleCandidates, femaleCandidates]
    var options = {
        chart: {
            height: 100,
            type: 'pie',
        },
        labels: ['Males', 'Females'],
        legend: {
            position: 'bottom',
            show: true
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
            width={chartWidth}
            height={chartHeight}

        />
    )
}

const SimpleDonut = ({ dataColors }) => {
    var chartDonutBasicColors = getChartColorsArray(dataColors);
    const series = [44, 55, 41, 17, 15]
    var options = {
        chart: {
            height: 300,
            type: 'donut',
        },
        legend: {
            position: 'bottom'
        },
        dataLabels: {
            dropShadow: {
                enabled: false,
            }
        },
        colors: chartDonutBasicColors
    };
    return (
        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={series}
            options={options}
            type="donut"
            height={267.7}
        />

    )
}

const UpdateDonut = ({ dataColors }) => {
    var chartDonutupdatingColors = getChartColorsArray(dataColors);
    const series = [44, 55, 13, 33]
    var options = {
        chart: {
            height: 280,
            type: 'donut',
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            position: 'bottom'
        },
        colors: chartDonutupdatingColors
    };
    return (
        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={series}
            options={options}
            type="donut"
            height={267.7}
        />

    )
}

const MonochromePie = ({ dataColors }) => {
    var chartMonochromeColors = getChartColorsArray(dataColors);
    const series = [25, 15, 44, 55, 41, 17]
    var options = {

        chart: {
            height: 300,
            type: 'pie',
        },
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        theme: {
            monochrome: {
                enabled: true,
                color: '#405189',
                shadeTo: 'light',
                shadeIntensity: 0.6
            }
        },

        plotOptions: {
            pie: {
                dataLabels: {
                    offset: -5
                }
            }
        },
        title: {
            text: "Monochrome Pie",
            style: {
                fontWeight: 500,
            },
        },
        dataLabels: {
            formatter: function (val, opts) {
                var name = opts.w.globals.labels[opts.seriesIndex];
                return [name, val.toFixed(1) + '%'];
            },
            dropShadow: {
                enabled: false,
            }
        },
        legend: {
            show: false
        }
    };
    return (
        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={series}
            options={options}
            type="pie"
            height={287.7}
        />

    )
}

const GradientDonut = ({ dataColors }) => {
    var chartPieGradientColors = getChartColorsArray(dataColors);
    const series = [44, 55, 41, 17, 15]
    var options = {

        chart: {
            height: 300,
            type: 'donut',
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270
            }
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'gradient',
        },
        legend: {
            position: 'bottom',
            formatter: function (val, opts) {
                return val + " - " + opts.w.globals.series[opts.seriesIndex]
            }
        },
        title: {
            text: 'Gradient Donut with custom Start-angle',
            style: {
                fontWeight: 500,
            },
        },
        colors: chartPieGradientColors
    };
    return (
        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={series}
            options={options}
            type="donut"
            height={267.7}
        />

    )
}

const PatternedDonut = ({ dataColors }) => {
    var chartPiePatternColors = getChartColorsArray(dataColors);
    const series = [44, 55, 41, 17, 15]
    var options = {
        chart: {
            height: 300,
            type: 'donut',
            dropShadow: {
                enabled: true,
                color: '#111',
                top: -1,
                left: 3,
                blur: 3,
                opacity: 0.2
            }
        },
        stroke: {
            width: 0,
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            showAlways: true,
                            show: true
                        }
                    }
                }
            }
        },
        labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
        dataLabels: {
            dropShadow: {
                blur: 3,
                opacity: 0.8
            }
        },
        fill: {
            type: 'pattern',
            opacity: 1,
            pattern: {
                enabled: true,
                style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
            },
        },
        states: {
            hover: {
                filter: 'none'
            }
        },
        theme: {
            palette: 'palette2'
        },
        title: {
            text: "Favourite Movie Type",
            style: {
                fontWeight: 500,
            },
        },
        legend: {
            position: 'bottom'
        },
        colors: chartPiePatternColors
    };
    return (
        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={series}
            options={options}
            type="donut"
            height={267.7}
        />

    )
}

const ImagePieChart = ({ dataColors }) => {
    var chartPieImageColors = getChartColorsArray(dataColors);
    const series = [44, 33, 54, 45]
    const options = {
        chart: {
            width: 380,
            type: 'pie',
        },
        colors: chartPieImageColors,
        fill: {
            type: 'image',
            opacity: 0.85,

            image: {
                src: [],
                width: 25,
                imagedHeight: 25
            },

        },
        stroke: {
            width: 4
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#111']
            },
            background: {
                enabled: true,
                foreColor: '#fff',
                borderWidth: 0
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }

    return (
        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={series}
            options={options}
            type="pie"
            height={267.7}
        />

    )
}

export { VoterAttendanceChart, CandidateGenderPieChart, SimplePie, SimpleDonut, UpdateDonut, MonochromePie, GradientDonut, PatternedDonut, ImagePieChart }
import React from 'react';
import ReactApexChart from "react-apexcharts";

import { getChartColorsArray } from "shared/components";


const ElectorsOverviewCharts = ({ dataColors, dataSeries }) => {

    const slicedSeries = dataSeries.slice(0, 20);

    const seriesData = slicedSeries.map(elector => elector.count);
    const categories = slicedSeries.map(elector => elector.category);

    const series = [{
        name: "Count",
        data: seriesData
    }];

    var barchartColors = getChartColorsArray(dataColors);

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
            categories: categories,
        },
        yaxis: {
            title: {
                text: 'Count'
            },
        },
        grid: {
            borderColor: '#f1f1f1',
        },
        colors: barchartColors,
    };

    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                options={options}
                series={[{ data: seriesData }, { data: seriesData }]} // Ensure series data is correctly structured
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



const AudiencesCharts = ({ dataColors, series }) => {
    var chartAudienceColumnChartsColors = getChartColorsArray(dataColors);
    var options = {
        chart: {
            type: 'bar',
            height: 309,
            stacked: true,
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '20%',
                borderRadius: 6,
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            fontWeight: 400,
            fontSize: '8px',
            offsetX: 0,
            offsetY: 0,
            markers: {
                width: 9,
                height: 9,
                radius: 4,
            },
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        grid: {
            show: false,
        },
        colors: chartAudienceColumnChartsColors,
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: true,
                strokeDashArray: 1,
                height: 1,
                width: '100%',
                offsetX: 0,
                offsetY: 0
            },
        },
        yaxis: {
            show: false
        },
        fill: {
            opacity: 1
        }
    };
    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                options={options}
                series={series}
                type="bar"
                height="309"
                className="apex-charts"
            />
        </React.Fragment>
    );
};

const AudiencesSessionsCharts = ({ dataColors, series }) => {
    var chartHeatMapBasicColors = getChartColorsArray(dataColors);

    var options = {
        chart: {
            height: 400,
            type: 'heatmap',
            offsetX: 0,
            offsetY: -8,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            heatmap: {
                colorScale: {
                    ranges: [{
                        from: 0,
                        to: 50,
                        color: chartHeatMapBasicColors[0]
                    },
                    {
                        from: 51,
                        to: 100,
                        color: chartHeatMapBasicColors[1]
                    },
                    ],
                },

            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: true,
            horizontalAlign: 'center',
            offsetX: 0,
            offsetY: 20,
            markers: {
                width: 20,
                height: 6,
                radius: 2,
            },
            itemMargin: {
                horizontal: 12,
                vertical: 0
            },
        },
        colors: chartHeatMapBasicColors,
        tooltip: {
            y: [{
                formatter: function (y) {
                    if (typeof y !== "undefined") {
                        return y.toFixed(0) + "k";
                    }
                    return y;
                }
            }]
        }
    };
    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                options={options}
                series={series}
                type="heatmap"
                height="400"
                className="apex-charts"
            />
        </React.Fragment>
    );
};



const UsersByDeviceCharts = ({ dataColors, series }) => {
    var dountchartUserDeviceColors = getChartColorsArray(dataColors);
    const options = {
        labels: ["Desktop", "Mobile", "Tablet"],
        chart: {
            type: "donut",
            height: 219,
        },
        plotOptions: {
            pie: {
                size: 100,
                donut: {
                    size: "76%",
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
            position: 'bottom',
            horizontalAlign: 'center',
            offsetX: 0,
            offsetY: 0,
            markers: {
                width: 20,
                height: 6,
                radius: 2,
            },
            itemMargin: {
                horizontal: 12,
                vertical: 0
            },
        },
        stroke: {
            width: 0
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value + 'k Users';
                }
            },
            tickAmount: 4,
            min: 0
        },
        colors: dountchartUserDeviceColors,
    };
    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                options={options}
                series={series}
                type="donut"
                height="219"
                className="apex-charts"
            />
        </React.Fragment>
    );
};


export { ElectorsOverviewCharts, AudiencesCharts, AudiencesSessionsCharts, FamilyCharts, UsersByDeviceCharts };
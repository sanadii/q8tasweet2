import React, { useState } from 'react';
import ReactApexChart from "react-apexcharts";

import { getChartColorsArray } from "shared/components";


const ElectorSimpleBarChart = ({ dataSource }) => {
    var options = {
        chart: {
            height: 374,
            type: 'bar',
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
            categories: dataSource?.categories,
        },
        yaxis: {
            title: {
                text: 'Count'
            },
        },
        grid: {
            borderColor: '#f1f1f1',
        },
        colors: dataSource?.colors,
    };
    // console.log("dataSource : ", dataSource)

    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                options={options}
                series={dataSource?.series} // Ensure series data is correctly structured
                type="bar"
                height="374"
                className="apex-charts"
            />
        </React.Fragment>
    );
};

const ElectorSimplePieChart = ({ dataSource }) => {

    const [selectedCategory, setSelectedCategory] = useState("")
    // Example click handler function
    const handlePieClick = (event, chartContext, config) => {
        const clickedSeriesIndex = config.dataPointIndex;
        const clickedSeries = dataSource.categories[clickedSeriesIndex];
        setSelectedCategory(clickedSeries)
    };

    const series = [44, 55, 13, 43, 22]
    var options = {
        chart: {
            height: 300,
            type: 'pie',
            events: {
                dataPointSelection: handlePieClick  // This event is triggered when a data point (pie segment) is clicked
            }

        },
        labels: dataSource?.categories,
        legend: {
            position: 'left'
        },
        dataLabels: {
            dropShadow: {
                enabled: false,
            }
        },
        colors: dataSource?.colors
    };
    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                className="apex-charts"
                series={dataSource?.series[0]?.data || []}
                options={options}
                type="pie"
                height={267.7}
            />
            {
                selectedCategory &&
                <p>Show {selectedCategory}</p>
            }
        </React.Fragment>
    )
}


const ElectorSimpleBubbleChart = ({ dataSeries, dataColors }) => {
    var chartBubbleSimpleColors = getChartColorsArray(dataColors);

    const generateData = (baseval, count, yrange) => {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
            var y =
                Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
            var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

            series.push([x, y, z]);
            baseval += 86400000;
            i++;
        }
        return series;
    };

    const series = [{
        name: 'Bubble1',
        data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 60
        })
    },
    ];

    var options = {

        chart: {
            height: 350,
            type: 'bubble',
            toolbar: {
                show: false,
            }
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            opacity: 0.8
        },
        title: {
            text: 'Simple Bubble Chart',
            style: {
                fontWeight: 500,
            },
        },
        xaxis: {
            tickAmount: 12,
            type: 'category',
        },
        yaxis: {
            max: 70
        },
        colors: chartBubbleSimpleColors
    };

    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                className="apex-charts"
                options={options}
                series={series}
                type="bubble"
                height={350}
            />
        </React.Fragment>
    );
};

const BasicHeatmap = ({ dataColors }) => {
    var chartHeatMapBasicColors = getChartColorsArray(dataColors);
    generateData();
    const series = [{
        name: 'Metric1',
        data: generateData(18, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'Metric2',
        data: generateData(18, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'Metric3',
        data: generateData(18, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'Metric4',
        data: generateData(18, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'Metric5',
        data: generateData(18, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'Metric6',
        data: generateData(18, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'Metric7',
        data: generateData(18, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'Metric8',
        data: generateData(18, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'Metric9',
        data: generateData(18, {
            min: 0,
            max: 90
        })
    }
    ];

    var options = {
        chart: {
            height: 450,
            type: 'heatmap',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: [chartHeatMapBasicColors[0]],
        title: {
            text: 'HeatMap Chart (Single color)',
            style: {
                fontWeight: 500,
            },
        },
    };
    return (
        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={series}
            options={options}
            type="heatmap"
            height={450}
        />
    )
}
function generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
        var x = (i + 1).toString();
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push({
            x: x,
            y: y
        });
        i++;
    }
    return series;
}

const ElectorMultipleHeatmap = ({ dataSource }) => {

    // const seriesColors = dataSource?.colors;
    const seriesData = dataSource?.series;
    const seriesCategories = dataSource?.categories;

    const dataColors = '["--vz-danger", "--vz-secondary", "--vz-success", "--vz-info", "--vz-warning", "--vz-danger", "--vz-dark", "--vz-primary", "--vz-card-custom"]'
    var chartHeatMapMultipleColors = getChartColorsArray(dataColors);

    var options = {
        chart: {
            height: 450,
            type: 'heatmap',
            toolbar: {
                show: true
            }
        },
        dataLabels: {
            enabled: true
        },
        colors: [chartHeatMapMultipleColors[1]],
        xaxis: {
            type: 'category',
            categories: seriesCategories
        },
        title: {
            text: 'HeatMap Chart (Different color shades for each series)',
            style: {
                fontWeight: 500,
            },
        },
        grid: {
            padding: {
                right: 20
            }
        }
    };
    return (

        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={seriesData}
            options={options}
            type="heatmap"
            height={450}
        />
    );

}

const MultipleHeatmap = ({ dataColors }) => {
    var chartHeatMapMultipleColors = getChartColorsArray(dataColors);
    generateData();
    const data = [{
        name: 'W1',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W2',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W3',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W4',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W5',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W6',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W7',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W8',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W9',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W10',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W11',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W12',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W13',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W14',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W15',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    }
    ]

    console.log("the max data: ", data)
    const series = data
    var options = {
        chart: {
            height: 450,
            type: 'heatmap',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: [chartHeatMapMultipleColors[0], chartHeatMapMultipleColors[1], chartHeatMapMultipleColors[2], chartHeatMapMultipleColors[3], chartHeatMapMultipleColors[4], chartHeatMapMultipleColors[5], chartHeatMapMultipleColors[6], chartHeatMapMultipleColors[7]],
        xaxis: {
            type: 'category',
            categories: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30']
        },
        title: {
            text: 'HeatMap Chart (Different color shades for each series)',
            style: {
                fontWeight: 500,
            },
        },
        grid: {
            padding: {
                right: 20
            }
        }
    };
    return (

        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={series}
            options={options}
            type="heatmap"
            height={450}
        />
    );

}
export {
    ElectorSimpleBarChart,
    ElectorSimplePieChart,
    ElectorSimpleBubbleChart,
    ElectorMultipleHeatmap,
    BasicHeatmap,
    MultipleHeatmap
};
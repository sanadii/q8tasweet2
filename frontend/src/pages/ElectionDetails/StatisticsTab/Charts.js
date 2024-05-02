import React from 'react';
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

    console.log("dataSource?.series: ", dataSource?.series)
    const series = [44, 55, 13, 43, 22]
    var options = {
        chart: {
            height: 300,
            type: 'pie',
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
        <ReactApexChart dir="ltr"
            className="apex-charts"
            series={dataSource?.series[0]?.data || []}
            options={options}
            type="pie"
            height={267.7}
        />
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

    console.log("seriesseriesseriesseries: ", series)
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
        colors: [chartHeatMapMultipleColors[0]],
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
export {
    ElectorSimpleBarChart,
    ElectorSimplePieChart,
    ElectorSimpleBubbleChart,
    ElectorMultipleHeatmap
};
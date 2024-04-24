import React from 'react';
import ReactApexChart from "react-apexcharts";

import { getChartColorsArray } from "shared/components";


const ElectorsOverviewCharts = ({ dataSource }) => {

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
    console.log("dataSource : ", dataSource)

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


export { ElectorsOverviewCharts, };
import React from 'react';
import ReactApexChart from "react-apexcharts";

import { getChartColorsArray } from "shared/components";


const ElectorsOverviewCharts = ({ dataSource }) => {
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

const ElectorSimplePie = ({ dataSource }) => {

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

export { ElectorsOverviewCharts, ElectorSimplePie };
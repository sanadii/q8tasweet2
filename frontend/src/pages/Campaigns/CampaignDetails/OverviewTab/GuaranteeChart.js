// Pages/Campaigns/CampaignDetails/Components/OverViewGuarantees.js

import React from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, CardBody, Col, Row } from "reactstrap";
import getChartColorsArray from "Components/Common/Charts/ChartsDynamicColor";
import { GuaranteeStatusOptions } from "Components/constants";

const OverViewChart = ({ results }) => {

    // Extract the status color for each status option
    const dataColors = '["--vz-primary", "--vz-warning", "--vz-success", "--vz-danger", "--vz-info"]';
    const chartPieBasicColors = getChartColorsArray(dataColors);

    // Extract the counts from results for each status option
    const series = GuaranteeStatusOptions.map(option => results.statusCounts[option.value]);
    const labels = GuaranteeStatusOptions.map(option => option.name);

    const description = "هذا المكون يعرض مخططًا دائريًا يمثل توزيع حالات الضمان بناءً على الأوضاع المختلفة.";

    const options = {
        chart: {
            height: 300,
            type: 'pie',
        },
        labels: labels,
        legend: {
            position: 'right'
        },
        dataLabels: {
            dropShadow: {
                enabled: false,
            }
        },
        colors: chartPieBasicColors
    };
    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <h5 className="card-title">
                        <strong className="float-end text-success">{results.totalGuarantees}</strong>
                        <strong>المضامين</strong>
                    </h5>
                </CardHeader>
                <CardBody>
                    <p>{description}</p>
                    <ReactApexChart dir="rtl"
                        className="apex-charts"
                        series={series}
                        options={options}
                        type="pie"
                        height={280}
                    />
                </CardBody>
            </Card>
        </React.Fragment>
    )
};

export default OverViewChart;

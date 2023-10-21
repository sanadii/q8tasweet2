// Pages/Campaigns/CampaignDetails/Components/OverViewGuarantees.js

import React from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Col, Row } from "reactstrap";
import getChartColorsArray from "Components/Common/ChartsDynamicColor";
import { GuaranteeStatusOptions } from "Components/constants";

const OverViewChart = ({ results }) => {

    // Extract the status color for each status option
    const dataColors = '["--vz-primary", "--vz-warning", "--vz-success", "--vz-danger", "--vz-info"]';
    const chartPieBasicColors = getChartColorsArray(dataColors);

    // Extract the counts from results for each status option
    const series = GuaranteeStatusOptions.map(option => results.statusCounts[option.value]);
    const labels = GuaranteeStatusOptions.map(option => option.name);

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
        <Card className="h-100">
            <CardBody>
                <Row className="align-items-center">
                    <Col sm={6} className="d-flex justify-content-start align-items-center">
                        <h5 className="card-title mb-3"><strong>المضامين: {results.totalGuarantees}</strong></h5>
                    </Col>
                </Row>
                <ReactApexChart dir="rtl"
                    className="apex-charts"
                    series={series}
                    options={options}
                    type="pie"
                    height={230}
                />
            </CardBody>
        </Card>
    )
};

export default OverViewChart;

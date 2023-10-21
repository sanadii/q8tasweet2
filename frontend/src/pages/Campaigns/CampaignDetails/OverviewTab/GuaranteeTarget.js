// Pages/Campaigns/CampaignDetails/Components/OverViewGuarantees.js

import React from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Col, Row } from "reactstrap";
import getChartColorsArray from "Components/Common/ChartsDynamicColor";
import { GuaranteeStatusOptions } from "Components/constants";

const GuaranteeTarget = ({ results }) => {
    const dataColors = '["--vz-danger", "--vz-success", "--vz-info"]';

    var chartRadialbarCircleColors = getChartColorsArray(dataColors);

    // Guarantees, Blue, Confirmed Light Green, Attended Dark Green
    const series = [30, 50, 70];
    var options = {

        chart: {
            height: 350,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    }
                }
            }
        },
        colors: chartRadialbarCircleColors,
        labels: ['المضامين', 'المؤكد', 'الحضور'],
        legend: {
            show: true,
            floating: true,
            fontSize: '16px',
            position: 'left',
            offsetX: 120,
            offsetY: 15,
            labels: {
                useSeriesColors: true,
            },
            markers: {
                size: 0
            },
            formatter: function (seriesName, opts) {
                return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
            },
            itemMargin: {
                vertical: 3
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    show: false
                }
            }
        }]
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
                    type="radialBar"
                    height={328.7}
                />
            </CardBody>
        </Card>

    );
};

export default GuaranteeTarget;

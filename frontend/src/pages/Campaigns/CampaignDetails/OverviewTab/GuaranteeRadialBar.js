// Pages/Campaigns/CampaignDetails/Components/OverViewGuarantees.js

import React from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, CardBody, Col, Row } from "reactstrap";
import getChartColorsArray from "components/Charts/ChartsDynamicColor";
import { GuaranteeStatusOptions } from "constants";

const GuaranteeRadialBar = ({ results }) => {
    const description = "عرض نسبي لوضع حالات المضامينن.";

    const dataColors = '["--vz-danger", "--vz-success", "--vz-warning", "--vz-info"]';

    var chartRadialbarCircleColors = getChartColorsArray(dataColors);

    // Guarantees, Blue, Confirmed Light Green, Attended Dark Green
    const series = [
        Math.round((results.totalConfirmedAttendees / 270) * 100),
        Math.round((results.totalConfirmedGuarantees / 270) * 100),
        Math.round((results.totalContactedGuarantees / 270) * 100),
        Math.round((results.totalGuarantees / 270) * 100),
    ];
    var options = {
        chart: {
            height: 300,
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

        labels: ['الحضور', 'المؤكد', 'التواصل', 'المضامين'],
        legend: {
            show: true,
            floating: true,
            fontSize: '16px',
            position: 'left',
            offsetX: 0,
            offsetY: 0,
            labels: {
                useSeriesColors: true,
            },
            markers: {
                size: 0
            },
            formatter: function (seriesName, opts) {
                return seriesName + ":  %" + opts.w.globals.series[opts.seriesIndex];
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
        <Card>
            <CardHeader>
                <h5 className="card-title">
                    <strong className="float-end text-success">{results.totalConfirmedAttendees}</strong>
                    <strong>الحضور</strong>
                </h5>
            </CardHeader>
            <CardBody>
                <p>{description}</p>
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

export default GuaranteeRadialBar;

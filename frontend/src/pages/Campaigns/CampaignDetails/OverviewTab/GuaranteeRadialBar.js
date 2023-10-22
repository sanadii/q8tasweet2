// Pages/Campaigns/CampaignDetails/Components/OverViewGuarantees.js

import React from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Col, Row } from "reactstrap";
import getChartColorsArray from "Components/Common/ChartsDynamicColor";
import { GuaranteeStatusOptions } from "Components/constants";

const GuaranteeRadialBar = ({ results }) => {
    const description = "هذا المكون يعرض مخططًا دائريًا لإظهار نسب مختلف حالات الضمان بناءً على البيانات المقدمة.";

    const dataColors = '["--vz-danger", "--vz-success", "--vz-warning", "--vz-info"]';

    var chartRadialbarCircleColors = getChartColorsArray(dataColors);

    // Guarantees, Blue, Confirmed Light Green, Attended Dark Green
    const series = [
        Math.round((results.totalConfirmedAttendees / 270) * 100),
        Math.round((results.totalConfirmedGuarantees / 270) * 100),
        Math.round((results.totalContactedGuarantees / 270) * 100),
        Math.round((results.totalGuarantees / 270) * 100),
    ];
    const series2 = [results.totalGuarantees, results.totalContactedGuarantees, results.totalConfirmedGuarantees, results.totalConfirmedAttendees];
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
            offsetX: 120,
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
        <React.Fragment>
            <h5 className="card-title mb-3"><strong>الحضور: {results.totalConfirmedAttendees}</strong></h5>
            <p>{description}</p>
            <ReactApexChart dir="rtl"
                className="apex-charts"
                series={series}
                options={options}
                type="radialBar"
                height={328.7}
            />
        </React.Fragment>


    );
};

export default GuaranteeRadialBar;

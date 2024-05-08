import React from "react";
import { Row, Col, CardHeader } from "reactstrap";
import CountUp from "react-countup";

// Reusable counter item component
const CounterItem = ({ title, start, end, male, female }) => (
    <Col xs={6} sm={4}>
        <div className="p-3 border border-dashed border-start-0">
            <h5 className="mb-1">
                <CountUp start={start} end={end} separator="," duration={2} />
            </h5>
            <p className="text-muted mb-0">{title}</p>
            {male !== undefined && (
                <span className="badge bg-light text-info mb-0 fs-12">
                    <i className="mdi mdi-gender-male me-1"></i>
                    {male}
                </span>
            )}
            {female !== undefined && (
                <span className="badge bg-light text-pink mb-0 fs-12">
                    <i className="mdi mdi-gender-female me-1"></i>
                    {female}
                </span>
            )}
        </div>
    </Col>
);

const ElectorChartCounter = ({ dataSource }) => {
    const { counter } = dataSource;


    const counterItems = [
        {
            title: "عدد الناخبين",
            start: 0,
            end: counter?.genderCount?.total || 0,
            male: counter?.genderCount?.male || 0,
            female: counter?.genderCount?.female || 0
        },
        {
            title: "عدد اللجان الأصلية",
            start: 0,
            end: counter?.committeeSiteCount?.total || 0,
            male: counter?.committeeSiteCount?.male || 0,
            female: counter?.committeeSiteCount?.female || 0
        },
        {
            title: "عدد اللجان الكلي",
            start: 0,
            end: counter?.committeeCount?.total || 0,
            male: counter?.committeeCount?.male || 0,
            female: counter?.committeeCount?.female || 0
        }
    ];


    return (
        <CardHeader className="p-0 border-0 bg-light-subtle">
            <Row className="g-0 text-center">
                {counterItems.map((item, index) => (
                    <CounterItem
                        key={index}
                        title={item.title}
                        start={item.start}
                        end={item.end}
                        male={item.male}
                        female={item.female}
                    />
                ))}
            </Row>
        </CardHeader>
    );
};

export default ElectorChartCounter;

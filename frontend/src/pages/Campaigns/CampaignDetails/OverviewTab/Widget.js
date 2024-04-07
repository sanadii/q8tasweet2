import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import CountUp from "react-countup";

//Import Icons
import FeatherIcon from "feather-icons-react";


const Widget = () => {

    const cardData = [
        {
            title: "ناخبين الدائرة",
            count: 27659,
            icon: "mdi-account-group-outline",
            trend: "up",
            trendPercentage: 7.05,
            text: "نسبة التصويت",
        },
        {
            title: "الناخبين الرجال",
            count: 8,
            icon: "mdi-face-man",
            text: "نسبة التصويت",

        },
        {
            title: "الناخبين النساء",
            count: 10,
            icon: "mdi-face-woman",
            text: "نسبة التصويت",
        },
        {
            title: "ضماناتي الانتخابية",
            count: 3,
            icon: "mdi-vote-outline",
        },
        {
            title: "تم التصويت",
            subtitle: "عدد : 13",
            extra: "نسبة : 100%",
            icon: "mdi-clipboard-check-outline",

        },
        {
            title: "لم يتم التصويت",
            subtitle: "عدد : 5",
            extra: "نسبة : 27.78%",
            icon: "mdi-clipboard-clock-outline",
        },
        {
            title: "مندوب اللجان",
            count: 30,
            icon: "mdi-trophy-variant",
            trend: "up",
            trendPercentage: 7.05,
        },
        {
            title: "مصوتين رجال",
            subtitle: "عدد : 6",
            extra: "نسبة : 75% من الرجال",
            icon: "mdi-vote-outline",
        },
        {
            title: "مصوتين نساء",
            subtitle: "عدد : 7",
            extra: "نسبة : 70% من النساء",
            icon: "mdi-vote-outline",

        },


        // ... Add more card data here
    ];

    return (
        <React.Fragment>
            <Row>
                {cardData.map((card, index) => (
                    <Col md={4} key={index}>
                        <Card className="card-animate">
                            <CardBody>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <p className="fw-medium text-muted mb-0">{card.title}</p>
                                        <h2 className="mt-4 ff-secondary fw-semibold">
                                            <span className="counter-value">
                                                <CountUp start={0} end={card.count} duration={4} />
                                                {card.countUnit}
                                            </span>
                                        </h2>
                                        <p className="mb-0 text-muted">
                                            <span className={`badge bg-light text-${card.trend === "up" ? "success" : "danger"} mb-0`}>
                                                <i className={`ri-arrow-${card.trend}-line align-middle`}></i> {card.trendPercentage} %
                                            </span> vs. previous month
                                        </p>
                                    </div>
                                    <div>
                                        <div className="avatar-sm flex-shrink-0">
                                            <span className="avatar-title bg-info-subtle rounded-circle fs-2">
                                                <i className={`mdi ${card.icon}`} ></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </React.Fragment >
    );
};

export default Widget;
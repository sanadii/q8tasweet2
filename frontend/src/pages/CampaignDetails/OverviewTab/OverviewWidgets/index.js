import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import CountUp from "react-countup";

// Store & Selectors
import { useSelector } from "react-redux";
import { campaignSelector } from 'selectors';


const CampaignWidgets = () => {

    const {
        campaign,
        electionDetails,
        campaignMembers,
        campaignRoles,
        campaignGuarantees,
        campaignAttendees,
    } = useSelector(campaignSelector);

    // const electionDetails = electionDetails

    const campaignGuaranteeCount = campaignGuarantees.length
    const campaignGuaranteeMaleCount = campaignGuarantees.filter(guarantee => guarantee.gender === "1").length;
    const campaignGuaranteeFemaleCount = campaignGuarantees.filter(guarantee => guarantee.gender === "2").length;

    const campaignAttendedGuaranteeCount = campaignGuarantees.filter(guarantee => guarantee.attended === true).length
    const campaignAttendedGuaranteeMaleCount = campaignGuarantees.filter(guarantee => guarantee.gender === "1" && guarantee.attended === true).length;
    const campaignAttendedGuaranteeFemaleCount = campaignGuarantees.filter(guarantee => guarantee.gender === "2" && guarantee.attended === true).length;

    console.log("electionDetails: ",)
    const cardData = [
        {
            title: "ناخبين الدائرة",
            count: electionDetails?.electorCount,
            icon: "mdi-account-group-outline",
            trend: "up",
            trendPercentage: 7.05,
            text: "نسبة التصويت",
        },
        {
            title: "الناخبين الرجال",
            count: electionDetails?.electorMaleCount,
            icon: "mdi-face-man",
            text: "نسبة التصويت",

        },
        {
            title: "الناخبين النساء",
            count: electionDetails?.electorFemaleCount,
            icon: "mdi-face-woman",
            text: "نسبة التصويت",
        },
        {
            title: "ضماناتي الانتخابية",
            count: campaignGuaranteeCount,
            icon: "mdi-vote-outline",
        },
        {
            title: "ضماناتي الانتخابية - رجال",
            count: campaignGuaranteeMaleCount,
            icon: "mdi-vote-outline",
        },
        {
            title: "ضماناتي الانتخابية - نساء",
            count: campaignGuaranteeFemaleCount,
            icon: "mdi-vote-outline",
        },
        {
            title: "تصويت المضامين",
            subtitle: "عدد : 13",
            count: campaignAttendedGuaranteeCount,
            extra: "نسبة : 100%",
            icon: "mdi-clipboard-check-outline",

        },
        {
            title: "تصويت الرجال",
            subtitle: "عدد : 5",
            extra: "نسبة : 27.78%",
            count: campaignAttendedGuaranteeMaleCount,
            icon: "mdi-clipboard-check-outline",
        },
        {
            title: "تصويت النساء",
            subtitle: "عدد : 5",
            extra: "نسبة : 27.78%",
            count: campaignAttendedGuaranteeFemaleCount,
            icon: "mdi-clipboard-check-outline",
        },
        // {
        //     title: "مندوبي اللجان",
        //     count: 30,
        //     icon: "mdi-trophy-variant",
        //     trend: "up",
        //     trendPercentage: 7.05,
        // },
        // {
        //     title: "تصويت االرجال",
        //     subtitle: "عدد : 6",
        //     extra: "نسبة : 75% من الرجال",
        //     icon: "mdi-vote-outline",
        // },
        // {
        //     title: "تصويت النساء",
        //     subtitle: "عدد : 7",
        //     extra: "نسبة : 70% من النساء",
        //     icon: "mdi-vote-outline",
        // },


        // ... Add more card data here
    ];

    return (
        <React.Fragment>
            <Row>
                <Col className="col-12">
                    <h5 className="text-decoration-underline mb-3 mt-2 pb-3">إحصائيات</h5>
                </Col>
            </Row>
            <Row>

                {cardData.map((card, index) => (
                    <Col md={4} key={index}>
                        <Card className="card-animate">
                            <CardBody>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <p className="fw-medium text-muted mb-0"><strong>{card.title}</strong></p>
                                        <h2 className="mt-4 ff-secondary fw-semibold">
                                            <span className="counter-value">
                                                <CountUp start={0} end={card.count} duration={2} />
                                                {card.countUnit}
                                            </span>
                                        </h2>
                                        <p className="mb-0 text-muted">
                                            {/* <span className={`badge bg-light text-${card.trend === "up" ? "success" : "danger"} mb-0`}>
                                                <i className={`ri-arrow-${card.trend}-line align-middle`}></i> {card.trendPercentage} %
                                            </span> vs. previous month */}
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

export default CampaignWidgets;
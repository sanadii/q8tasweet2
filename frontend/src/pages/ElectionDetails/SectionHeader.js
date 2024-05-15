import React, { useState } from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { electionSelector, categorySelector } from 'selectors';

// Components & Hooks
import { ImageMedium } from "shared/components";
import { SectionBackagroundImage } from "shared/components";
import { getStatusBadge, PriorityBadge } from "shared/constants";
import { getOptionBadge } from "shared/utils";
// UI & Utilities
import { Col, Row } from "reactstrap";

const SectionHeader = () => {
    const { election, electionCandidates } = useSelector(electionSelector);
    const { categories } = useSelector(categorySelector);
    const categoryId = election.category; // assuming election object has a categoryId property
    const category = categories.find(cat => cat.id === categoryId);

    const electionCategoryName = election.categoryName;
    const electionSubCategoryName = election.subCategoryName;
    const electionName = election.name;
    const electionImage = election.image;
    const electionStatus = election.task?.status || 0;
    const electionPriority = election.task?.priority || 0;


    return (
        <React.Fragment>
            <SectionBackagroundImage imagePath={electionImage} />
            <div className="pt-4 mb-4 mb-lg-3 pb-lg-2 profile-wrapper">
                <Row className="g-4">
                    <div className="col-auto">
                        <ImageMedium imagePath={electionImage} />
                    </div>
                    <Col>
                        <div className="p-2">
                            <h3 className="text-white mb-1">{electionName}</h3>
                            <div className="hstack text-white gap-1">
                                <div className="me-2">
                                    <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                                    التصنيف: <b >{electionCategoryName} - {electionSubCategoryName}</b>
                                </div>
                            </div>
                            <div className="hstack text-white gap-1">
                                <div className="me-2">
                                    <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                                    الموعد:  <b >{election.dueDate}</b>
                                </div>
                            </div>

                        </div>

                        {/* For Admin Only */}
                        <div className="col-md-auto p-2">
                            <div className="hstack gap-3 flex-wrap">
                                {getOptionBadge("status", electionStatus)}
                                {getOptionBadge("priority", electionPriority)}
                                <div className="badge bg-black fs-10">
                                    الرمز:  {election.id}
                                </div>
                            </div>
                        </div>
                        {/* end for Admin Only */}

                    </Col>


                    <Col xs={12} className="col-lg-auto order-last order-lg-0">

                        {/* For Sharing to be used later */}
                        {/* <Row>
                            <div className="col-md-auto">
                                <div className="hstack gap-1 flex-wrap flex-end">
                                    <button type="button" className="btn py-0 fs-16 text-white">
                                        <i className="ri-star-fill"></i>
                                    </button>
                                    <button type="button" className="btn py-0 fs-16 text-white">
                                        <i className="ri-share-line"></i>
                                    </button>
                                    <button type="button" className="btn py-0 fs-16 text-white">
                                        <i className="ri-flag-line"></i>
                                    </button>
                                </div>
                            </div>
                        </Row> */}
                        {/* end for Sharing to be used later */}

                        <Row className="text text-white-50 text-center">
                            <Col lg={4} xs={4}>
                                <div className="p-2">
                                    <h4 className="text-white mb-1">
                                        {electionCandidates?.length || 0}
                                    </h4>
                                    <p className="fs-14 mb-0">المرشحين</p>
                                </div>
                            </Col>
                            <Col lg={4} xs={4}>
                                <div className="p-2">
                                    <h4 className="text-white mb-1">
                                        {election.electSeats || 0}
                                    </h4>
                                    <p className="fs-14 mb-0">المقاعد</p>
                                </div>
                            </Col>
                            <Col lg={4} xs={4}>
                                <div className="p-2">
                                    <h4 className="text-white mb-1">
                                        {election.electVotes || 0}
                                    </h4>
                                    <p className="fs-14 mb-0">الأصوات</p>
                                </div>
                            </Col>

                        </Row>

                    </Col>
                </Row>
            </div>
        </React.Fragment >
    );
};

export default SectionHeader;

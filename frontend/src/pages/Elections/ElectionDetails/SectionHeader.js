import React, { useState } from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { electionSelector, categorySelector } from 'Selectors';

// Components & Hooks
import { ImageMedium } from "components";
import { SectionBackagroundImage } from "components";
import { StatusBadge, PriorityBadge } from "constants";

// UI & Utilities
import { Col, Row } from "reactstrap";


const SectionHeader = () => {
    const { election, electionCandidates } = useSelector(electionSelector);
    const { categories } = useSelector(categorySelector);
    const categoryId = election.category; // assuming election object has a categoryId property
    const category = categories.find(cat => cat.id === categoryId);

    const electionCategoryName = category ? category.name : 'Category Not Found';
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
                            <p className="text-white-75">{electionCategoryName}</p>
                            <div className="hstack text-white gap-1">
                                <div className="me-2">
                                    <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                                    التاريخ: <strong >{election.dueDate}</strong>
                                </div>
                                <div className="me-2">
                                    <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                                    الرمز: <strong >{election.id}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <div className="hstack gap-3 flex-wrap">
                                <StatusBadge status={electionStatus} />
                                <PriorityBadge priority={electionPriority} />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} className="col-lg-auto order-last order-lg-0">
                        <Row className="text text-white-50 text-center">
                            <Col lg={6} xs={6}>
                                <div className="p-2">
                                    <h4 className="text-white mb-1">
                                        {electionCandidates?.length || 0}
                                    </h4>
                                    <p className="fs-14 mb-0">المرشحين</p>
                                </div>
                            </Col>
                            <Col lg={6} xs={6}>
                                <div className="p-2">
                                    <h4 className="text-white mb-1">
                                        {election.electSeats || 0}
                                    </h4>
                                    <p className="fs-14 mb-0">المقاعد</p>
                                </div>
                            </Col>
                        </Row>
                        {/* <Row>
        <div className="col-md-auto">
          <div className="hstack gap-1 flex-wrap">
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
                    </Col>
                </Row>
            </div>
        </React.Fragment >
    );
};

export default SectionHeader;

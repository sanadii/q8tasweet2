import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { BreadCrumb, ImageCampaignCard } from "shared/components";
import { userSelector, campaignSelector, categorySelector } from 'selectors';

import { Link } from "react-router-dom";

import { getCampaigns, getModeratorUsers, getCategories } from "store/actions";


const CampaignGrid = () => {
  const dispatch = useDispatch();

  document.title = "Campaigns - Q8 TASWEET APP";

  // State Management
  const { campaigns, isCampaignSuccess, error } = useSelector(campaignSelector);
  const { moderators, user } = useSelector(userSelector);
  const { categories, subCategories } = useSelector(categorySelector);

  // Constant Management
  const [campaignList, setCampaignList] = useState(campaigns);
  const [campaign, setCampaign] = useState([]);
  const [category, setCategory] = useState([]);
  const [campaignCandidates, setcampaignCandidates] = useState([]);
  const [userName, setUserName] = useState("Admin");
  const [userId, setUserId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Campaign Data
  useEffect(() => {
    if (campaigns && !campaigns.length) {
      dispatch(getCampaigns());
    }
  }, [dispatch, campaigns]);

  useEffect(() => {
    setCampaignList(campaigns);
  }, [campaigns]);


  // const [moderatorsMap, setModeratorsMap] = useState({});

  // useEffect(() => {
  //   Promise.resolve(moderators).then((moderatorsList) => {
  //     const map = moderatorsList.reduce((acc, moderator) => {
  //       acc[moderator.id] = moderator;
  //       return acc;
  //     }, {});

  //     setModeratorsMap(map);
  //   });
  // }, [moderators]);

  // User & id
  // useEffect(() => {
  //   if (sessionStorage.getItem("authUser")) {
  //     const obj = JSON.parse(sessionStorage.getItem("authUser"));
  //     let loggedUserId = "Not Logged In"; // default to "Logged In"
  //     let name = "Not Logged In"; // default to "Logged In"

  //     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
  //       name = obj.providerData[0].email;
  //     } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
  //       loggedUserId = obj.data.id;
  //     }

  //     setUserName(name);
  //     setUserId(loggedUserId); // set userId from sessionStorage
  //   }
  // }, [user]);

  const favouriteBtn = (ele) => {
    if (ele.closest("button").classList.contains("active")) {
      ele.closest("button").classList.remove("active");
    } else {
      ele.closest("button").classList.add("active");
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Marketplace" pageTitle="NFT Marketplace" />

          <Row>
            <Col lg={12}>
              <div className="d-lg-flex align-items-center mb-4">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0 fw-semibold fs-16">
                    Campaigns
                  </h5>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="row-cols-xl-5 row-cols-lg-3 row-cols-md-2 row-cols-1">
            {campaignList.map((item, key) => (
              <Col key={key}>
                <Card className="explore-box card-animate">
                  <ImageCampaignCard
                    imagePath={item.candidate.image}
                    urlPath={`/campaigns/${item.id}`}
                  />
                  <CardBody>
                    <h2 className="mb-1">
                      <Link to={`/campaigns/${item.id}`}>
                        {item.candidate.name}
                      </Link>
                    </h2>
                    <h5 className="text-muted mb-0">
                      <b>{item.election.name}</b>
                    </h5>
                  </CardBody>
                  <div className="card-footer border-top border-top-dashed">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 fs-14">
                        <i className="ri-price-tag-3-fill text-warning align-bottom me-1"></i>{" "}
                        {item.election.category}
                      </div>
                      <h5 className="flex-shrink-0 fs-14 text-primary mb-0">
                        {item.election.subCategory}
                      </h5>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CampaignGrid;

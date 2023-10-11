// Pages/Campaigns/CampaignDetails/index.js
// React & Redux core
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Store & Selectors
import { electionsSelector } from 'Selectors/electionsSelector';

// Components, Constants & Hooks
import usePermission from "Components/Hooks/usePermission";
import { MemberRankOptions } from "Components/constants";
import OverViewGuarantees from "./OverViewGuarantees";
// import OverViewNotifications from "./Components/OverViewNotifications";

// UI & Utilities
import { Card, CardBody, Col, Row } from "reactstrap";

const OverviewTab = () => {

  const {
    campaignDetails,
    currentUser,
    currentCampaignMember,
    campaignMembers,
    campaignGuarantees,
    campaignElectionCommittees,
    campaignCandidates
  } = useSelector(electionsSelector);

  document.title = "Campaign Overview | Q8Tasweet";

  // Permissions
  const { isAdmin, isEditor, isContributor, isModerator, isSubscriber, hasPermission } = usePermission();

  // TODO: Move to helper
  let committeeName = "Unknown";

  if (Array.isArray(campaignElectionCommittees)) {
    const committeeObj = campaignElectionCommittees.find(
      (committee) => committee.id === currentCampaignMember.committee
    );
    if (committeeObj) {
      committeeName = committeeObj.name;
    }
  }

  let rankName;

  if (isAdmin) {
    rankName = "ADMIN";
  } else {
    const rankObj = MemberRankOptions.find(
      rank => rank.id === currentCampaignMember.rank
    );

    rankName = rankObj ? rankObj.name : "DEFAULT_RANK"; // replace 'DEFAULT_RANK' with whatever default value you'd like
  }

  const getGenderIcon = (gender) => {
    if (gender === 2) {
      return <i className="mdi mdi-circle align-middle text-danger me-2"></i>;
    } else if (gender === 1) {
      return <i className="mdi mdi-circle align-middle text-info me-2"></i>;
    }
    return null;
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={3}>
          {/* <Card>
            <CardBody>
              <h5 className="card-title mb-5">Complete Your Profile</h5>
              <Progress
                value={30}
                color="danger"
                className="animated-progess custom-progress progress-label"
              >
                <div className="label">30%</div>{" "}
              </Progress>
            </CardBody>
          </Card> */}



          <Card>
            <CardBody>
              <h5 className="card-title mb-3"><strong>الإنتخابات</strong></h5>
              <ul>
                <li>المرشح: <strong>{campaignDetails.candidate.name}</strong></li>
                <li>الانتخابات: <strong>{campaignDetails.election.name}</strong></li>
                <li>المرشحين: <strong>{(campaignCandidates?.length ?? 0)} مرشح</strong></li>
                <li>المقاعد: <strong>{campaignDetails.election.seats} مقعد</strong></li>
                <li>الأصوات: <strong>{campaignDetails.election.votes} صوت</strong></li>
              </ul>
              <hr />
              {isAdmin ?
                <div>
                  <h5 className="card-title mb-3"><strong>الإدارة</strong></h5>
                  <ul className="text-danger">
                    <li>رمز الإنتخابات: <strong>{campaignDetails.election.id}</strong></li>
                    <li>رمز المرشح: <strong>{campaignDetails.candidate.id}</strong></li>
                    <li>رمز الحملة: <strong>{campaignDetails.id}</strong></li>
                  </ul>
                </div>
                :
                <div>
                  <h5 className="card-title mb-3"><strong>المستخدم</strong></h5>
                  <ul>
                    <li>الإسم: <strong>{currentCampaignMember.fullName}</strong></li>
                    <li>رمز المستخدم: <strong>{currentUser.id}</strong></li>
                    <li>العضوية: <strong>{rankName}</strong></li>
                    <li>رمز العضوية: <strong>{currentCampaignMember.id}</strong></li>
                    <li>اللجنة: <strong> {committeeName}</strong></li>
                  </ul>
                </div>
              }
            </CardBody>
          </Card>
        </Col>
        <Col lg={9}>
          <Card>
            <CardBody>
              <h5 className="card-title mb-3">عن المرشح</h5>
              {campaignDetails.candidate.description}
              <Row>
                <Col xs={6} md={4}>
                  <div className="d-flex mt-4">
                    <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                        <i className="ri-user-2-fill"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="mb-1">تويتر :</p>
                      <h6 className="text-truncate mb-0">
                        {campaignDetails.candidate.name}
                      </h6>
                    </div>
                  </div>
                </Col>

                <Col xs={6} md={4}>
                  <div className="d-flex mt-4">
                    <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                        <i className="ri-global-line"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="mb-1">الموقع الإلكتروني :</p>
                      <Link to="#" className="fw-semibold">
                        www.Q8Tasweet.com
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Row>
            <OverViewGuarantees />
          </Row>
          <Row>
            {/* <OverViewNotifications /> */}
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OverviewTab;

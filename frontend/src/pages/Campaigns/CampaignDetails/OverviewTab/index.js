// Pages/Campaigns/CampaignDetails/index.js
// React & Redux core
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Store & Selectors
import { userSelector, campaignSelector } from 'Selectors';

// Components, Constants & Hooks
import usePermission from "Components/Hooks/usePermission";
import { MemberRoleOptions } from "Components/constants";
import OverViewGuarantees from "./OverViewGuarantees";
// import OverViewNotifications from "./Components/OverViewNotifications";

// UI & Utilities
import { Card, CardBody, Col, Row } from "reactstrap";

const OverviewTab = () => {

  const {
    campaignDetails,
    currentCampaignMember,
    campaignMembers,
    campaignRoles,
    campaignGuarantees,
    campaignElectionCommittees,
    campaignCandidates
  } = useSelector(campaignSelector);

  const {
    currentUser,
  } = useSelector(userSelector);
  document.title = "Campaign Overview | Q8Tasweet";

  // Permissions
  const { canChangeConfig } = usePermission();

  // TODO: Move to helper
  let committeeName = "Unknown";

  // Custom hook to get members with a specific role by role name
  function useMembersWithRole(roleName, campaignRoles = [], campaignMembers = []) {
    const [membersWithRole, setMembersWithRole] = useState([]);
  
    useEffect(() => {
      const foundRole = campaignRoles.find(role => role.role === roleName);
      const members = foundRole ? campaignMembers.filter(member => member.role === foundRole.id) : [];
      setMembersWithRole(members);
    }, [roleName, campaignRoles, campaignMembers]);
  
    return membersWithRole;
  }
  
  function useCurrentMemberRole(canChangeConfig, campaignRoles = [], currentCampaignMember = {}) {
    if (canChangeConfig) {
      return 'مدير عام النظام';
    } else {
      const roleObj = campaignRoles.find(role => role.id === currentCampaignMember.role);
      return roleObj?.name || 'مشترك';
    }
  }
    
  // Usage of custom hooks
  const campaignModerators = useMembersWithRole('campaignModerator', campaignRoles, campaignMembers);
  const campaignManagers = useMembersWithRole('campaignManagers', campaignRoles, campaignMembers);
  const currentMemberRole = useCurrentMemberRole(canChangeConfig, campaignRoles, currentCampaignMember);
  
  console.log("campaignModerators:", campaignModerators )
  console.log("campaignManagers:", campaignManagers )
  console.log("currentMemberRole:", currentMemberRole )


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
                <li>الانتخابات: <strong>{campaignDetails.election.name}</strong></li>
                <li>المرشحين: <strong>{(campaignCandidates?.length ?? 0)} مرشح</strong></li>
                <li>المقاعد: <strong>{campaignDetails.election.seats} مقعد</strong></li>
                <li>الأصوات: <strong>{campaignDetails.election.votes} صوت</strong></li>
              </ul>
              <hr />
              <h5 className="card-title mb-3"><strong>الإدارة</strong></h5>
              <ul>
                <li>المرشح: <strong>{campaignDetails.candidate.name}</strong></li>
                {campaignManagers && campaignManagers.length > 0 &&
                  <li>مدير الحملة: <strong>{campaignManagers.map(moderator => moderator.fullName).join(' <br/> ')}</strong></li>
                }
                {campaignModerators && campaignModerators.length > 0 && (
                  <li>
                    مشرف الحملة: <strong>{campaignModerators.map(moderator => moderator.fullName).join(' | ')}</strong>
                  </li>
                )}


              </ul>
              <hr />
              {canChangeConfig ?
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
                    <li>العضوية: <strong>{currentMemberRole}</strong></li>
                    <li>رمز العضوية: <strong>{currentCampaignMember.id}</strong></li>
                    {/* <li>اللجنة: <strong> {committeeName}</strong></li> */}
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

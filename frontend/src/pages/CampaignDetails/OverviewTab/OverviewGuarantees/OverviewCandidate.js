import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Row } from "reactstrap";
import { usePermission, useCampaignMemberRoles, useCurrentCampaignMemberRole } from 'shared/hooks';
import { userSelector, campaignSelector } from 'selectors';
import SimpleBar from "simplebar-react";

const OverviewCandidate = () => {

  const {
    campaign,
    currentCampaignMember,
    campaignMembers,
    campaignRoles,
    campaignElectionCandidates,
    campaignElectionCommittees,
  } = useSelector(campaignSelector);
  const { currentUser } = useSelector(userSelector);

  // Permissions
  const { canChangeConfig } = usePermission();

  // Format role names
  // Get roles
  const campaignModerators = useCampaignMemberRoles('campaignModerator', campaignRoles, campaignMembers);
  const campaignCandidates = useCampaignMemberRoles('campaignCandidate', campaignRoles, campaignMembers);
  const campaignAdmin = useCampaignMemberRoles('campaignAdmin', campaignRoles, campaignMembers);
  const currentMemberRole = useCurrentCampaignMemberRole(canChangeConfig, campaignRoles, campaignMembers);

  // Format role names
  const formatRoleNames = (members) => members.map(member => member.name).join(' | ');

  const electionDetails = [
    // {
    //   name: 'الانتخابات',
    //   data: campaign.election.name,
    // },
    {
      name: 'المرشحين',
      data: `${campaignElectionCandidates?.length ?? 0} مرشح`,
    },
    {
      name: 'المقاعد',
      data: `${campaign?.election?.electSeats ? `${campaign.election.electSeats} مقعد` : "-"}`,
    },
    {
      name: 'الأصوات',
      data: `${campaign?.election?.electVotes ? `${campaign.election.electVotes} صوت` : "-"}`,
    },
    {
      name: 'اللجان',
      data: `${campaignElectionCommittees?.length ? `${campaignElectionCommittees?.length} لجنة` : "-"}`,
    },
  ];



  const candidateInfo = [
    {
      name: 'تويتر',
      value: campaign.twitter,
      url: `https://www.twitter.com/${campaign.twitter}`,
      icon: "ri-twitter-fill",
    },
    {
      name: 'انستقرام',
      value: campaign.instagram,
      url: `https://www.instagram.com/${campaign.instagram}`,
      icon: "ri-instagram-fill",
    },
    {
      name: 'الموقع الإلكتروني',
      value: campaign.website,
      url: campaign.website, // Assuming 'campaign.website' is a complete URL
      icon: "ri-global-line",
    },
  ];

  const roles = [
    { label: 'المشرف', users: campaignModerators, formatter: formatRoleNames },
    { label: 'المرشح', users: campaignCandidates, formatter: formatRoleNames },
    { label: 'المنسق', users: campaignAdmin, formatter: formatRoleNames },
    // Add more roles here if needed
  ];


  const CampaignRole = ({ iconName, label, users, formatter }) => (
    <div className="d-flex align-items-center">
      <i className={`${iconName} align-middle fs-18 text-primary me-2`}></i>
      <p className="text-truncate mb-0">
        {users.length > 0 && (
          <span> {label}: <strong className="text-info">{formatter(users)}</strong></span>
        )}
      </p>
    </div>
  );


  return (
    <React.Fragment>

      <Card>
        <Row className="g-0">
          <Col className="bg-primary" lg={4}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center text-center" style={{ height: '100%' }}>
              <h3 id="candidate-name" className="mb-0 text-white pb-1">{campaign?.candidate?.name}</h3>
              <p id="candidate-position" className="text-white">{campaign?.election?.name}</p>

              <div className="d-flex gap-2 justify-content-center mb-3">
                {candidateInfo.map(info => (
                  <a
                    href={info.url}
                    key={info.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    type="button"
                    className="btn avatar-xs p-0"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={info.value}
                  >
                    <span className="avatar-title rounded-circle bg-light text-body">
                      <i className={info.icon}></i>
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </Col>
          <Col className="bg-soft-secondary" lg={8}>

            <div className="card-body ">
              <Row>
                <Col lg={6}>
                  <h5><strong>الإنتخابات</strong></h5>
                  {electionDetails.map((detail, index) => (

                    <div key={index} class="d-flex align-items-center">
                      <i class="ri-stop-fill align-middle fs-18 text-primary me-2"></i>
                      <p class="text-truncate mb-0">
                        <span> {detail.name}: <strong className="text-info">{detail.data}</strong></span>
                      </p>
                    </div>
                  ))}


                </Col>
                <Col lg={6}>
                  <h5><strong>الإدارة</strong></h5>
                  {roles.map(role => (
                    <CampaignRole
                      key={role.label}
                      iconName="ri-stop-fill"
                      label={role.label}
                      users={role.users}
                      formatter={role.formatter}
                    />
                  ))}
                </Col>

              </Row>

            </div>
          </Col>
          {/* <Col lg={9}>
            <CardBody className="border-end">
              <SimpleBar style={{ maxHeight: "190px" }} className="px-3 mx-n3">
                <ul className="list-unstyled mb-0 pt-2" id="candidate-list">
                  <li>
                    <Link to="#" className="d-flex align-items-center py-2">
                      <div className="flex-shrink-0 me-2">
                        <div className="avatar-xs">
                          <img src="" alt="" className="img-fluid rounded-circle candidate-img" />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fs-13 mb-1 text-truncate"><span className="candidate-name">Anna Adame</span> <span className="text-muted fw-normal">@Anna</span></h5>
                        <div className="d-none candidate-position">Web Developer</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="d-flex align-items-center py-2">
                      <div className="flex-shrink-0 me-2">
                        <div className="avatar-xs">
                          <img src="" alt="" className="img-fluid rounded-circle candidate-img" />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fs-13 mb-1 text-truncate"><span className="candidate-name">Jennifer Bailey</span> <span className="text-muted fw-normal">@Jennifer</span></h5>
                        <div className="d-none candidate-position">Marketing Director</div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </SimpleBar>
            </CardBody>
          </Col> */}

        </Row>
      </Card>
    </React.Fragment >
  );
};

export default OverviewCandidate;

import React from "react";
import { useSelector } from "react-redux";
import { Row, Col, ModalBody } from "reactstrap";
import { userSelector, campaignSelector } from 'selectors';

import { useSupervisorMembers, useCampaignRoles } from "shared/hooks";

const MembersViewModal = ({ campaignMember }) => {

  const {
    currentCampaignMember,
    campaignId,
    campaignMembers,
    campaignRoles,
    campaignElectionCommittees,
  } = useSelector(campaignSelector);

  const campaignSupervisors = useSupervisorMembers(campaignRoles, campaignMembers);
  const electionCommittees = useCampaignRoles(campaignElectionCommittees, campaignMembers);

  const displayField = (label, value) => {
    if (!value) return null;

    return (
      <Row className="mb-2">
        <Col lg={3} className="align-self-center font-weight-bold">{label}</Col>
        <Col lg={9}>{value}</Col>
      </Row>
    );
  };

  return (
    <div>
      <ModalBody className="vstack gap-3">
        <Row>
          <h4>
            <strong>
              [{campaignMember?.id}] {campaignMember?.name}
            </strong>
          </h4>
        </Row>

        {displayField("الرتبة", campaignMember?.role)}
        {displayField("تليفون", campaignMember?.phone)}
        {displayField("المشرف", campaignSupervisors.find(supervisor => supervisor.id === campaignMember.supervisor)?.name)}
        {displayField("اللجنة", electionCommittees.find(committee => committee.id === campaignMember.committee)?.name)}
        {displayField("ملاحظات", campaignMember?.notes)}
      </ModalBody>
    </div>
  );
};

export default MembersViewModal;

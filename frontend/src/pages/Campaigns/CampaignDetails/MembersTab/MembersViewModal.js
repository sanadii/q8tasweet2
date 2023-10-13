import React from "react";
import { useSelector } from "react-redux";
import { Row, Col, ModalBody } from "reactstrap";

const MembersViewModal = ({ campaignMember }) => {
  const { Users, Campaigns } = useSelector(state => state);

  const currentUser = Users?.currentUser;
  const currentCampaignMember = Campaigns?.currentCampaignMember;
  const campaignMembers = Campaigns?.campaignMembers || [];
  const campaignElectionCommittees = Campaigns?.campaignElectionCommittees || [];

  const supervisorMembers = campaignMembers.filter(member => member.rank === 3);

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

        {displayField("Rank", campaignMember?.rank)}
        {displayField("Mobile", campaignMember?.phone)}
        {campaignMember?.rank > 3 && displayField("Supervisor", supervisorMembers.find(supervisor => supervisor.id === campaignMember.supervisor)?.user?.name)}
        {campaignMember?.rank > 4 && displayField("Committee", campaignElectionCommittees.find(committee => committee.id === campaignMember.committee)?.name)}
        {displayField("Notes", campaignMember?.notes)}
      </ModalBody>
    </div>
  );
};

export default MembersViewModal;

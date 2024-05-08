// React, Redux & Store imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getElectors } from "store/actions";
import { Loader, TableContainer } from "shared/components";
import { campaignSelector, electorSelector } from 'selectors';

// Component imports
import ElectorsModal from "./ElectorsModal";
import { Id, Name, Actions } from "./ElectorsCol";

// Reactstrap (UI) imports
import { Col, Row, Card, CardHeader, CardBody, Label, Input } from "reactstrap";


import ElectorSearchForm from "./ElectorSearchForm";
import ElectorSearchDisplay from "./ElectorSearchDisplay";

export const ElectorSearchTab = () => {

  const { voters } = useSelector(electorSelector);
  const [voter, setElector] = useState(null);


  const {
    currentCampaignMember,
    campaignDetails,
    campaignMembers,
    campaignGuarantees,
    campaignAttendees,
  } = useSelector(campaignSelector);

  const [campaignGuaranteeList, setCampaignGuaranteeList] = useState(campaignGuarantees);
  const [campaignAttendeeList, setCampaignAttendeeList] = useState(campaignAttendees);

  useEffect(() => {
    setCampaignGuaranteeList(campaignGuarantees);
  }, [campaignGuarantees]);


  useEffect(() => {
    setCampaignAttendeeList(campaignAttendees);
  }, [campaignAttendees]);


  // const [campaignGuarantee, setCampaignGuarantee] = useState(null); // initialized to null

  // const guarantorMembers = campaignMembers?.filter(
  //   (member) => member.role === 3 || member.role === 4 || []
  // );

  // Modal Constants
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggle = useCallback(() => {
    setIsModalVisible(prevIsModalVisible => !prevIsModalVisible);
  }, []);


  return (
    <React.Fragment>
      <ElectorsModal
        modal={isModalVisible}
        modalMode={modalMode}
        toggle={toggle}
        voter={voter}
      />
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <Row className="mb-2">
                <h4>
                  <b>البحث - الناخبين</b>
                </h4>
              </Row>
            </CardHeader>
            <CardBody className="border border-dashed border-end-0 border-start-0">
              <ElectorSearchForm />
              <ElectorSearchDisplay
                setModalMode={setModalMode}
                toggle={toggle} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ElectorSearchTab;

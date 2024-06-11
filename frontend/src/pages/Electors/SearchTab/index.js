// React, Redux & Store imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getElectors, getElectorRelatedElectors } from "store/actions";
import { Loader, TableContainer } from "shared/components";
import { electionSelector, campaignSelector, electorSelector } from 'selectors';

// Component imports
import ElectorsModal from "./ElectorsModal";

// Reactstrap (UI) imports
import { Col, Row, Card, CardHeader, CardBody, } from "reactstrap";


import ElectorSearchForm from "./ElectorSearchForm";
import ElectorSearchDisplay from "./ElectorSearchDisplay";

export const ElectorSearchTab = ({ schema }) => {

  const dispatch = useDispatch();
  // Modal Constants

  const {
    currentCampaignMember,
    campaignDetails,
    campaignMembers,
    campaignGuarantees,
    campaignAttendees,
  } = useSelector(campaignSelector);

  const electionSlug = campaignDetails.election.slug
  const electionSchema = schema ? schema : electionSlug;

  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { voters } = useSelector(electorSelector);
  const [elector, setElector] = useState(null);


  const toggle = useCallback(() => {
    setIsModalVisible(prevIsModalVisible => !prevIsModalVisible);
  }, []);



  const [campaignGuaranteeList, setCampaignGuaranteeList] = useState(campaignGuarantees);
  const [campaignAttendeeList, setCampaignAttendeeList] = useState(campaignAttendees);

  useEffect(() => {
    setCampaignGuaranteeList(campaignGuarantees);
  }, [campaignGuarantees]);


  useEffect(() => {
    setCampaignAttendeeList(campaignAttendees);
  }, [campaignAttendees]);

  const handleElectorClick = useCallback(
    (selectedElector, modalMode) => {
      setElector(selectedElector);
      // Set the modalMode state here
      setModalMode(modalMode);
      handleElectorRelatedElectors(selectedElector)
      toggle();
    },
    [toggle, setModalMode]
  );

  const handleElectorRelatedElectors = (selectedElector) => {
    const relatedElectors = {
      schema: electionSchema,
      elector: selectedElector?.id,
    }
    dispatch(getElectorRelatedElectors(relatedElectors))

  }

  // const [campaignGuarantee, setCampaignGuarantee] = useState(null); // initialized to null

  // const guarantorMembers = campaignMembers?.filter(
  //   (member) => member.role === 3 || member.role === 4 || []
  // );




  return (
    <React.Fragment>
      <ElectorsModal
        modal={isModalVisible}
        modalMode={modalMode}
        toggle={toggle}
        elector={elector}
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
              <ElectorSearchForm electionSchema={electionSchema} />
              <ElectorSearchDisplay
                electionSchema={electionSchema}
                handleElectorClick={handleElectorClick}
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

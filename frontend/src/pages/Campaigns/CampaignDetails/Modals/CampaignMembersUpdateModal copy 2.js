// --------------- React & Redux imports ---------------
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignMember } from "../../../../store/actions";

// --------------- Component & Constants imports ---------------
import { MemberRankOptions } from "../../../../Components/constants";

// --------------- Form & Validation imports ---------------
import * as Yup from "yup";
import { useFormik } from "formik";

// --------------- Reactstrap (UI) imports ---------------
import { Col, Row, ModalBody, Label, Input, Form, FormFeedback } from "reactstrap";

const CampaignMembersUpdateModal = ({
  campaignMember,
  setOnModalSubmit,
}) => {
  const dispatch = useDispatch();

  const { currentCampaignMember, currentUser, campaignMembers, electionCommittees } = useSelector((state) => ({
    currentUser: state.Users.currentUser,
    currentCampaignMember: state.Campaigns.currentCampaignMember,
    electionCommittees: state.Campaigns.electionCommittees,
    campaignMembers: state.Campaigns.campaignMembers,
  }));

  const [electionCommitteeList, setElectionCommitteeList] =
    useState(electionCommittees);

  useEffect(() => {
    setElectionCommitteeList(electionCommittees);
  }, [electionCommittees]);

  const supervisorMembers = campaignMembers.filter(
    (member) => member.rank === 3
  );
  const handleUpdateButton = () => {
    validation.submitForm();
  };

  useEffect(() => {
    // Set the callback action for the update modal
    setOnModalSubmit(() => handleUpdateButton);
    return () => setOnModalSubmit(null); // Cleanup on unmount
  }, []);


  // Initial Values ---------------
  const initialValues = {
    id: campaignMember?.id || "",
    campaignId: campaignMember?.campaignId ?? "",
    rank: campaignMember?.rank ?? 0,
    committee: campaignMember?.committee ?? 0,
    supervisor: campaignMember?.supervisor ?? 0,
    mobile: campaignMember?.mobile ?? "",
    notes: campaignMember?.notes ?? ""
  };


  // Validation ---------------
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: Yup.object({
      rank: Yup.number().integer().required("rank is required"),
      supervisor: Yup.number().integer().required("supervisor is required"),
      committee: Yup.number().integer().required("committee is required"),
    }),

    onSubmit: (values) => {
      const updatedCampaignMember = {
        id: campaignMember?.id || "",
        campaignId: campaignMember?.campaignId ?? "",
        rank: campaignMember?.rank ?? 0,
        committee: campaignMember?.committee ?? 0,
        supervisor: campaignMember?.supervisor ?? 0,
        mobile: campaignMember?.mobile ?? "",
        notes: campaignMember?.notes ?? ""
      };

      dispatch(updateCampaignMember(updatedCampaignMember));
      validation.resetForm();
    },
  });


  return (
    <div>
      <Form
        className="tablelist-form"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <ModalBody className="vstack gap-3">
          <Row>
            <input type="hidden" id="id-field" />
            <h4>
              <strong>
                [{validation.values.id}] {validation.values.name}
              </strong>
            </h4>
          </Row>

          {campaignMember && currentUser.id !== campaignMember.userId && (
            <Row>
              <Col lg={3} className="align-self-center">
                <Label for="rank-field" className="mb-0">
                  Rank
                </Label>
              </Col>
              <Col lg={9}>
                <Input
                  id="rank-field"
                  name="rank"
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.rank || ""}
                >
                  <option value="">-- Select --</option>
                  {MemberRankOptions.filter(
                    (option) => option.id > currentCampaignMember.rank
                  ).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
          )}

          <Row>
            <Col lg={3} className="align-self-center">
              <Label for="mobile-field" className="mb-0">
                Mobile
              </Label>
            </Col>
            <Col lg={9}>
              <Input
                name="mobile"
                id="mobile-field"
                className="form-control"
                placeholder="Enter Guarantee Mobile"
                type="number"
                validate={{
                  required: { value: true },
                }}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.mobile || ""}
                invalid={
                  validation.touched.mobile && validation.errors.mobile
                    ? true
                    : false
                }
              />
              {validation.touched.mobile && validation.errors.mobile ? (
                <FormFeedback type="invalid">
                  {validation.errors.mobile}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>

          {validation.values.rank > 3 && (
            <Row>
              <Col lg={3} className="align-self-center">
                <Label for="supervisor-field" className="mb-0">
                  Supervisor
                </Label>
              </Col>
              <Col lg={9}>
                <Input
                  id="supervisor-field"
                  name="supervisor"
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.supervisor || ""}
                >
                  <option value="">-- Select --</option>
                  {supervisorMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.user.name}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
          )}

          {validation.values.rank > 4 && (
            <Row>
              <Col lg={3} className="align-self-center">
                <Label for="committee-field" className="mb-0">
                  Committee
                </Label>
              </Col>
              <Col lg={9}>
                <Input
                  id="committee-field"
                  name="committee"
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.committee || ""}
                >
                  <option value="">-- Select --</option>
                  {electionCommitteeList.map((committee) => (
                    <option key={committee.id} value={committee.id}>
                      {committee.name}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
          )}

          <Row>
            <Col lg={3} className="align-self-center">
              <Label for="notes-field" className="mb-0">
                Notes
              </Label>
            </Col>
            <Col lg={9}>
              <textarea
                name="notes"
                id="notes-field"
                className="form-control"
                placeholder="Enter Notes"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.notes || ""}
                invalid={
                  validation.touched.notes && validation.errors.notes ? true : false
                }
              />
              {validation.touched.notes && validation.errors.notes && (
                <FormFeedback type="invalid">
                  {validation.errors.notes}
                </FormFeedback>
              )}
            </Col>
          </Row>
        </ModalBody>
      </Form>
    </div>
  );
};

export default CampaignMembersUpdateModal;

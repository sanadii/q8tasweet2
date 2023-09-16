// --------------- React & Redux imports ---------------
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignMember } from "../../../../store/actions";

// --------------- Component & Constants imports ---------------
import { MemberRankOptions } from "../../../../Components/constants";

// --------------- Form validation imports ---------------
import * as Yup from "yup";
import { useFormik } from "formik";

// --------------- Reactstrap (UI) imports ---------------
import {
  Col,
  Row,
  ModalBody,
  Label,
  Input,
  Form,
  FormFeedback,
} from "reactstrap";

const CampaignMembersUpdateModal = ({
  campaignMember,
  toggle,
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


  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (campaignMember && campaignMember.id) || "",
      campaignId: (campaignMember && campaignMember.campaignId) || "",
      rank: (campaignMember && campaignMember.rank) || 0,
      committee: (campaignMember && campaignMember.committee) || 0,
      supervisor: (campaignMember && campaignMember.supervisor) || 0,
      mobile: (campaignMember && campaignMember.mobile) || "",
      notes: (campaignMember && campaignMember.notes) || "",
    },
    validationSchema: Yup.object({
      rank: Yup.number().integer().required("rank is required"),
      supervisor: Yup.number().integer().required("supervisor is required"),
      committee: Yup.number().integer().required("committee is required"),
    }),

    onSubmit: (values) => {
      const updatedCampaignMember = {
        id: values.id,
        // status: parseInt(values.status, 10),
        campaignId: parseInt(values.campaignId, 10),
        rank: parseInt(values.rank, 10),
        committee: parseInt(values.committee, 10),
        supervisor: parseInt(values.supervisor, 10),
        mobile: values.mobile,
        notes: values.notes,
      };
      dispatch(updateCampaignMember(updatedCampaignMember));
      validation.resetForm();
      toggle();
    },
  });

  let fields = [];

  // Conditionally add rank if the campaignMember exists and is not the currentUser.
  if (campaignMember && currentUser.id !== campaignMember.userId) {
    const filteredRankOptions = MemberRankOptions.filter(
      (option) => option.id > currentCampaignMember.rank
    );

    fields.push({
      id: "rank-field",
      label: "Rank",
      type: "select",
      options: filteredRankOptions,
      name: "rank",
    });
  }

  // Mobile field is always shown.
  fields.push({
    id: "mobile-field",
    label: "Mobile",
    type: "text",
    name: "mobile",
  });

  // Conditionally add supervisor if rank is above 3.
  if (validation.values.rank > 3) {
    fields.push({
      id: "supervisor-field",
      label: "Supervisor",
      type: "select",
      options: supervisorMembers,
      name: "supervisor",
      valueAccessor: (item) => item.user.name,
    });
  }

  // Conditionally add committee if rank is above 4.
  if (validation.values.rank > 4) {
    fields.push({
      id: "committee-field",
      label: "Committee",
      type: "select",
      options: electionCommitteeList,
      name: "committee",
      valueAccessor: (item) => item.name,
    });
  }

  // Notes field is always shown.
  fields.push({
    id: "notes-field",
    label: "Notes",
    type: "textarea",
    name: "notes",
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

          {fields.map((field) => (
            <Row key={field.id}>
              <Col lg={3} className="align-self-center">
                <Label for={field.id} className="mb-0">
                  {field.label}
                </Label>
              </Col>
              <Col lg={9}>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    id={field.id}
                    className="form-control"
                    placeholder={`Enter ${field.label}`}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values[field.name] || ""}
                    invalid={
                      validation.touched[field.name] &&
                        validation.errors[field.name]
                        ? true
                        : false
                    }
                  />
                ) : (
                  <Input
                    name={field.name}
                    type={field.type}
                    className={field.type === "select" ? "form-select" : ""}
                    id={field.id}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values[field.name] || ""}
                  >
                    {field.type === "select" && (
                      <option value="">-- Select --</option>
                    )}

                    {field.options &&
                      field.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {field.valueAccessor
                            ? field.valueAccessor(option)
                            : option.name}
                        </option>
                      ))}
                  </Input>
                )}

                {validation.touched[field.name] &&
                  validation.errors[field.name] ? (
                  <FormFeedback type="invalid">
                    {validation.errors[field.name]}
                  </FormFeedback>
                ) : null}
              </Col>
            </Row>
          ))}
        </ModalBody>
      </Form>
    </div>
  );
};

export default CampaignMembersUpdateModal;

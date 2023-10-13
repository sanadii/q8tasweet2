// React & Redux
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignMember } from "store/actions";
import { userSelector, campaignSelector } from 'Selectors';

// Component & Constants imports 
import { useUserRoles, useSupervisorMembers, useCampaignRanks } from "Components/Hooks";

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

// Reactstrap (UI) imports
import { Col, Row, ModalBody, Label, Input, Form, FormFeedback } from "reactstrap";


// TO DO
// Get Available Groups to assign the RANK
const MembersUpdateModal = ({
  campaignMember,
  setOnModalSubmit,
}) => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector(userSelector);
  const {
    currentCampaignMember,
    campaignId,
    campaignMembers,
    campaignRanks,
    campaignElectionCommittees
  } = useSelector(campaignSelector);

  const { isAdmin, isSubscriber, isModerator, isParty, isCandidate, isSupervisor, isGuarantor, isAttendant, isSorter, isBelowSupervisor, isAttendantOrSorter } = useUserRoles();

  const [campaignCommitteeList, setElectionCommitteeList] =
    useState(campaignElectionCommittees);

  useEffect(() => { setElectionCommitteeList(campaignElectionCommittees); }, [campaignElectionCommittees]);

  const supervisorOptions = useSupervisorMembers(campaignRanks, campaignMembers);
  const rankOptions = useCampaignRanks(campaignRanks, currentCampaignMember);
  console.log("rankOptions:", rankOptions);
  
  // Check campaignRanks, if the rank role is either "CampaignGuarantor", "CampaignAttendant", "CampaignSorter", return true
  const supervisedMember = useMemo(() => {
    return campaignRanks
      .filter(rank => ["CampaignGuarantor", "CampaignAttendant", "CampaignSorter"].includes(rank.role))
      .map(rank => rank.id);
  }, [campaignRanks]);

  const { id, campaign, rank, committee, supervisor, phone, notes } = campaignMember || {};

  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: id || "",
      campaign: campaignId || "",
      rank: rank || "",
      committee: committee || "",
      supervisor: supervisor || "",
      phone: phone || "",
      notes: notes || "",
    },
    validationSchema: Yup.object({
      rank: Yup.number().integer().required("rank is required"),
      supervisor: Yup.number().integer(),
      committee: Yup.number().integer(),
    }),

    onSubmit: (values) => {
      const updatedCampaignMember = {
        id: values.id,
        campaign: parseInt(values.campaign, 10),
        rank: parseInt(values.rank, 10),
        committee: parseInt(values.committee, 10),
        supervisor: parseInt(values.supervisor, 10),
        phone: values.phone,
        notes: values.notes,
      };
      dispatch(updateCampaignMember(updatedCampaignMember));
      validation.resetForm();
    },
  });

  // Submit
  const handleUpdateButton = useCallback(() => {
    validation.submitForm();
  }, [validation]);

  useEffect(() => {
    setOnModalSubmit(() => handleUpdateButton);

    return () => setOnModalSubmit(null); // Cleanup on unmount
  }, []);

  let fields = [];

  // Conditionally add rank if the campaignMember exists and is not the currentUser.
  if (campaignMember && currentUser.id !== campaignMember.userId) {
    const filteredRankOptions = campaignRanks.filter(
      (option) => option.id > currentCampaignMember.rank
    );

    fields.push({
      id: "rank-field",
      label: "Rank",
      type: "select",
      options: rankOptions,
      name: "rank",
    });
  }

  // Mobile field is always shown.
  fields.push({
    id: "phone-field",
    label: "Mobile",
    type: "text",
    name: "phone",
  });

  // supervisedMemberRanksConditionally add supervisor if rank is above 3.
  if (validation.values.rank > 3) {
    fields.push({
      id: "supervisor-field",
      label: "المشرف",
      type: "select",
      options: supervisorOptions,
      name: "supervisor",
      valueAccessor: (item) => item.fullName,
    });
  }

  // Conditionally add committee if rank is above 4.
  if (validation.values.rank > 4) {
    fields.push({
      id: "committee-field",
      label: "Committee",
      type: "select",
      options: campaignCommitteeList,
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
              [{validation.values.id}] {validation.values.fullName}
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
  );
};

export default MembersUpdateModal;

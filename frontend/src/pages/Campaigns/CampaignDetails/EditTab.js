// --------------- React & Redux imports ---------------
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignMember } from "../../../store/actions";
import { electionsSelector } from '../../../Selectors/electionsSelector';

// --------------- Component & Constants imports ---------------
import { MemberRankOptions } from "../../../Components/constants";

// --------------- Form validation imports ---------------
import * as Yup from "yup";
import { useFormik } from "formik";

// --------------- Reactstrap (UI) imports ---------------
import { Col, Row, ModalBody, Label, Input, Form, FormFeedback, Card, CardHeader, CardBody, ModalFooter } from "reactstrap";



const EditTab = () => {
  const dispatch = useDispatch();

  document.title = "Starter | Q8Tasweet - React Admin & Dashboard Template";

  const { currentCampaignUser, currentUser, campaignMembers, campaignElectionCommittees } = useSelector(electionsSelector);

  const [electionCommitteeList, setElectionCommitteeList] =
    useState(campaignElectionCommittees);

  useEffect(() => {
    setElectionCommitteeList(campaignElectionCommittees);
  }, [campaignElectionCommittees]);

  const supervisorMembers = campaignMembers.filter(
    (member) => member.rank === 3
  );
  const handleUpdateButton = () => {
    validation.submitForm();
  };

  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (currentCampaignUser && currentCampaignUser.id) || "",
      campaignId: (currentCampaignUser && currentCampaignUser.campaignId) || "",
      userId: (currentCampaignUser && currentCampaignUser.userId) || "",
      name: (currentCampaignUser && currentCampaignUser.name) || "",
      rank: (currentCampaignUser && currentCampaignUser.rank) || 0,
      committee: (currentCampaignUser && currentCampaignUser.committee) || 0,
      supervisor: (currentCampaignUser && currentCampaignUser.supervisor) || 0,
      mobile: (currentCampaignUser && currentCampaignUser.mobile) || "",
      notes: (currentCampaignUser && currentCampaignUser.notes) || "",
      status: (currentCampaignUser && currentCampaignUser.status) || 0,
    },
    validationSchema: Yup.object({
      status: Yup.number().integer().required("Status is required"),
      rank: Yup.number().integer().required("rank is required"),
      supervisor: Yup.number().integer().required("supervisor is required"),
      committee: Yup.number().integer().required("committee is required"),
    }),

    onSubmit: (values) => {
      const updatedCampaignMember = {
        id: values.id,
        rank: parseInt(values.rank, 10),
        committee: parseInt(values.committee, 10),
        supervisor: parseInt(values.supervisor, 10),
        mobile: values.mobile,
        notes: values.notes,
      };
      dispatch(updateCampaignMember(updatedCampaignMember));
      validation.resetForm();
    },
  });

  let fields = [];

  // Conditionally add rank if the currentCampaignUser exists and is not the currentUser.


  fields.push({
    id: "rank-field",
    label: "Rank",
    type: "select",
    options: MemberRankOptions,
    name: "rank",
  });


  // Mobile field is always shown.
  fields.push({
    id: "mobile-field",
    label: "Mobile",
    type: "text",
    name: "mobile",
  });

  // Conditionally add supervisor if rank is above 3.
  fields.push({
    id: "supervisor-field",
    label: "Supervisor",
    type: "select",
    options: supervisorMembers,
    name: "supervisor",
    valueAccessor: (item) => item.user.name,
  });


  // Conditionally add committee if rank is above 4.
  fields.push({
    id: "committee-field",
    label: "Committee",
    type: "select",
    options: electionCommitteeList,
    name: "committee",
    valueAccessor: (item) => item.name,
  });


  // Notes field is always shown.
  fields.push({
    id: "notes-field",
    label: "Notes",
    type: "textarea",
    name: "notes",
  });

  return (
    <React.Fragment>

      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <Row className="mb-2">
                <h4>
                  <b>For Staff Testing Use</b>
                </h4>
              </Row>
            </CardHeader>
            <CardBody className="pt-0">

              <Form
                className="tablelist-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  handleUpdateButton();  // Call the function when the form is submitted
                  return false;
                }}
              >
                <ModalBody className="vstack gap-3">
                  <Row>
                    <input type="hidden" id="id-field" />
                    <h4>
                      <strong>
                        [{currentCampaignUser.id}] {currentCampaignUser.fullName}
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
                              validation.touched[field.name] && validation.errors[field.name]
                                ? true
                                : undefined
                            }
                          />
                        ) : field.type === "select" ? (
                          <Input
                            name={field.name}
                            type={field.type}
                            className="form-select"
                            id={field.id}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values[field.name] || ""}
                            invalid={
                              validation.touched[field.name] && validation.errors[field.name]
                                ? true
                                : false
                            }
                          >
                            <option value="">-- Select --</option>
                            {field.options &&
                              field.options.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {field.valueAccessor
                                    ? field.valueAccessor(option)
                                    : option.name}
                                </option>
                              ))}
                          </Input>
                        ) : (
                          <Input
                            name={field.name}
                            type={field.type}
                            id={field.id}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values[field.name] || ""}
                            invalid={
                              validation.touched[field.name] && validation.errors[field.name]
                                ? true
                                : undefined
                            }
                          />
                        )}

                        {validation.touched[field.name] &&
                          validation.errors[field.name] && (
                            <FormFeedback type="invalid">
                              {validation.errors[field.name]}
                            </FormFeedback>
                          )}
                      </Col>
                    </Row>
                  ))}

                </ModalBody>
                <ModalFooter>
                  <Row className="mt-3"> {/* Adding a margin-top for some space above the button */}
                    <Col className="text-end"> {/* Aligning the button to the right */}
                      <button type="submit" className="btn btn-primary">
                        Update
                      </button>
                    </Col>
                  </Row>

                </ModalFooter>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default EditTab;

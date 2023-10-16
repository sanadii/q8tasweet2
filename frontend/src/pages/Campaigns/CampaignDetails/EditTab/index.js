// React & Redux imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaign, getCampaignModerators } from "store/actions";
import { userSelector, campaignSelector } from 'Selectors';
import { Link } from 'react-router-dom';

// Component & Constants imports
import AddCampaignModerator from "./AddCampaignModerator";
import AddCampaignDirector from "./AddCampaignDirector";

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

// Reactstrap (UI) imports
import { Col, Row, ModalBody, Label, Input, Form, FormFeedback, Card, CardHeader, CardBody, ModalFooter } from "reactstrap";



const EditTab = () => {
  const dispatch = useDispatch();

  document.title = "Starter | Q8Tasweet - React Admin & Dashboard Template";

  const { currentUser } = useSelector(userSelector);
  const { currentCampaignMember, campaignMembers, campaignElectionCommittees } = useSelector(campaignSelector);
  const { campaignModerators } = useSelector(userSelector);


  useEffect(() => {
    if (campaignModerators && !campaignModerators.length) {
      dispatch(getCampaignModerators());
    }
  }, [dispatch, campaignModerators]);


  const handleUpdateButton = () => {
    validation.submitForm();
  };

  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (currentCampaignMember && currentCampaignMember.id) || "",
      election_candidate: (currentCampaignMember && currentCampaignMember.election_candidate) || "",
      description: (currentCampaignMember && currentCampaignMember.description) || "",
      target_votes: (currentCampaignMember && currentCampaignMember.target_votes) || "",
      twitter: (currentCampaignMember && currentCampaignMember.twitter) || "",
      instagram: (currentCampaignMember && currentCampaignMember.instagram) || 0,
      website: (currentCampaignMember && currentCampaignMember.website) || 0,
    },
    validationSchema: Yup.object({
    }),

    onSubmit: (values) => {
      const updatedCampaignMember = {
        id: values.id,
        election_candidate: parseInt(values.election_candidate, 10),
        description: parseInt(values.description, 10),
        target_votes: parseInt(values.target_votes, 10),
        twitter: values.twitter,
        instagram: values.instagram,
        website: values.website,
      };
      dispatch(updateCampaign(updatedCampaignMember));
      validation.resetForm();
    },
  });

  let fields = [];

  // Conditionally add role if the currentCampaignMember exists and is not the currentUser.


  fields.push({
    id: "description-field",
    label: "الوصف",
    type: "text",
    name: "description",
  });


  // Mobile field is always shown.
  fields.push({
    id: "target-votes-field",
    label: "الهدف",
    type: "text",
    name: "target-votes",
  });

  // Conditionally add supervisor if role is above 3.
  fields.push({
    id: "twitter-field",
    label: "تويتر",
    type: "text",
    name: "twitter",
    valueAccessor: (item) => item.user.name,
  });


  // Conditionally add committee if role is above 4.
  fields.push({
    id: "instagram-field",
    label: "انستقرام",
    type: "text",
    name: "instagram",
    valueAccessor: (item) => item.name,
  });


  // Notes field is always shown.
  fields.push({
    id: "website-field",
    label: "الموقع الالكتروني",
    type: "text",
    name: "website",
  });

  return (
    <React.Fragment>
      <Row>
        <Col xxl={3}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">التواصل الإجتماعي</h5>
                </div>

              </div>
              <div className="mb-3 d-flex">
                <div className="avatar-xs d-block flex-shrink-0 me-3">
                  <span className="avatar-title rounded-circle fs-16 bg-primary text-light">
                    <i className="ri-twitter-fill"></i>
                  </span>
                </div>
                <Input type="text" className="form-control" id="TwitterUsername" placeholder="Username" />
              </div>
              <div className="mb-3 d-flex">
                <div className="avatar-xs d-block flex-shrink-0 me-3">
                  <span className="avatar-title rounded-circle fs-16 bg-danger">
                    <i className="ri-instagram-fill"></i>
                  </span>
                </div>
                <Input type="text" className="form-control" id="InstagramUsername" placeholder="Username" />
              </div>
              <div className="mb-3 d-flex">
                <div className="avatar-xs d-block flex-shrink-0 me-3">
                  <span className="avatar-title rounded-circle fs-16 bg-success">
                    <i className="ri-dribbble-fill"></i>
                  </span>
                </div>
                <Input type="text" className="form-control" id="websiteInput" placeholder="www.q8tasweet.com" />
              </div>
            </CardBody>
          </Card>
          <AddCampaignModerator />
          {/* <AddCampaignDirector /> */}
        </Col>
        <Col xxl={9}>
          <Card>
            <CardBody>
              <h5>تعديل الحملة الإنتخابية</h5>

              <Form
                className="tablelist-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  handleUpdateButton();  // Call the function when the form is submitted
                  return false;
                }}
              >
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
                <ModalFooter>
                  <Row className="mt-3"> {/* Adding a margin-top for some space above the button */}
                    <Col className="text-end"> {/* Aligning the button to the right */}
                      <button type="submit" className="btn btn-primary">
                        تعديل
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

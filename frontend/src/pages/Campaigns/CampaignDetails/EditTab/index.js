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
import { Col, Button, Row, ModalBody, Label, Input, Form, FormFeedback, Card, CardHeader, CardBody, ModalFooter } from "reactstrap";



const EditTab = () => {
  const dispatch = useDispatch();

  document.title = "Starter | Q8Tasweet - React Admin & Dashboard Template";

  // State Management
  const { currentUser } = useSelector(userSelector);
  const { campaignId, campaign, campaignMembers, campaignElectionCommittees } = useSelector(campaignSelector);
  const { campaignModerators } = useSelector(userSelector);



  useEffect(() => {
    if (campaignModerators && !campaignModerators.length) {
      dispatch(getCampaignModerators());
    }
  }, [dispatch, campaignModerators]);

  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: (campaign && campaign.description) || "",
      targetVotes: (campaign && campaign.targetVotes) || "",
      twitter: (campaign && campaign.twitter) || "",
      instagram: (campaign && campaign.instagram) || "",
      website: (campaign && campaign.website) || "",
    },
    validationSchema: Yup.object({
    }),

    onSubmit: (values) => {
      const updatedCampaign = {
        id: campaignId,
        description: values.description,
        targetVotes: parseInt(values.targetVotes, 10),
        twitter: values.twitter,
        instagram: values.instagram,
        website: values.website,
      };
      dispatch(updateCampaign(updatedCampaign));
      validation.resetForm();
    },
  });


  // Conditionally add role if the campaign exists and is not the currentUser.
  const fields = [
    {
      id: "description-field",
      name: "description",
      label: "الوصف",
      type: "text",
    },
    {
      id: "target-votes-field",
      name: "targetVotes",
      label: "الهدف",
      type: "text",
    },
  ];

  const socialMediaFields = [
    {
      id: "twitter-field",
      name: "twitter",
      label: "تويتر",
      type: "text",
    },
    {
      id: "instagram-field",
      name: "instagram",
      label: "انستقرام",
      type: "text",
    },
    {
      id: "website-field",
      name: "website",
      label: "الموقع الالكتروني",
      type: "text",
    },
  ];

  return (
    <Form
      className="tablelist-form"
      onSubmit={e => {
        e.preventDefault();
        validation.handleSubmit();
      }}
    >
      <Row>
        <Col xxl={3}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <h5 className="card-title mb-0 flex-grow-1">التواصل الإجتماعي</h5>
              </div>
              {socialMediaFields.map(field => (
                <div key={field.id} className="mb-3 d-flex align-items-center">
                  <div className="avatar-xs d-block flex-shrink-0 me-3">
                    <span className="avatar-title rounded-circle fs-16">
                      <i className={`ri-${field.name}-fill`}></i>
                    </span>
                  </div>
                  <InputComponent
                    field={field}
                    validation={validation}
                  />
                </div>
              ))}
            </CardBody>

          </Card>
          <AddCampaignModerator />
        </Col>

        <Col xxl={9}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <h5 className="card-title mb-0 flex-grow-1">تعديل الحملة الإنتخابية</h5>
              </div>
              {fields.map(field => {
                const { id, label, name, type, options, valueAccessor } = field;

                return (
                  <Row key={id} className="mb-3 align-items-center"> {/* Added consistent margin and alignment */}
                    <Col lg={2} className="align-self-center">
                      <Label for={id}>{label}</Label>
                    </Col>
                    <Col lg={10}>
                      <InputComponent
                        field={field}
                        validation={validation}
                        valueAccessor={valueAccessor}
                        options={options}
                      />
                      {validation.touched[name] && validation.errors[name] && (
                        <FormFeedback type="invalid">
                          {validation.errors[name]}
                        </FormFeedback>
                      )}
                    </Col>
                  </Row>
                );
              })}

              <ModalFooter>
                <Row className="mt-3">
                  <Col className="text-end">
                    <Button type="submit" color="primary">تعديل</Button>
                  </Col>
                </Row>
              </ModalFooter>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

const InputComponent = ({ field, validation, valueAccessor, options }) => {
  const { id, name, type, label } = field;

  switch (type) {
    case 'text':
      return (
        <Input
          type="text"
          name={name}
          id={id}
          placeholder={`اكتب ${label}`}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values[name] || ""}
          invalid={validation.touched[name] && validation.errors[name]}
        />
      );
    case 'select':
      return (
        <Input
          type="select"
          name={name}
          id={id}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values[name] || ""}
          invalid={validation.touched[name] && validation.errors[name]}
        >
          <option value="">-- Select --</option>
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {valueAccessor ? valueAccessor(option) : option.name}
            </option>
          ))}
        </Input>
      );
    default:
      return (
        <Input
          type={type}
          name={name}
          id={id}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values[name] || ""}
          invalid={validation.touched[name] && validation.errors[name]}
        />
      );
  }
};
export default EditTab;

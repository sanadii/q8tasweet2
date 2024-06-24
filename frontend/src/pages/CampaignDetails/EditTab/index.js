// React & Redux imports
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { updateCampaign, getCampaignModerators } from "store/actions";
import { userSelector, campaignSelector } from 'selectors';

// Component & Constants imports
import { FormFields } from "shared/components"
import AddCampaignModerator from "./AddCampaignModerator";

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

// Reactstrap (UI) imports
import { Col, Button, Row, Input, Form, FormFeedback, Card, CardBody, ModalFooter } from "reactstrap";



const EditTab = () => {
  const dispatch = useDispatch();
  document.title = "Starter | Q8Tasweet - React Admin & Dashboard Template";

  // State Management
  const { campaignId, campaign } = useSelector(campaignSelector);
  const { campaignModerators } = useSelector(userSelector);


  // useEffect(() => {
  //   if (campaignModerators && !campaignModerators.length) {
  //     dispatch(getCampaignModerators());
  //   }
  // }, [dispatch, campaignModerators]);

  // Form validation and submission
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
  const campaignFields = [
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

  const campaignSocialFields = [
    {
      id: "twitter-field",
      name: "twitter",
      label: "تويتر",
      type: "social",
      colSize: 12,
      icon: "ri-twitter-fill",
      iconBg: "bg-info text-light",
    },
    {
      id: "instagram-field",
      name: "instagram",
      label: "انستقرام",
      type: "social",
      colSize: 12,
      icon: "ri-instagram-fill",
      iconBg: "bg-danger",
    },
    {
      id: "website-field",
      name: "website",
      label: "الموقع الالكتروني",
      type: "social",
      colSize: 12,
      icon: "ri-instagram-fill",
      iconBg: "bg-danger",
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
      <Card>
        <CardBody>
          <Row>
            <Col lg={3} md={12}>

              <div className="d-flex align-items-center mb-4">
                <h5 className="card-title mb-0 flex-grow-1">التواصل الإجتماعي</h5>
              </div>
              {campaignSocialFields.map(field => (
                <FormFields
                  key={field.id}
                  field={field}
                  validation={validation}
                />
              ))}

              <AddCampaignModerator />
            </Col>

            <Col lg={9} md={12}>

              <div className="d-flex align-items-center mb-4">
                <h5 className="card-title mb-0 flex-grow-1">تعديل الحملة الإنتخابية</h5>
              </div>
              {campaignFields.map(field => (
                <FormFields
                  key={field.id}
                  field={field}
                  validation={validation}
                />
              ))}
              <ModalFooter>
                <Row className="mt-3">
                  <Col className="text-end">
                    <Button type="submit" color="primary">تعديل</Button>
                  </Col>
                </Row>
              </ModalFooter>

            </Col>
          </Row>
        </CardBody>
      </Card>
    </Form >
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

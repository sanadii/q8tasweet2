// React & Redux imports
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCampaignGuaranteeGroup, updateCampaignGuaranteeGroup } from "store/actions";
import { campaignSelector } from 'selectors';

// Form & Validation imports
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";
import { FormFields } from "shared/components";

// Reactstrap (UI) imports
import { Row } from "reactstrap";


const GuaranteeGroupsModalUpdate = ({
  campaignGuaranteeGroup,
  setOnModalSubmit,
  campaignMembers,
}) => {
  const dispatch = useDispatch();

  const { campaignId, campaignElectionCommittees } = useSelector(campaignSelector); // Directly use without redundant useState

  // Initial Values
  const initialValues = {
    id: campaignGuaranteeGroup?.id || "",
    campaign: campaignId,
    member: campaignGuaranteeGroup?.member || "",
    phone: campaignGuaranteeGroup?.phone || "",
    status: campaignGuaranteeGroup?.status || 0,
    notes: campaignGuaranteeGroup?.notes || "",
  };

  // Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: Yup.object({
      status: Yup.number().integer().required("Status is required"),
    }),

    onSubmit: (values) => {
      const updatedCampaignGuaranteeGroup = {
        id: campaignGuaranteeGroup ? campaignGuaranteeGroup.id : 0,
        name: values.name,
        // phone: values.phone,
        notes: values.notes,
      };
      dispatch(updateCampaignGuaranteeGroup(updatedCampaignGuaranteeGroup));
      validation.resetForm();
    },
  });

  const handleUpdateButton = useCallback(() => {
    validation.submitForm();
  }, [validation]);


  useEffect(() => {
    setOnModalSubmit(() => handleUpdateButton);
    return () => setOnModalSubmit(null);
  }, [handleUpdateButton, setOnModalSubmit]);


  const fields = [

    {
      id: "group-name-field",
      name: "name",
      label: "اسم المجموعة",
      type: "text",
      colSize: 6,
    },
    {
      id: "phone-number-field",
      name: "phone",
      label: "رقم الهاتف",
      type: "number",
      colSize: 6,
    },
    {
      id: "voters-field",
      name: "members",
      label: "الناخبين",
      type: "select",
      options: [], // Populate this array dynamically with voters' data
      colSize: 12,
    },

    {
      id: "note-field",
      name: "note",
      label: "ملاحظات",
      type: "textarea",
      colSize: 12,
    },
  ]

  return (
    <React.Fragment>
      <Row>
        {
          fields.map(field => {
            return (field.condition === undefined || field.condition) && (
              <FormFields
                key={field.id}
                field={field}
                validation={validation}
              />
            );
          })
        }
      </Row>
    </React.Fragment>
  );
};
export default GuaranteeGroupsModalUpdate;

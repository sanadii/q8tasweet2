// React & Redux imports
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCampaignGuaranteeGroup, updateCampaignGuaranteeGroup } from "store/actions";
import { campaignSelector } from 'selectors';

// Form & Validation imports
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormFields } from "shared/components";
import "react-toastify/dist/ReactToastify.css";

// Reactstrap (UI) imports
import { Row } from "reactstrap";


const GuaranteeGroupsModalUpdate = ({
  toggle,
  campaignGuaranteeGroup,
  setOnModalSubmit,
  campaignMembers,
  modalMode,
}) => {
  const dispatch = useDispatch();

  const { electionSlug, campaignId, campaignElectionCommittees } = useSelector(campaignSelector); // Directly use without redundant useState

  // Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: campaignGuaranteeGroup?.id || "",
      schema: electionSlug,
      member: campaignGuaranteeGroup?.member || "",
      phone: campaignGuaranteeGroup?.phone || "",
      status: campaignGuaranteeGroup?.status || 0,
      note: campaignGuaranteeGroup?.note || "",
    },

    validationSchema: Yup.object({
      status: Yup.number().integer().required("Status is required"),
    }),

    onSubmit: (values) => {
      if (modalMode === "GuaranteeGroupUpdateModal") {
        const updatedCampaignGuaranteeGroup = {
          schema: electionSlug,
          id: campaignGuaranteeGroup ? campaignGuaranteeGroup.id : 0,
          name: values.name || "",
          phone: values.phone || "",
          voters: values.voters || "",
          note: values.note || "",
        };

        // Update election
        dispatch(updateCampaignGuaranteeGroup(updatedCampaignGuaranteeGroup)
        );
      } else {
        const updatedCampaignGuaranteeGroup = {
          schema: electionSlug,
          name: values.name || "",
          phone: values.phone || "",
          voters: values.voters || "",
          note: values.note || "",
        };
        dispatch(addCampaignGuaranteeGroup(updatedCampaignGuaranteeGroup));
      }

      validation.resetForm();
      toggle();
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
      name: "voters",
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

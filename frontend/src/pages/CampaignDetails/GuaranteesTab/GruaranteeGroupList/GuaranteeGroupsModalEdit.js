import React, { useState, useEffect, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector } from 'selectors';
import { addCampaignGuaranteeGroup, updateCampaignGuaranteeGroup } from "store/actions";


// Form & Validation imports
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormFields } from "shared/components";
import "react-toastify/dist/ReactToastify.css";

// Reactstrap (UI) imports
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form } from "reactstrap";


const GuaranteeGroupsModalEdit = ({
  toggle,
  modalMode,
  campaignGuaranteeGroup
}) => {
  const dispatch = useDispatch();

  const { campaignMembers } = useSelector(campaignSelector);
  const { electionSlug, campaignId, campaignElectionCommittees, campaignGuarantees, currentCampaignMember } = useSelector(campaignSelector); // Directly use without redundant useState

  const myCampaignGuarantees = campaignGuarantees && campaignGuarantees
    .filter((guarantee) => guarantee.member === currentCampaignMember.id)
    .map((guarantee) => ({
      label: guarantee.fullName,
      value: guarantee.id
    }));

  // Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      // id: campaignGuaranteeGroup?.id || 0,
      name: campaignGuaranteeGroup?.name || "",
      election: electionSlug,
      member: campaignMembers?.id,
      guarantees: campaignGuaranteeGroup?.guarantees?.map((guarantee) => guarantee.id) || [],
      phone: campaignGuaranteeGroup?.phone || "",
      status: campaignGuaranteeGroup?.status || 0,
      note: campaignGuaranteeGroup?.note || "",
    },

    validationSchema: Yup.object({
    }),

    onSubmit: (values) => {
      if (modalMode === "update") {
        const updatedCampaignGuaranteeGroup = {
          schema: electionSlug,
          id: campaignGuaranteeGroup ? campaignGuaranteeGroup.id : 0,
          name: values.name || "",
          member: values.member || campaignGuaranteeGroup.member || currentCampaignMember?.id,
          phone: values.phone || "",
          note: values.note || "",
          guarantees: values.guarantees || [],
        };

        // Update election
        dispatch(updateCampaignGuaranteeGroup(updatedCampaignGuaranteeGroup));

      } else {
        const newCampaignGuaranteeGroup = {
          schema: electionSlug,
          name: values.name || "",
          member: currentCampaignMember.id,
          phone: values.phone || "",
          note: values.note || "",
          guarantees: values.guarantees || [],
        };
        dispatch(addCampaignGuaranteeGroup(newCampaignGuaranteeGroup));
      }
      validation.resetForm();
      toggle();
    },
  });


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
      id: "note-field",
      name: "note",
      label: "ملاحظات",
      type: "textarea",
      colSize: 12,
    },
    {
      id: "guarantees-field",
      name: "guarantees",
      label: "المضامين",
      type: "selectMulti",
      options: myCampaignGuarantees,
      colSize: 12,
    },
  ]
  return (
    <React.Fragment>
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        Header
      </ModalHeader>
      <ModalBody>
        <Form
          className="tablelist-form"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit(e);
          }}
        >
          <Row>
            {fields.map(field => (
              field.condition === undefined || field.condition) && (
                <FormFields
                  key={field.id}
                  field={field}
                  validation={validation}
                />
              )
            )}
          </Row>
          <ModalFooter>
            <Button
              type="button"
              onClick={() => {
                toggle();
              }}
              className="btn-light"
            >
              اغلق
            </Button>
            <Button type="submit" className="btn btn-success" id="add-btn">
              تحديث الإنتخابات
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </React.Fragment>
  );
};

export default GuaranteeGroupsModalEdit;

// React & Redux imports
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignGuarantee } from "store/actions";
import { campaignSelector } from 'selectors';

// Component & Constants imports
import { CampaignGuaranteeStatusOptions, GenderOptions } from "shared/constants";

// Form & Validation imports
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";
import { FormFields } from "shared/components";

// Reactstrap (UI) imports
import { Col, Row, Table, Form, Button, Collapse, ModalHeader, ModalBody, ModalFooter } from "reactstrap";


const GuaranteesModalEdit = ({
  toggle,
  campaignGuarantee,
}) => {
  const dispatch = useDispatch();

  const { campaignId, campaignMembers, campaignGuaranteeGroups, currentCampaignMember, campaignElectionCommittees } = useSelector(campaignSelector); // Directly use without redundant useState
  const GurantorOptions = campaignMembers.filter(
    (member) => member.role === 31 || member.role === 32 || member.role === 33 || member.role === 34
  );

  const myCampaignGuaranteeGroups = campaignGuaranteeGroups && campaignGuaranteeGroups
    .filter((guaranteeGroup) => guaranteeGroup.member === currentCampaignMember.id)
    .map((guaranteeGroup) => ({
      label: guaranteeGroup.name,
      value: guaranteeGroup.id
    }));

  console.log("myCampaignGuaranteeGroups: ", myCampaignGuaranteeGroups)
  console.log("campaignGuaranteeGroups: ", currentCampaignMember.id)

  const sortedGurantorOptions = GurantorOptions.sort((a, b) => a.role - b.role);
  const [isRelatedVoters, setToggleRelatedVoters] = useState(false);

  const setIsRelatedVoters = () => {
    setToggleRelatedVoters(!isRelatedVoters);
  };


  // Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: campaignGuarantee?.id || "",
      campaign: campaignId,
      guaranteeGroups: campaignGuarantee?.guaranteeGroups || [],
      member: campaignGuarantee?.member || "",
      phone: campaignGuarantee?.phone || "",
      status: campaignGuarantee?.status || 0,
      notes: campaignGuarantee?.notes || "",
    },
    validationSchema: Yup.object({
      // status: Yup.number().integer().required("Status is required"),
    }),

    onSubmit: (values) => {
      const updatedCampaignGuarantee = {
        id: campaignGuarantee ? campaignGuarantee.id : 0,
        campaign: campaignId,
        member: parseInt(values.member, 10),
        phone: values.phone,
        civil: values.civil,
        guaranteeGroups: values.guaranteeGroups || [],
        status: parseInt(values.status, 10),
        notes: values.notes,
      };
      dispatch(updateCampaignGuarantee(updatedCampaignGuarantee));
      validation.resetForm();
      toggle();

    },
  });

  console.log("initialValues: ", validation.initialValues)

  const tableRows = [
    { label: "الاسم", value: campaignGuarantee?.fullName },
    {
      label: "النوع",
      value: (GenderOptions.find(g => g.id === campaignGuarantee?.gender) || {}).name || "غير محدد"
    },
    { label: "الرقم المدني", value: campaignGuarantee?.civil },
    { label: "رقم الصندوق", value: campaignGuarantee?.boxNo },
    { label: "رقم الاشتراك", value: campaignGuarantee?.membershipNo },
    { label: "تاريخ الانتساب", value: campaignGuarantee?.enrollmentDate },
  ];


  const guarantorOptions = sortedGurantorOptions.map((guarantor) => {
    let prefix = "";
    switch (guarantor.role) {
      case 31:
        prefix = "🔵";
        break;
      case 32:
        prefix = "🟡";
        break;
      case 33:
        prefix = "🟢";
        break;
      default:
        prefix = "⚫";
        break;
    }
    return {
      id: guarantor.id,
      label: `${prefix} ${guarantor.name}`,
      value: guarantor.id
    };
  });

  const formFields = [
    {
      id: "guarantor-field",
      name: "member",
      label: "الضامن",
      type: "select",
      options: guarantorOptions,
    },
    {
      id: "guaranteeGroup-field",
      name: "guaranteeGroups",
      label: "المجموعات",
      type: "selectMulti",
      options: myCampaignGuaranteeGroups,

      // options: campaignGuaranteeGroups.map(item => ({
      //   id: item.id,
      //   label: item.name,
      //   value: item.id
      // })),
    },
    {
      id: "phone-field",
      name: "phone",
      label: "الهاتف",
      type: "number",
    },
    {
      id: "status-field",
      name: "status",
      label: "الحالة",
      type: "select",
      options: CampaignGuaranteeStatusOptions.map(item => ({
        id: item.id,
        label: item.name,
        value: item.id
      })),
    },
    {
      id: "notes-field",
      name: "notes",
      label: "ملاحظات",
      type: "textarea",
    },
    // Add any other fields as needed
  ];


  return (
    <React.Fragment>
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        تعديل ضمان
      </ModalHeader>
      <Form
        className="tablelist-form"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >

        <ModalBody>
          <Row>
            <Col lg={6} className="mb-3 mb-lg-0">
              {/* Added margin-bottom for small screens */}
              <Table size="sm">
                {/* Using reactstrap's Table */}
                <thead className="bg-primary text-white">
                  <tr>
                    <th colSpan="2" className="text-center">
                      معلومات الناخب
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaignGuarantee && tableRows.map((row, index) => (
                    <tr key={index}>
                      <td className="fw-medium">{row.label}</td>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>

              </Table>
            </Col>
            <Col lg={6}>

              <Table size="sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th colSpan="2" className="text-center">
                      متابعة المضمون
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formFields.map((field) => (
                    <FormFields key={field.id} formStyle="tableStyle" field={field} validation={validation} />
                  ))}
                </tbody>
              </Table>
            </Col>
            <div className="live-preview">
              <p>
                <Button onClick={setIsRelatedVoters} color="primary" style={{ cursor: "pointer" }} >
                  مشاهدة الأقارب والمعارف
                </Button>
              </p>
              <div>
                <Collapse isOpen={isRelatedVoters} id="collapseWidthExample" horizontal>
                  <div className="card card-body mb-0" style={{ width: "300px" }}>
                    This is some placeholder content for a horizontal collapse. It's hidden by default and shown when triggered.
                  </div>
                </Collapse>
              </div>
            </div>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            onClick={() => {
              toggle();
            }}
            className="btn-light"
          >
            إغلاق
          </Button>
          <Button type="submit" className="btn btn-success" id="add-btn">
            تحديث الضمان
          </Button>
        </ModalFooter>
      </Form>

    </React.Fragment >
  );
};
export default GuaranteesModalEdit;

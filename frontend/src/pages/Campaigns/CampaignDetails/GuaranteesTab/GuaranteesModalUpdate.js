// React & Redux imports
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignGuarantee } from "store/actions";
import { campaignSelector } from 'Selectors';

// Component & Constants imports
import { GuaranteeStatusOptions, GenderOptions } from "constants";

// Form & Validation imports
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

// Reactstrap (UI) imports
import { Col, Row, Table, Label, Input, Form, FormFeedback } from "reactstrap";


const GuaranteesModalUpdate = ({
  campaignGuarantee,
  setOnModalSubmit,
  campaignMembers,
}) => {
  const dispatch = useDispatch();


  const {campaignId, campaignElectionCommittees} = useSelector(campaignSelector); // Directly use without redundant useState

  const GurantorOptions = campaignMembers.filter(
    (member) => member.role === 31 || member.role === 32 || member.role === 33 || member.role === 34
  );
  const sortedGurantorOptions = GurantorOptions.sort((a, b) => a.role - b.role);

  // Initial Values
  const initialValues = {
    id: campaignGuarantee?.id || "",
    campaign: campaignId,
    member: campaignGuarantee?.member || "",
    phone: campaignGuarantee?.phone || "",
    status: campaignGuarantee?.status || 0,
    notes: campaignGuarantee?.notes || "",
  };

  // Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: Yup.object({
      status: Yup.number().integer().required("Status is required"),
    }),

    onSubmit: (values) => {
      const updatedCampaignGuarantee = {
        id: campaignGuarantee ? campaignGuarantee.id : 0,
        campaign: campaignId,
        member: parseInt(values.member, 10),
        phone: values.phone,
        civil: values.civil,
        status: parseInt(values.status, 10),
        notes: values.notes,
      };
      dispatch(updateCampaignGuarantee(updatedCampaignGuarantee));
      validation.resetForm();
    },
  });

  const handleUpdateButton = useCallback(() => {
    validation.submitForm();
  }, [validation]);


  useEffect(() => {
    // Set the callback action for the update modal
    setOnModalSubmit(() => handleUpdateButton);
    return () => setOnModalSubmit(null); // Cleanup on unmount
  }, [handleUpdateButton, setOnModalSubmit]);

  return (
    <React.Fragment>
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
              <tr>
                <td className="fw-medium">الاسم</td>{" "}
                <td>
                  {campaignGuarantee.fullName}
                </td>
              </tr>
              <tr>
                <td className="fw-medium">النوع</td>{" "}
                <td>
                  {
                    (GenderOptions.find(g => g.id === campaignGuarantee.gender) || {}).name || "غير محدد"
                  }
                </td>
              </tr>
              <tr>
                <td className="fw-medium">الرقم المدني</td>
                <td>{campaignGuarantee.civil}</td>
              </tr>
              <tr>
                <td className="fw-medium">رقم الصندوق</td>
                <td>{campaignGuarantee.boxNo}</td>
              </tr>
              <tr>
                <td className="fw-medium">رقم الاشتراك</td>
                <td>{campaignGuarantee.membershipNo}</td>
              </tr>
              <tr>
                <td className="fw-medium">تاريخ الانتساب</td>
                <td>{campaignGuarantee.enrollmentDate}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col lg={6}>
          <Form
            className="tablelist-form"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Table size="sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th colSpan="2" className="text-center">
                    متابعة المضمون
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-medium">الضامن</td>
                  <td>
                    <Input
                      name="member"
                      type="select"
                      className="form-select"
                      id="member-field"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.member || ""}
                    >
                      {sortedGurantorOptions.map((guarantor) => {
                        let prefix = "";
                        switch (guarantor.role) {
                          case 2:
                            prefix = "🔵"; // blue circle for candidate
                            break;
                          case 3:
                            prefix = "🟡"; // yellow circle for supervisor
                            break;
                          case 4:
                            prefix = "🟢"; // green circle for guarantor
                            break;
                          default:
                            break;
                        }
                        return (
                          <option key={guarantor.id} value={guarantor.id}>
                            {prefix} {guarantor.name}
                          </option>
                        );
                      })}
                    </Input>
                    {validation.touched.member &&
                      validation.errors.member ? (
                      <FormFeedback type="invalid">
                        {validation.errors.member}
                      </FormFeedback>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td className="fw-medium">الهاتف</td>
                  <td>
                    <Input
                      name="phone"
                      id="phone-field"
                      className="form-control"
                      placeholder="ادخل رقم الهاتف"
                      type="number"
                      validate={{
                        required: { value: true },
                      }}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.phone || ""}
                      invalid={
                        validation.touched.phone && validation.errors.phone
                          ? true
                          : false
                      }
                    />
                    {validation.touched.phone && validation.errors.phone ? (
                      <FormFeedback type="invalid">
                        {validation.errors.phone}
                      </FormFeedback>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td className="fw-medium">الحالة</td>
                  <td>
                    <Input
                      name="status"
                      type="select"
                      className="form-select"
                      id="status-field"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.status || ""}
                    >
                      {GuaranteeStatusOptions.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.status && validation.errors.status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.status}
                      </FormFeedback>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td className="fw-medium">ملاحضات</td>
                  <td>
                    <Input
                      name="notes"
                      id="guarantee-id-field"
                      className="form-control"
                      placeholder="ادخل الملاحضات"
                      type="textarea"
                      validate={{
                        required: { value: true },
                      }}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.notes || ""}
                      invalid={
                        validation.touched.notes && validation.errors.notes
                          ? true
                          : false
                      }
                    />
                    {validation.touched.notes && validation.errors.notes ? (
                      <FormFeedback type="invalid">
                        {validation.errors.notes}
                      </FormFeedback>
                    ) : null}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Form>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default GuaranteesModalUpdate;

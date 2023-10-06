// --------------- React & Redux imports ---------------
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignGuarantee } from "../../../../store/actions";
import { electionsSelector } from '../../../../Selectors/electionsSelector';

// --------------- Component & Constants imports ---------------
import { GuaranteeStatusOptions } from "../../../../Components/constants";

// --------------- Form & Validation imports ---------------
import * as Yup from "yup";
import { useFormik } from "formik";

import "react-toastify/dist/ReactToastify.css";


// --------------- Reactstrap (UI) imports ---------------
import { Col, Row, Table, Label, Input, Form, FormFeedback } from "reactstrap";


const CampaignGuaranteesModalUpdate = ({
  campaignGuarantee,
  setOnModalSubmit,
  campaignMembers,
}) => {
  const dispatch = useDispatch();

  const { campaign } = useSelector((state) => ({
    campaign: state.Campaigns.campaignDetails.id,
  }));
  const campaignElectionCommittees = useSelector(electionsSelector); // Directly use without redundant useState

  const GurantorOptions = campaignMembers.filter(
    (member) => member.rank === 2 || member.rank === 3 || member.rank === 4
  );
  const sortedGurantorOptions = GurantorOptions.sort((a, b) => a.rank - b.rank);



  // Initial Values ---------------
  const initialValues = {
    id: campaignGuarantee?.id || "",
    campaign: campaign,
    member: campaignGuarantee?.member || "",
    mobile: campaignGuarantee?.mobile || "",
    status: campaignGuarantee?.status || 0,
    notes: campaignGuarantee?.notes || "",
  };

  // Validation ---------------

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: Yup.object({
      status: Yup.number().integer().required("Status is required"),
    }),

    onSubmit: (values) => {
      const updatedCampaignGuarantee = {
        id: campaignGuarantee ? campaignGuarantee.id : 0,
        campaign: campaign,
        member: parseInt(values.member, 10),
        mobile: values.mobile,
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
                  Elector Info
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-medium">Name / Gender</td>{" "}
                <td>
                  {campaignGuarantee.full_name} {campaignGuarantee.gender}
                </td>
              </tr>
              <tr>
                <td className="fw-medium">CID</td>
                <td>{campaignGuarantee.civil}</td>
              </tr>
              <tr>
                <td className="fw-medium">Box Number</td>
                <td>{campaignGuarantee.box_no}</td>
              </tr>
              <tr>
                <td className="fw-medium">Member Number</td>
                <td>{campaignGuarantee.membership_no}</td>
              </tr>
              <tr>
                <td className="fw-medium">Enrolment Date</td>
                <td>{campaignGuarantee.enrollment_date}</td>
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
                    Guarantee Info
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-medium">Guarantor [ID]</td>
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
                        switch (guarantor.rank) {
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
                            {prefix} {guarantor.user.name}
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
                  <td className="fw-medium">Mobile</td>
                  <td>
                    <Input
                      name="mobile"
                      id="mobile-field"
                      className="form-control"
                      placeholder="Enter Guarantee Mobile"
                      type="number"
                      validate={{
                        required: { value: true },
                      }}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.mobile || ""}
                      invalid={
                        validation.touched.mobile && validation.errors.mobile
                          ? true
                          : false
                      }
                    />
                    {validation.touched.mobile && validation.errors.mobile ? (
                      <FormFeedback type="invalid">
                        {validation.errors.mobile}
                      </FormFeedback>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td className="fw-medium">Status</td>
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
                  <td className="fw-medium">Notes</td>
                  <td>
                    <Input
                      name="notes"
                      id="guarantee-id-field"
                      className="form-control"
                      placeholder="Enter Guarantee ID"
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
export default CampaignGuaranteesModalUpdate;

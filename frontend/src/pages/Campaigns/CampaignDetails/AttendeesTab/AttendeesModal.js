import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector } from 'Selectors';

import { updateCampaignAttendee } from "../../../../store/actions";
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import { Card, CardBody, Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { GuaranteeStatusOptions } from "../../../../Components/constants";

const AttendeesModal = ({ modal, toggle, modalMode, campaignAttendee }) => {

  const { campaignMembers } = useSelector(campaignSelector);

  const [onModalSubmit, setOnModalSubmit] = useState(null);

  let ModalTitle;
  let ModalContent;
  let ModalButtonText;

  switch (modalMode) {
    case "GuaranteeCallModal":
      ModalTitle = "Campaign Guarantee Call";
      ModalContent = CampaignAttendeeCallModal;
      ModalButtonText = "Make Call";
      break;
    case "GuaranteeTextModal":
      ModalTitle = "Campaign Guarantee Text";
      ModalContent = CampaignAttendeeTextModal;
      ModalButtonText = "Send Text";
      break;
    case "GuaranteeUpdateModal":
      ModalTitle = "Update Campaign Guarantee";
      ModalContent = CampaignAttendeeUpdateModal;
      ModalButtonText = "Update Campaign Guarantee";
      break;
    case "GuaranteeViewModal":
      ModalTitle = "View Campaign Guarantee";
      ModalContent = CampaignAttendeeViewModal;
      ModalButtonText = "Close";
      break;
    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = DefaultModalContent;
      ModalButtonText = "Close"; // A default button text
  }


  return (
    <Modal isOpen={modal} toggle={toggle} centered className="border-0" size="lg">
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        Update Campaign Guarantee
      </ModalHeader>
      <ModalBody className="p-4">

        <ModalContent
          campaignAttendee={campaignAttendee}
          setOnModalSubmit={setOnModalSubmit}
          campaignMembers={campaignMembers}
        />

      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button color="light" onClick={() => toggle(false)}>Close</Button>

          {/* if ModalButtonText and ModalButtonText is not empty */}
          {ModalButtonText && ModalButtonText.length > 0 &&
            <Button
              color="success"
              id="add-btn"
              onClick={() => {
                if (onModalSubmit) onModalSubmit();
                toggle(false);
              }}
            >
              {ModalButtonText}
            </Button>
          }


        </div>
      </ModalFooter>
    </Modal>
  );
};

const CampaignAttendeeCallModal = () => {
  return (
    <p>CampaignAttendeeCallModal</p>
  );
};


const CampaignAttendeeTextModal = () => {
  return (
    <p>CampaignAttendeeTextModal</p>
  );
};


const CampaignAttendeeUpdateModal = ({
  campaignAttendee,
  toggle,
  setOnModalSubmit,
  campaignMembers,
}) => {
  const dispatch = useDispatch();

  const { campaignId } = useSelector((state) => ({
    campaignId: state.Campaigns.campaignDetails.id,
  }));
  const campaignElectionCommittees = useSelector(campaignSelector); // Directly use without redundant useState



  const GurantorOptions = campaignMembers.filter(
    (member) => member.role === 2 || member.role === 3 || member.role === 4
  );
  const sortedGurantorOptions = GurantorOptions.sort((a, b) => a.role - b.role);



  const initialValues = {
    id: campaignAttendee?.id || "",
    member_id: campaignAttendee?.guarantor || "",
    phone: campaignAttendee?.phone || "",
    status: campaignAttendee?.status || 0,
    notes: campaignAttendee?.notes || "",

  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: Yup.object({
      status: Yup.number().integer().required("Status is required"),
    }),
    onSubmit: (values) => {
      const updatedCampaignAttendee = {
        id: campaignAttendee ? campaignAttendee.id : 0,
        member_id: values.guarantor,
        phone: values.phone,
        civil: values.civil,
        status: parseInt(values.status, 10),
        notes: values.notes,
      };
      dispatch(updateCampaignAttendee(updatedCampaignAttendee));
      validation.resetForm();
      toggle(); // Use only toggle instead of having multiple functions for the same purpose
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
        <Col lg={6} className="mb-3 mb-lg-0"> {/* Added margin-bottom for small screens */}
          <Table size="sm"> {/* Using reactstrap's Table */}
            <thead className="bg-primary text-white">
              <tr>
                <th colSpan="2" className="text-center">Elector Info</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-medium">Name / Gender</td> {/* Added text-muted */}
                <td>{campaignAttendee.full_name} {campaignAttendee.gender}</td>
              </tr>
              <tr>
                <td className="fw-medium">CID</td>
                <td>{campaignAttendee.civil}</td>
              </tr>
              <tr>
                <td className="fw-medium">Box Number</td>
                <td>{campaignAttendee.box_no}</td>
              </tr>
              <tr>
                <td className="fw-medium">Member Number</td>
                <td>{campaignAttendee.membership_no}</td>
              </tr>
              <tr>
                <td className="fw-medium">Enrolment Date</td>
                <td>{campaignAttendee.enrollment_date}</td>
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
                  <th colSpan="2" className="text-center">Guarantee Info</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-medium">Guarantor [ID]</td>
                  <td>
                    <Input
                      name="guarantor"
                      type="select"
                      className="form-select"
                      id="guarantor-field"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.guarantor || ""}
                    >
                      {sortedGurantorOptions.map((guarantor) => {
                        let prefix = "";
                        switch (guarantor.role) {
                          case 2:
                            prefix = "🔵";  // blue circle for candidate
                            break;
                          case 3:
                            prefix = "🟡";  // yellow circle for supervisor
                            break;
                          case 4:
                            prefix = "🟢";  // green circle for guarantor
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
                    {validation.touched.guarantor && validation.errors.guarantor ? (
                      <FormFeedback type="invalid">
                        {validation.errors.guarantor}
                      </FormFeedback>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td className="fw-medium">Mobile</td>
                  <td>
                    <Input
                      name="phone"
                      id="phone-field"
                      className="form-control"
                      placeholder="Enter Guarantee Mobile"
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


const CampaignAttendeeViewModal = () => {
  return (
    <p>CampaignAttendeeViewModal</p>
  );
};

const DefaultModalContent = () => null; // Defining a named component for the default case

export default AttendeesModal;

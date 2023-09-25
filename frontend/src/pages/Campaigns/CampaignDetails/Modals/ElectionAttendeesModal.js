import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { electionsSelector } from '../../../../Selectors/electionsSelector';

import { updateElectionAttendee } from "../../../../store/actions";
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import { Card, CardBody, Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { GuaranteeStatusOptions } from "../../../../Components/constants";

const ElectionAttendeesModal = ({ modal, toggle, modalMode, electionAttendee }) => {

  const { campaignMembers } = useSelector(electionsSelector);

  const [onModalSubmit, setOnModalSubmit] = useState(null);

  let ModalTitle;
  let ModalContent;
  let ModalButtonText;

  switch (modalMode) {
    case "GuaranteeCallModal":
      ModalTitle = "Campaign Guarantee Call";
      ModalContent = ElectionAttendeeCallModal;
      ModalButtonText = "Make Call";
      break;
    case "GuaranteeTextModal":
      ModalTitle = "Campaign Guarantee Text";
      ModalContent = ElectionAttendeeTextModal;
      ModalButtonText = "Send Text";
      break;
    case "GuaranteeUpdateModal":
      ModalTitle = "Update Campaign Guarantee";
      ModalContent = ElectionAttendeeUpdateModal;
      ModalButtonText = "Update Campaign Guarantee";
      break;
    case "GuaranteeViewModal":
      ModalTitle = "View Campaign Guarantee";
      ModalContent = ElectionAttendeeViewModal;
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
          electionAttendee={electionAttendee}
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

const ElectionAttendeeCallModal = () => {
  return (
    <p>ElectionAttendeeCallModal</p>
  );
};


const ElectionAttendeeTextModal = () => {
  return (
    <p>ElectionAttendeeTextModal</p>
  );
};


const ElectionAttendeeUpdateModal = ({
  electionAttendee,
  toggle,
  setOnModalSubmit,
  campaignMembers,
}) => {
  const dispatch = useDispatch();

  const { campaignId } = useSelector((state) => ({
    campaignId: state.Campaigns.campaignDetails.id,
  }));
  const campaignCommittees = useSelector(electionsSelector); // Directly use without redundant useState



  const GurantorOptions = campaignMembers.filter(
    (member) => member.rank === 2 || member.rank === 3 || member.rank === 4
  );
  const sortedGurantorOptions = GurantorOptions.sort((a, b) => a.rank - b.rank);



  const initialValues = {
    id: electionAttendee?.id || "",
    member_id: electionAttendee?.guarantor || "",
    mobile: electionAttendee?.mobile || "",
    status: electionAttendee?.status || 0,
    notes: electionAttendee?.notes || "",

  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: Yup.object({
      status: Yup.number().integer().required("Status is required"),
    }),
    onSubmit: (values) => {
      const updatedElectionAttendee = {
        id: electionAttendee ? electionAttendee.id : 0,
        member_id: values.guarantor,
        mobile: values.mobile,
        civil: values.civil,
        status: parseInt(values.status, 10),
        notes: values.notes,
      };
      dispatch(updateElectionAttendee(updatedElectionAttendee));
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
                <td>{electionAttendee.full_name} {electionAttendee.gender}</td>
              </tr>
              <tr>
                <td className="fw-medium">CID</td>
                <td>{electionAttendee.civil}</td>
              </tr>
              <tr>
                <td className="fw-medium">Box Number</td>
                <td>{electionAttendee.box_no}</td>
              </tr>
              <tr>
                <td className="fw-medium">Member Number</td>
                <td>{electionAttendee.membership_no}</td>
              </tr>
              <tr>
                <td className="fw-medium">Enrolment Date</td>
                <td>{electionAttendee.enrollment_date}</td>
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
                        switch (guarantor.rank) {
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


const ElectionAttendeeViewModal = () => {
  return (
    <p>ElectionAttendeeViewModal</p>
  );
};

const DefaultModalContent = () => null; // Defining a named component for the default case

export default ElectionAttendeesModal;

import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector } from 'Selectors';

import { updateCampaignAttendee } from "store/actions";
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import { Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { GenderOptions } from "constants";

const AttendeesModal = ({ modal, toggle, modalMode, campaignAttendee }) => {

  const { campaignMembers, campaignRoles } = useSelector(campaignSelector);

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
      ModalTitle = "تعديل تحضير ناخب";
      ModalContent = CampaignAttendeeUpdateModal;
      ModalButtonText = "تعديل تحضير ناخب";
      break;
    case "GuaranteeViewModal":
      ModalTitle = "مشاهدة تحضير ناخب";
      ModalContent = CampaignAttendeeViewModal;
      ModalButtonText = "اغلاق";
      break;
    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = DefaultModalContent;
      ModalButtonText = "اغلاق"; // A default button text
  }


  return (
    <Modal isOpen={modal} toggle={toggle} centered className="border-0" size="lg">
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        تعديل تحضير ناخب
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
          <Button color="light" onClick={() => toggle(false)}>اغلاق</Button>

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
                <th colSpan="2" className="text-center">معلومات الناخب</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-medium">الاسم</td>{" "}
                <td>
                  {campaignAttendee.fullName}
                </td>
              </tr>
              <tr>
                <td className="fw-medium">النوع</td>{" "}
                <td>
                  {
                    (GenderOptions.find(g => g.id === campaignAttendee.gender) || {}).name || "غير محدد"
                  }
                </td>
              </tr>
              <tr>
                <td className="fw-medium">الرقم المدني</td>
                <td>{campaignAttendee.civil}</td>
              </tr>
              <tr>
                <td className="fw-medium">رقم الصندوق</td>
                <td>{campaignAttendee.boxNo}</td>
              </tr>
              <tr>
                <td className="fw-medium">رقم العضوية</td>
                <td>{campaignAttendee.membershipNo}</td>
              </tr>
              <tr>
                <td className="fw-medium">تاريخ العضوية</td>
                <td>{campaignAttendee.enrollmentDate}</td>
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
                  <th colSpan="2" className="text-center">معلومات التحضير</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-medium">المحضر</td>
                  <td>
                    <td>-</td>
                  </td>
                </tr>
                <tr>
                  <td className="fw-medium">اللجنة</td>
                  <td>
                    <td>-</td>
                  </td>
                </tr>
                <tr>
                  <td className="fw-medium">ملاحضات</td>
                  <td>
                    <Input
                      name="notes"
                      id="guarantee-id-field"
                      className="form-control"
                      placeholder="ادخل ملاحظات"
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

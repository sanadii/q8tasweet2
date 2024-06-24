import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector } from 'selectors';

import { updateCampaignAttendee } from "store/actions";
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import { Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { GenderOptions } from "shared/constants";
import AttendeeUpdateModal from "./AttendeeUpdateModal";
// import AttendeeViewModal from "./AttendeeViewModal"


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
      ModalContent = AttendeeUpdateModal;
      ModalButtonText = "تعديل تحضير ناخب";
      break;
    case "GuaranteeViewModal":
      ModalTitle = "مشاهدة تحضير ناخب";
      ModalContent = CampaignAttendeeViewModal;
      ModalButtonText = "اغلق";
      break;
    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = DefaultModalContent;
      ModalButtonText = "اغلق"; // A default button text
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
          <Button color="light" onClick={() => toggle(false)}>اغلق</Button>

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



const CampaignAttendeeViewModal = () => {
  return (
    <p>CampaignAttendeeViewModal</p>
  );
};

const DefaultModalContent = () => null; // Defining a named component for the default case

export default AttendeesModal;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { campaignSelector } from 'selectors';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import GuaranteesModalUpdate from "./GuaranteesModalUpdate";
import GuaranteesModalView from "./GuaranteesModalView"

const GuaranteesModal = ({ modal, toggle, modalMode, campaignGuarantee }) => {

  // Define States
  const { campaignMembers } = useSelector(campaignSelector);

  // Set ConstantsF
  const [onModalSubmit, setOnModalSubmit] = useState(null);

  let ModalTitle;
  let ModalContent;
  let ModalButtonText;

  switch (modalMode) {
    case "GuaranteeCallModal":
      ModalTitle = "Campaign Guarantee Call";
      ModalContent = CampaignGuaranteeCallModal;
      ModalButtonText = "Make Call";
      break;
    case "GuaranteeTextModal":
      ModalTitle = "Campaign Guarantee Text";
      ModalContent = CampaignGuaranteeTextModal;
      ModalButtonText = "Send Text";
      break;
    case "GuaranteeUpdateModal":
      ModalTitle = "تعديل معلومات المضمون";
      ModalContent = GuaranteesModalUpdate;
      ModalButtonText = "تعديل";
      break;
    case "GuaranteeViewModal":
      ModalTitle = "مشاهدة معلومات المضمون";
      ModalContent = GuaranteesModalView;
      ModalButtonText = "اغلق";
      break;
    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = DefaultModalContent;
      ModalButtonText = "اغلق"; // A default button text
  }

  return (
    <Modal
      isOpen={modal}
      centered
      className="border-0"
      size="lg"
    >
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        تعديل معلومات المضمون
      </ModalHeader>
      <ModalBody className="p-4">
        <ModalContent
          campaignGuarantee={campaignGuarantee}
          setOnModalSubmit={setOnModalSubmit}
          campaignMembers={campaignMembers}
        />
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button color="light" onClick={() => toggle(false)}>
            Close
          </Button>

          {/* if ModalButtonText and ModalButtonText is not empty */}
          {ModalButtonText && ModalButtonText.length > 0 && (
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
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

const CampaignGuaranteeCallModal = () => {
  return <p>CampaignGuaranteeCallModal</p>;
};

const CampaignGuaranteeTextModal = () => {
  return <p>CampaignGuaranteeTextModal</p>;
};

const DefaultModalContent = () => null; // Defining a named component for the default case

export default GuaranteesModal;

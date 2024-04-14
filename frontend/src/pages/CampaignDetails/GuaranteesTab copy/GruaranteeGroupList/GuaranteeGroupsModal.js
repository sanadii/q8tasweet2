import React, { useState } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { campaignSelector } from 'selectors';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import GuaranteeGroupsModalUpdate from "./GuaranteeGroupsModalUpdate";
import GuaranteeGroupsModalView from "./GuaranteeGroupsModalView"

const GuaranteeGroupsModal = ({ modal, toggle, modalMode, campaignGuaranteeGroup }) => {
  console.log("modal: ", modal, "modalMod: ", modalMode, "campaignGuaranteeGroup: ", campaignGuaranteeGroup)

  // Define States
  const { campaignMembers } = useSelector(campaignSelector);

  // Set ConstantsF
  const [onModalSubmit, setOnModalSubmit] = useState(null);

  let ModalTitle;
  let ModalContent;
  let ModalButtonText;

  switch (modalMode) {
    case "GuaranteeGroupCallModal":
      ModalTitle = "Campaign GuaranteeGroup Call";
      ModalContent = CampaignGuaranteeGroupCallModal;
      ModalButtonText = "Make Call";
      break;
    case "GuaranteeGroupTextModal":
      ModalTitle = "Campaign GuaranteeGroup Text";
      ModalContent = CampaignGuaranteeGroupTextModal;
      ModalButtonText = "Send Text";
      break;
    case "GuaranteeGroupUpdateModal":
      ModalTitle = "تعديل مجموعة إنتخابية";
      ModalContent = GuaranteeGroupsModalUpdate;
      ModalButtonText = "تعديل";
      break;
      case "GuaranteeGroupAddModal":
        ModalTitle = "إضافة مجموعة إنتخابية";
        ModalContent = GuaranteeGroupsModalUpdate;
        ModalButtonText = "إضافة";
        break;
    case "GuaranteeGroupViewModal":
      ModalTitle = "مشاهدة معلومات المضمون";
      ModalContent = GuaranteeGroupsModalView;
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
          campaignGuaranteeGroup={campaignGuaranteeGroup}
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

const CampaignGuaranteeGroupCallModal = () => {
  return <p>CampaignGuaranteeGroupCallModal</p>;
};

const CampaignGuaranteeGroupTextModal = () => {
  return <p>CampaignGuaranteeGroupTextModal</p>;
};

const DefaultModalContent = () => null; // Defining a named component for the default case

export default GuaranteeGroupsModal;

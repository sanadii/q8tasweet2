import React from "react";
import "react-toastify/dist/ReactToastify.css";

import GuaranteeGroupsModalEdit from "./GuaranteeGroupsModalEdit";
import GuaranteeGroupsModalView from "./GuaranteeGroupsModalView"

// Reactstrap (UI) imports
import { Modal } from "reactstrap";

const GuaranteeGroupsModal = ({
  modal,
  toggle,
  modalMode,
  campaignGuaranteeGroup,
}) => {

  return (
    <Modal
      toggle={toggle}
      isOpen={modal}
      centered
      className="border-0"
      size="lg"
    >
      {(modalMode === "updateGuaranteeGroup" || modalMode === "addGuaranteeGroup") &&
        <GuaranteeGroupsModalEdit
          toggle={toggle}
          modalMode={modalMode}
          campaignGuaranteeGroup={campaignGuaranteeGroup} />
      }

      {modalMode === "viewGuaranteeGroup" &&
        <GuaranteeGroupsModalView
          toggle={toggle}
          campaignGuaranteeGroup={campaignGuaranteeGroup}
        />
      }
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

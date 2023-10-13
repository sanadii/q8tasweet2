// React & Redux core imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, campaignSelector } from 'Selectors';

// Component & Constants imports
import MembersUpdateModal from "./MembersUpdateModal";
import MembersAddModal from "./MembersAddModal";
import MembersViewModal from "./MembersViewModal";

// Reactstrap (UI) imports 
import { ModalBody, Modal, ModalHeader, ModalFooter, Button } from "reactstrap";

export const MembersModal = ({ modal, toggle, modalMode, campaignMember }) => {

  // Set Constants
  const [onModalSubmit, setOnModalSubmit] = useState(null);

  let ModalTitle;
  let ModalContent;
  let ModalButtonText;
  let modalName = "Campaign Member";

  switch (modalMode) {
    case "CallModal":
      ModalTitle = modalName + " Call";
      ModalContent = CallModal;
      ModalButtonText = "Make Call";
      break;
    case "TextModal":
      ModalTitle = modalName + " Text";
      ModalContent = TextModal;
      ModalButtonText = "Send Text";
      break;
    case "UpdateModal":
      ModalTitle = "Update " + modalName;
      ModalContent = MembersUpdateModal;
      ModalButtonText = "Update" + modalName;
      break;
    case "AddModal":
      ModalTitle = "Add " + modalName;
      ModalContent = MembersAddModal;
      break;
    case "ViewModal":
      ModalTitle = "View " + modalName;
      ModalContent = MembersViewModal;
      ModalButtonText = "Close";
      break;
    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = DefaultModalContent;
      ModalButtonText = "Close"; // A default button text
  }

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      centered
      className="border-0"
      size="xs"
    >
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {ModalTitle}
      </ModalHeader>
      <ModalBody className="p-4">
        <ModalContent
          campaignMember={campaignMember}
          setOnModalSubmit={setOnModalSubmit}
          toggle={toggle}
        />
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button
            color="light"
            onClick={() => toggle(false)}
          >
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

const CallModal = () => {
  return <p>CallModal</p>;
};

const TextModal = () => {
  return <p>TextModal</p>;
};

const ViewModal = () => {
  return <p>ViewModal</p>;
};

const DefaultModalContent = () => {
  return <p>DefaultModalContent</p>;
};

export default MembersModal;

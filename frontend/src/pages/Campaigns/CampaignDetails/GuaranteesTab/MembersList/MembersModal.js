// React & Redux core imports
import React, { useState } from "react";

// Component & Constants imports
import MembersUpdateModal from "./MembersUpdateModal";
import MembersAddModal from "./MembersAddModal";
import MembersViewModal from "./MembersViewModal";

// Reactstrap (UI) imports 
import { ModalBody, Modal, ModalHeader, ModalFooter, Button } from "reactstrap";


const MembersModal = ({ modal, toggle, setModal, modalMode, campaignMember }) => {

  // State Constants
  const [onModalSubmit, setOnModalSubmit] = useState(null);
  const { ModalTitle, ModalContent, ModalButtonText } = getModalDetails(modalMode);


  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      centered
      className="border-0"
      size="xs"
    >
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {campaignMember?.name}
      </ModalHeader>

      <ModalBody className="p-4">
        <ModalContent
          campaignMember={campaignMember}
          setOnModalSubmit={setOnModalSubmit}
          toggle={toggle}
          modalMode={modalMode}
        />
      </ModalBody>

      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button
            color="light"
            onClick={() => {
              setModal(false);
            }}
            className="btn-light"
          >
            إغلاق
          </Button>

          {/* if ModalButtonText and ModalButtonText is not empty */}
          {ModalButtonText && (
            <Button
              color="success"
              id="add-btn"
              onClick={() => {
                onModalSubmit();
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

const getModalDetails = (modalMode) => {
  const modalName = "فريق الحملة";
  let ModalTitle, ModalContent, ModalButtonText;

  switch (modalMode) {
    case "memberCallModal":
      ModalTitle = modalName + "اتصال";
      ModalContent = CallModal;
      ModalButtonText = "اتصل";
      break;
    case "memberTextModal":
      ModalTitle = modalName + "رسالة";
      ModalContent = TextModal;
      ModalButtonText = "ارسل";
      break;
    case "memberUpdateModal":
      ModalTitle = "تعديل " + modalName;
      ModalContent = MembersUpdateModal;
      ModalButtonText = "تعديل";
      break;
    case "memberAddModal":
      ModalTitle = "إضافة " + modalName;
      ModalContent = MembersAddModal;
      break;
    case "memberViewModal":
      ModalTitle = "مشاهدة " + modalName;
      ModalContent = MembersViewModal;
      break;
    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = DefaultModalContent;
      ModalButtonText = "Close"; // A default button text
  }

  return { ModalTitle, ModalContent, ModalButtonText };
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

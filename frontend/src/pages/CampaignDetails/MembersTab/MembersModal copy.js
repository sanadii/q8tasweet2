import React, { useState, useMemo } from "react";
import { ModalBody, Modal, ModalHeader, ModalFooter, Button } from "reactstrap";
import MembersUpdateModal from "./MembersUpdateModal";
import MembersAddModal from "./MembersAddModal";
import MembersViewModal from "./MembersViewModal";

const MembersModal = ({ modal, toggle, modalMode, campaignMember }) => {
  const [onModalSubmit, setOnModalSubmit] = useState(null);
  const { modalTitle, ModalContent, modalButtonText } = useMemo(() => getModalDetails(modalMode), [modalMode]);

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      centered
      className="border-0"
      size="xs"
    >
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {modalTitle}
      </ModalHeader>

      <ModalBody className="p-4">
        <ModalContent
          campaignMember={campaignMember}
          setOnModalSubmit={setOnModalSubmit}
          modalMode={modalMode}
          toggle={toggle}
        />
      </ModalBody>

      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button
            color="light"
            onClick={toggle}
            className="btn-light"
          >
            اغلق
          </Button>
          {modalButtonText && (
            <Button
              color="success"
              id="add-btn"
              onClick={onModalSubmit}
            >
              {modalButtonText}
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

const getModalDetails = (modalMode) => {
  const modalName = "فريق الحملة";
  let modalTitle, ModalContent, modalButtonText;

  switch (modalMode) {
    case "call":
      modalTitle = modalName + "اتصال";
      ModalContent = CallModal;
      modalButtonText = "اتصل";
      break;
    case "message":
      modalTitle = modalName + "رسالة";
      ModalContent = TextModal;
      modalButtonText = "ارسل";
      break;
    case "update":
      modalTitle = "تعديل " + modalName;
      ModalContent = MembersUpdateModal;
      modalButtonText = "تعديل";
      break;
    case "add":
      modalTitle = "إضافة " + modalName;
      ModalContent = MembersAddModal;
      break;
    case "view":
      modalTitle = "مشاهدة " + modalName;
      ModalContent = MembersViewModal;
      break;
    default:
      modalTitle = "Default Modal";
      ModalContent = DefaultModalContent;
      modalButtonText = "Close";
  }

  return { modalTitle, ModalContent, modalButtonText };
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

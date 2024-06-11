// React & Redux core imports
import React, { useState } from "react";

// Component & Constants imports
import MembersUpdateModal from "./MembersUpdateModal";
import MembersAddModal from "./MembersAddModal";
import MembersViewModal from "./MembersViewModal";

// Reactstrap (UI) imports 
import { Modal } from "reactstrap";

const MembersModal = ({ modal, toggle, modalMode, campaignMember }) => {

  // State Constants
  const { ModalContent } = getModalDetails(modalMode);

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      centered
      className="border-0"
      size="xs"
    >
      <ModalContent
        campaignMember={campaignMember}
        toggle={toggle}
      />
    </Modal>
  );
};

const getModalDetails = (modalMode) => {
  let ModalContent;

  switch (modalMode) {
    case "call":
      ModalContent = CallModal;
      break;
    case "message":
      ModalContent = TextModal;
      break;
    case "update":
      ModalContent = MembersUpdateModal;
      break;
    case "add":
      ModalContent = MembersAddModal;
      break;
    case "view":
      ModalContent = MembersViewModal;
      break;
    default:
      ModalContent = DefaultModalContent;
  }

  return { ModalContent };
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


// <ModalFooter>
// <div className="hstack gap-2 justify-content-end">
//   <Button
//     color="light"
//     onClick={() => { toggle(); }}
//     className="btn-light"
//   >
//     إغلاق
//   </Button>

//   {/* if modalButtonText and modalButtonText is not empty */}
//   {modalButtonText && (
//     <Button
//       color="success"
//       id="add-btn"
//       onClick={() => {
//         onModalSubmit();
//       }}
//     >
//       {modalButtonText}
//     </Button>
//   )}
// </div>
// </ModalFooter>
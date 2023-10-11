import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector } from 'Selectors';
import "react-toastify/dist/ReactToastify.css";

import { Card, CardBody, Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

// ---------------- Components & Constants imports ----------------
import CandidateModalUpdate from "./CandidateModalUpdate";
import CandidateModalAdd from "./CandidateModalAdd";
import { GuaranteeStatusOptions } from "../../../../Components/constants";

const CandidateModal = ({ modal, toggle, modalMode, elector }) => {
  const { campaignMembers } = useSelector(campaignSelector);

  const [modalSubmit, setModalSubmit] = useState(null);

  let ModalTitle;
  let ModalContent;
  let ModalButton;

  switch (modalMode) {
    case "CandidateModalAdd":
      ModalTitle = "Create New Candidate";
      ModalContent = CandidateModalAdd;
      ModalButton = "Submit";
      break;
    case "CandidateModalUpdate":
      ModalTitle = "Update Candidate";
      ModalContent = CandidateModalUpdate;
      ModalButton = "Submit";
      break;

    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = CandidateModalDefault;
      ModalButton = "Close"; // A default button text
  }

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      centered
      className="border-0"
      size="lg"
    >
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {ModalTitle}
      </ModalHeader>
      <ModalBody className="p-4">
        <ModalContent
          elector={elector}
          setModalSubmit={setModalSubmit}
          campaignMembers={campaignMembers}
        />
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button color="light" onClick={() => toggle(false)}>
            Close
          </Button>

          {/* if ModalButton and ModalButton is not empty */}
          {ModalButton && ModalButton.length > 0 && (
            <Button
              color="success"
              id="add-btn"
              onClick={() => {
                if (modalSubmit) modalSubmit();
                toggle(false);
              }}
            >
              {ModalButton}
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

const CandidateModalDefault = () => null; // Defining a named component for the default case

export default CandidateModal;

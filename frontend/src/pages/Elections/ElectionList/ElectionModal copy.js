import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateelector } from "../../../../store/actions";
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Label,
  Input,
  Form,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

// ---------------- Components & Constants imports ----------------
import ElectionModalUpdate from "./ElectionModalUpdate";
import ElectionModalAdd from "./ElectionModalAdd";
import { GuaranteeStatusOptions } from "../../../../Components/constants";

const ElectionModal = ({ modal, toggle, modalMode, elector }) => {
  const { campaignMembers } = useSelector((state) => ({
    campaignMembers: state.Campaigns.campaignMembers,
  }));

  const [modalSubmit, setModalSubmit] = useState(null);

  let ModalTitle;
  let ModalContent;
  let ModalButton;

  switch (modalMode) {
    case "ElectionModalAdd":
      ModalTitle = "Create New Election";
      ModalContent = ElectionModalAdd;
      ModalButton = "Submit";
      break;
    case "ElectionModalUpdate":
      ModalTitle = "Update Election";
      ModalContent = ElectionModalUpdate;
      ModalButton = "Submit";
      break;

    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = ElectionModalDefault;
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

const ElectionModalDefault = () => null; // Defining a named component for the default case

export default ElectionModal;

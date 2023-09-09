// --------------- React & Redux imports ---------------
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
  getUsers,
  addNewCampaignMember,
  updateCampaignMember,
} from "../../../../store/actions";

// --------------- Component & Constants imports ---------------
import {
  MemberRankOptions,
  MemberStatusOptions,
} from "../../../../Components/constants";
import { ImageRoundedCircleXS } from "../../../../Components/Common";
import CampaignMembersUpdateModal from "./CampaignMembersUpdateModal";
import CampaignMembersAddModal from "./CampaignMembersAddModal";
import CampaignMembersViewModal from "./CampaignMembersViewModal";
// --------------- Form validation imports ---------------
import * as Yup from "yup";
import { useFormik } from "formik";

// --------------- Utility imports ---------------
import SimpleBar from "simplebar-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --------------- Reactstrap (UI) imports ---------------
import {
  ModalBody,
  Modal,
  ModalHeader,
  ModalFooter,
  Button,
} from "reactstrap";

export const CampaignMembersModal = ({
  modal,
  toggle,
  modalMode,
  campaignMember,
}) => {
  const dispatch = useDispatch();

  // --------------- Define States ---------------
  const { currentCampaignMember, campaignMembers, campaignId } = useSelector(
    (state) => {
      console.log("Redux state for Campaigns:", state.Campaigns);
      return {
        campaignId: state.Campaigns.campaignDetails.id,
        currentCampaignMember: state.Campaigns.currentCampaignMember,
        campaignMembers: state.Campaigns.campaignMembers,
      };
    }
  );
  

  // --------------- Set Constants ---------------
  const [onModalSubmit, setOnModalSubmit] = useState(null);

  let ModalTitle;
  let ModalContent;
  let ModalButtonText;
  let modalName = "Campaign Member";

  useEffect(() => {
    console.log("CampaignMembersModal - campaignMember prop:", campaignMember);
  }, [campaignMember]);
  
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
      ModalContent = CampaignMembersUpdateModal;
      ModalButtonText = "Update" + modalName;
      break;
    case "AddModal":
      ModalTitle = "Add " + modalName;
      ModalContent = CampaignMembersAddModal;
      break;
    case "ViewModal":
      ModalTitle = "View " + modalName;
      ModalContent = CampaignMembersViewModal;
      ModalButtonText = "Close";
      break;
    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = DefaultModalContent;
      ModalButtonText = "Close"; // A default button text
  }
  console.log("Modal Mode inside CampaignMembersModal:", modalMode);

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

export default CampaignMembersModal;

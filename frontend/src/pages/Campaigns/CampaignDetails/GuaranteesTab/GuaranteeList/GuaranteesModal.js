import React from "react";

import { Modal } from "reactstrap";
import GuaranteeModalEdit from "./GuaranteeModalEdit";
import GuaranteeModalView from "./GuaranteeModalView"

const GuaranteesModal = ({ modal, toggle, modalMode, campaignGuarantee }) => {

  return (
    <Modal
      toggle={toggle}
      isOpen={modal}
      centered
      className="border-0"
      size="lg"
    >

      {(modalMode === "guaranteeUpdate") &&
        <GuaranteeModalEdit
          toggle={toggle}
          campaignGuarantee={campaignGuarantee} />
      }

      {modalMode === "guaranteeView" &&
        <GuaranteeModalView
          toggle={toggle}
          campaignGuarantee={campaignGuarantee}
        />
      }

    </Modal >
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

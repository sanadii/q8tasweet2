import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { electionsSelector } from '../../../../Selectors/electionsSelector';
import "react-toastify/dist/ReactToastify.css";

import { Card, CardBody, Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { GuaranteeStatusOptions } from "../../../../Components/constants";

const CampaignElectorsModal = ({ modal, toggle, modalMode, elector }) => {

  const { campaignMembers } = useSelector(electionsSelector);

  const [onModalSubmit, setOnModalSubmit] = useState(null);

  let ModalTitle;
  let ModalContent;
  let ModalButtonText;

  switch (modalMode) {
    case "CampaignElectorViewModal":
      ModalTitle = "Campaign Elector View";
      ModalContent = CampaignElectorViewModal;
      ModalButtonText = "Add to Guarantees";
      break;

    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = DefaultModalContent;
      ModalButtonText = "Close"; // A default button text
  }


  return (
    <Modal isOpen={modal} toggle={toggle} centered className="border-0" size="xs">
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {ModalTitle}
      </ModalHeader>
      <ModalBody className="p-4">

        <ModalContent
          elector={elector}
          setOnModalSubmit={setOnModalSubmit}
          campaignMembers={campaignMembers}
        />

      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button color="light" onClick={() => toggle(false)}>Close</Button>

          {/* if ModalButtonText and ModalButtonText is not empty */}
          {ModalButtonText && ModalButtonText.length > 0 &&
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
          }

        </div>
      </ModalFooter>
    </Modal>
  );
};

export const CampaignElectorViewModal = ({
  elector,
  toggle,
  setOnModalSubmit,
  campaignMembers,
}) => {
  // const dispatch = useDispatch();

  return (
    <React.Fragment>
      <Row>
        <Table size="sm"> {/* Using reactstrap's Table */}
          <thead className="bg-primary text-white">
            <tr>
              <th colSpan="2" className="text-center">Elector Info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-medium">Name / Gender</td> {/* Added text-muted */}
              <td>{elector.full_name} {elector.gender}</td>
            </tr>
            <tr>
              <td className="fw-medium">CID</td>
              <td>{elector.civil}</td>
            </tr>
            <tr>
              <td className="fw-medium">Box Number</td>
              <td>{elector.box_no}</td>
            </tr>
            <tr>
              <td className="fw-medium">Member Number</td>
              <td>{elector.membership_no}</td>
            </tr>
            <tr>
              <td className="fw-medium">Enrolment Date</td>
              <td>{elector.enrollment_date}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </React.Fragment>

  );
};

const DefaultModalContent = () => null; // Defining a named component for the default case

export default CampaignElectorsModal;

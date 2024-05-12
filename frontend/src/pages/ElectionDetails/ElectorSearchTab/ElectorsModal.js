import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector } from 'selectors';
import "react-toastify/dist/ReactToastify.css";
import { getElectorRelatedElectors } from "store/actions"
import { Card, CardBody, Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { GuaranteeStatusOptions } from "shared/constants";

const ElectorsModal = ({ modal, toggle, modalMode, elector }) => {

  const { campaignMembers } = useSelector(campaignSelector);

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
    <Modal isOpen={modal} toggle={toggle} centered className="border-0" size="lg">
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
  const dispatch = useDispatch();

  const { fullName, gender, birthDate,
    areaName, block, street, lane, house,
    committeeSiteName, committee
  } = elector


  // useEffect(() => {
  //   getElectorRelatedElectors(elector)
  //   console.log("dispatching getElectorRelated")
  // });

  const electorInfoData = [

    // Name & Details
    {
      title: "معلومات الناخب",
      group: "info",
      items: [
        { label: "الاسم", value: fullName },
        { label: "النوع", value: gender },
        { label: "العمر", value: birthDate },
      ]
    },
    {
      title: "العنوان",
      group: "address",
      items: [
        { label: "المنطقة", value: areaName },
        { label: "قطعة", value: block },
        { label: "شارع", value: street },
        { label: "جادة", value: lane },
        { label: "منزل", value: house },
      ],
    },

    {
      title: "اللجنة",
      group: "committee",
      items: [
        { label: "المدرسة", value: committeeSiteName },
        { label: "اللجنة", value: committee },

      ]
    },
  ];

  // { label: "CID", value: "elector.civil" },
  // { label: "Box Number", value: "elector.box_no" },
  // { label: "Member Number", value: "elector.membership_no" },
  // { label: "Enrolment Date", value: "elector.enrollment_date" },

  // branch: values.branch || "",
  // family: values.family || "",
  // area: values.area || "",
  // block: values.block || "",
  // street: values.street || "",
  // house: values.house || "",
  // age: values.age || "",
  // votted22: values.votted22 || "",
  // votted23: values.votted23 || "",
  // votted24: values.votted24 || "",

  return (
    <React.Fragment>
      <Row>
        {electorInfoData.map((group) => (
          <>
            <h5 className="fw-bold">{group.title}</h5>
            <Table size="lg">
              <thead className="bg-soft-primary text-primary">
                {group.items.map((item, idx) => (
                  <td key={idx} className="fw-medium">{item.label}</td>
                ))}
              </thead>
              <tbody>
                <React.Fragment key={group.group}>
                  <tr>
                    {group.items.map((item, idx) => (
                      <td key={idx} className="fw-medium">{item.value}</td>
                    ))}
                  </tr>
                </React.Fragment>
              </tbody>
            </Table>
          </>
        ))}

      </Row>
    </React.Fragment >
  );





};

const DefaultModalContent = () => null; // Defining a named component for the default case

export default ElectorsModal;

import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector, electorSelector } from 'selectors';
import "react-toastify/dist/ReactToastify.css";
import { Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { CampaignGuaranteeStatusOptions } from "shared/constants";

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

const ElectorRelatedElectors = ({ electorRelatedElectors }) => {
  // Check if electorRelatedElectors is defined and is an array
  if (!electorRelatedElectors || !Array.isArray(electorRelatedElectors)) {
    return <div>No related electors available.</div>;
  }

  return (
    <div>
      <h5><strong>الأقارب</strong></h5>
      <Table size="md">
        <thead className="bg-primary text-white">
          <th className="p-1">الاسم</th>
          <th className="p-1">القرابة</th>
          <th className="p-1">العنوان</th>
          <th className="p-1">إجراءات</th>
        </thead>
        <tbody>
          {electorRelatedElectors.length > 0 ? (
            electorRelatedElectors.map((elector) => (
              <tr key={elector.id}>
                <td>
                  {elector.fullName}
                </td>
                <td>
                  {elector.relationship}
                </td>
                <td>
                  <strong>{elector.areaName} </strong> ق {elector.block} ش {elector.street} ج {elector.lane} م {elector.house}
                </td>
                <td>1 , 2 , 3</td>
              </tr>
            ))
          ) : (
            <p>لم يتم العثور على نتائج.</p>
          )}
        </tbody>
      </Table>


    </div >
  );
};






export const CampaignElectorViewModal = ({
  elector,
  toggle,
  setOnModalSubmit,
  campaignMembers,
}) => {
  const dispatch = useDispatch();
  const { electorRelatedElectors } = useSelector(electorSelector);

  const { id, fullName, gender, age,
    areaName, block, street, lane, house,
    committeeSiteName, committee, committeeType, letter, statusCode, codeNumber 
  } = elector


  // useEffect(() => {
  //   getElectorRelatedElectors(elector)
  //   console.log("dispatching getElectorRelated")
  // });

  const electorInfoData = [
    { label: "الاسم", value: fullName },
    { label: "النوع", value: gender === "1" ? "ذكر" : "انثى" },
    { label: "العمر", value: `${age} سنة` },
    { label: "العنوان", value: `${areaName}، ق ${block}، ش ${street}، ج ${lane}، م ${house}` }
  ]

  const electorElectionInfo = [
    { label: "القيد", value: `${id}` },

    { label: "اللجنة", value: committeeSiteName },
    { label: "اللجنة", value: `لجنة (${committeeType}) رقم (${committee}) حرف (${letter}) الرقم (${codeNumber})` },
    { label: "تصويت 2022", value: "تم التصويت" },
    { label: "تصويت 2023", value: "التصويت" },
    { label: "تصويت 2024", value: "التصويت" },

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
        <Col lg={6} >
          <Table size="sm">
            <thead className="bg-primary text-white text-align-center">
              <th colSpan="2" className="p-1 text-center">
                معلومات الناخب
              </th>

            </thead>
            <tbody>
              {electorInfoData.map((item, key) => (
                <tr key={key}>
                  <th>{item.label}</th>
                  <td className="fw-medium">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col lg={6} >
          <Table size="sm">
            <thead className="bg-primary text-white text-align-center">
              <th colSpan="2" className="p-1 text-center">
                التصويت
              </th>
            </thead>
            {electorElectionInfo.map((item, key) => (
              <tr key={key}>
                <th>{item.label}</th>
                <td className="fw-medium">{item.value}</td>
              </tr>
            ))}
          </Table>
        </Col>
      </Row>
      <Row>
        <ElectorRelatedElectors electorRelatedElectors={electorRelatedElectors} />
      </Row>
    </React.Fragment >
  );
};

const DefaultModalContent = () => null; // Defining a named component for the default case

export default ElectorsModal;

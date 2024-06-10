import React, { useState, useEffect, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Col, Row, Table, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { CampaignGuaranteeStatusOptions, GenderOptions } from "shared/constants";

const GuaranteeModalView = ({
  toggle,
  campaignGuarantee
}) => {

  const tableRows = [
    { label: "الاسم", value: campaignGuarantee?.fullName },
    {
      label: "النوع",
      value: (GenderOptions.find(g => g.id === campaignGuarantee?.gender) || {}).name || "غير محدد"
    },
    { label: "الرقم المدني", value: campaignGuarantee?.civil },
    { label: "رقم الصندوق", value: campaignGuarantee?.boxNo },
    { label: "رقم الاشتراك", value: campaignGuarantee?.membershipNo },
    { label: "تاريخ الانتساب", value: campaignGuarantee?.enrollmentDate },
  ];

  const tableRows2 = [
    { label: "الضامن", value: campaignGuarantee?.member },
    { label: "تليفون", value: campaignGuarantee?.phone },
    { label: "الحالة", value: campaignGuarantee?.status },
    { label: "ملاحظات", value: campaignGuarantee?.notes },
  ];


  return (
    <React.Fragment>
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {campaignGuarantee?.fullName}
      </ModalHeader>

      <ModalBody>
        <Row>
          <Col lg={6} className="mb-3 mb-lg-0">
            <Table size="sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th colSpan="2" className="text-center">
                    معلومات الناخب
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaignGuarantee && tableRows.map((row, index) => (
                  <tr key={index}>
                    <td className="fw-medium">{row.label}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}

              </tbody>
            </Table>
          </Col>
          <Col lg={6}>
            <Table size="sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th colSpan="2" className="text-center">معلومات الضامن</th>
                </tr>
              </thead>
              <tbody>
                {campaignGuarantee && tableRows2.map((row, index) => (
                  <tr key={index}>
                    <td className="fw-medium">{row.label}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          type="button"
          onClick={() => {
            toggle();
          }}
          className="btn-light"
        >
          اغلق
        </Button>
      </ModalFooter>
    </React.Fragment>
  );
};
export default GuaranteeModalView;

import React, { useState, useEffect, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Col, Row, Table } from "reactstrap";

const GuaranteesModalView = ({ campaignGuarantee }) => {

  console.log("campaignGuarantee:", campaignGuarantee)
  
  return (
    <React.Fragment>
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
              <tr>
                <td className="fw-medium">الاسم</td>{" "}
                <td>
                  {campaignGuarantee.fullName} {campaignGuarantee.gender}
                </td>
              </tr>
              <tr>
                <td className="fw-medium">الرقم المدني</td>
                <td>{campaignGuarantee.civil}</td>
              </tr>
              <tr>
                <td className="fw-medium">رقم الصندوق</td>
                <td>{campaignGuarantee.box_no}</td>
              </tr>
              <tr>
                <td className="fw-medium">رقم العضوية</td>
                <td>{campaignGuarantee.membershipNo}</td>
              </tr>
              <tr>
                <td className="fw-medium">تاريخ الالتحاق</td>
                <td>{campaignGuarantee.enrollmentDate}</td>
              </tr>
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
              <tr>
                <td className="fw-medium">الضامن</td>
                <td>
                  {campaignGuarantee.member}
                  {/* Here, you can display the guarantor ID directly or map the ID to a name or other details if available */}
                </td>
              </tr>
              <tr>
                <td className="fw-medium">تليفون</td>
                <td>{campaignGuarantee.phone}</td>
              </tr>
              <tr>
                <td className="fw-medium">الحالة</td>
                <td>
                  {campaignGuarantee.status}
                  {/* Similarly, you can display the status directly or map it to a human-readable name if you have that data */}
                </td>
              </tr>
              <tr>
                <td className="fw-medium">ملاحضات</td>
                <td>{campaignGuarantee.notes}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default GuaranteesModalView;

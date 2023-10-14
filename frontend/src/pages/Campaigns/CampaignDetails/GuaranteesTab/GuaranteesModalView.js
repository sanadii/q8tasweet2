import React, { useState, useEffect, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Col, Row, Table } from "reactstrap";

const GuaranteesModalView = ({ campaignGuarantee }) => {

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
                <td className="fw-medium">Name / Gender</td>{" "}
                <td>
                  {campaignGuarantee.full_name} {campaignGuarantee.gender}
                </td>
              </tr>
              <tr>
                <td className="fw-medium">CID</td>
                <td>{campaignGuarantee.civil}</td>
              </tr>
              <tr>
                <td className="fw-medium">Box Number</td>
                <td>{campaignGuarantee.box_no}</td>
              </tr>
              <tr>
                <td className="fw-medium">Member Number</td>
                <td>{campaignGuarantee.membership_no}</td>
              </tr>
              <tr>
                <td className="fw-medium">Enrolment Date</td>
                <td>{campaignGuarantee.enrollment_date}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col lg={6}>
          <Table size="sm">
            <thead className="bg-primary text-white">
              <tr>
                <th colSpan="2" className="text-center">Guarantee Info</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-medium">Guarantor [ID]</td>
                <td>
                  {campaignGuarantee.member}
                  {/* Here, you can display the guarantor ID directly or map the ID to a name or other details if available */}
                </td>
              </tr>
              <tr>
                <td className="fw-medium">Mobile</td>
                <td>{campaignGuarantee.phone}</td>
              </tr>
              <tr>
                <td className="fw-medium">Status</td>
                <td>
                  {campaignGuarantee.status}
                  {/* Similarly, you can display the status directly or map it to a human-readable name if you have that data */}
                </td>
              </tr>
              <tr>
                <td className="fw-medium">Notes</td>
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

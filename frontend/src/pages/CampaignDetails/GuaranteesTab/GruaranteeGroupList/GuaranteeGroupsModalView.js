import React, { useState, useEffect, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";

// Redux and state
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector } from 'selectors';

// Reactstrap (UI) imports
import {
  Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form,
  DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Card, CardHeader,
  CardBody, ListGroup, ListGroupItem
} from "reactstrap";
import { Link } from 'react-router-dom';

import { widgetsAudiences, guaranteeGroupPortfolio, } from "shared/data/widgets";
import { MyPortfolioCharts, SessionsByCountriesCharts, AudiencesMetricsCharts, TopReferralsPagesCharts } from './WidgetsCharts';
import { SimplePie, SimpleDonut, UpdateDonut, MonochromePie, GradientDonut, PatternedDonut, ImagePieChart } from './PieCharts'


const GuaranteeGroupsModalView = ({
  toggle,
  campaignGuaranteeGroup
}) => {
  const { campaignMembers, campaignGuarantees } = useSelector(campaignSelector);

  console.log("campaignMembers: ", campaignMembers)
  const campaignGuaranteeGroupName = campaignGuaranteeGroup?.name
  const campaignMember = campaignMembers?.find((member) => member.id === campaignGuaranteeGroup?.member);
  const campaignMemberName = campaignMember?.name
  const campaignMemberId = campaignMember?.id

  const campaignGroupGuarantees = campaignGuarantees?.filter(guarantee => guarantee.member === campaignMemberId) || [];
  const campaignGroupAttendedGuarantees = campaignGuarantees?.filter(guarantee =>
    guarantee.member === campaignMemberId && guarantee.attended === true
  ) || [];

  // Calculate the percentage of attended guarantees
  const campaignGroupAttendedGuaranteePercentage =
    campaignGroupGuarantees > 0
      ? (campaignGroupAttendedGuarantees / campaignGroupGuarantees) * 100
      : 0;

  // Filter guarantees by member ID and gender = 1 (male)
  const campaignGroupMaleGuarantees = campaignGuarantees?.filter(guarantee =>
    guarantee.member === campaignMemberId && guarantee.gender === 1
  ) || [];

  // Filter guarantees by member ID and gender = 2 (female)
  const campaignGroupFemaleGuarantees = campaignGuarantees?.filter(guarantee =>
    guarantee.member === campaignMemberId && guarantee.gender === 2
  ) || [];

  // Count the male and female guarantees
  const countcampaignGroupGuarantees = campaignGroupGuarantees.length || 0;
  const countCampaignGroupAttendedGuarantees = campaignGroupAttendedGuarantees.length || 0;
  const countcampaignGroupMaleGuarantees = campaignGroupMaleGuarantees.length || 0;
  const CountcampaignGroupFemaleGuarantees = campaignGroupFemaleGuarantees.length || 0;

  const genderDataSeries = [countcampaignGroupGuarantees, countCampaignGroupAttendedGuarantees]
  console.log("campaignGuarantees campaignGuarantees: ", campaignGuarantees)
  console.log("campaignGuarantees campaignMemberId: ", campaignMemberId)
  console.log("campaignGuarantees campaignGroupGuarantees: ", campaignGroupGuarantees)
  console.log("campaignGuarantees countcampaignGroupGuarantees: ", countcampaignGroupGuarantees)

  const campaignGuaranteeGroupPhone = campaignGuaranteeGroup?.phone
  const campaignGuaranteeGroupCount = campaignGuaranteeGroup?.name
  const campaignGuaranteeAttendeesGroupCount = campaignGuaranteeGroup?.name
  const campaignGuaranteeAttendeesGroupPercentage = campaignGuaranteeGroup?.name


  console.log("campaignMemberName: ", campaignMemberName)
  return (
    <React.Fragment>
      <ModalHeader className="p-3 ps-4 bg-info">
        {campaignGuaranteeGroupName}
      </ModalHeader>
      <ModalBody className="p-4">
        <Card className="card-body">
          <Row className="row-cols-xxl-3 row-cols-lg-3 row-cols-1">
            <Col>
              <div className="d-flex mb-4 align-items-center">
                <div className="flex-shrink-0 avatar-xs">
                  <div class="avatar-title bg-primary material-shadow rounded-circle">
                    <i class="mdi mdi-account-group"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-2">
                  <h5 className="card-title mb-1">{campaignGuaranteeGroupName}</h5>
                  <p className="text-muted mb-0">{campaignMemberName}</p>
                </div>
              </div>
              <h6 className="mb-1">
                <strong>عدد الناخبين: </strong>
                <span>{countcampaignGroupGuarantees}</span>
              </h6>
              <h6 className="mb-1">
                <strong>عدد الحضور: </strong>
                <span>{countCampaignGroupAttendedGuarantees}</span>
              </h6>
              <h6 className="mb-1">
                <strong>نسبة الحضور: </strong>
                <span>{campaignGroupAttendedGuaranteePercentage}%</span>
              </h6>
              {/* <p className="card-text text-muted">Expense Account</p>
              <Link to="#" className="btn btn-primary btn-sm">رسالة</Link> */}

            </Col>
            <Col>
              <SimplePie
                dataColors='["--vz-info", "--vz-pink"]'
                dataSeries={genderDataSeries}
              />

            </Col>
          </Row>
        </Card>
        {/* <Col lg={12}>
          <Table size="sm">
            <thead className="bg-primary text-white">
              <tr>
                <th colSpan="4" className="text-center">{campaignGuaranteeGroup?.name || "لا يوجد"}</th>
              </tr>
            </thead>
            <tbody>
              {renderTableRow(guaranteeGroupInfo)}
              <tr>
                <td className="fw-medium">ملاحظات</td>
                <td colSpan="4">{campaignGuaranteeGroup?.notes}</td>
              </tr>
            </tbody>
          </Table>
        </Col> */}



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


    </React.Fragment >
  );
};

export default GuaranteeGroupsModalView;


// <Row>
// <Col xxl={4} xl={6}>
//   <Card className="card-height-100">
//     <CardHeader className="border-bottom-dashed align-items-center d-flex">
//       <h4 className="card-title mb-0 flex-grow-1">My Portfolio</h4>
//       <div>
//         <UncontrolledDropdown className="card-header-dropdown">
//           <DropdownToggle tag="button" className="btn btn-soft-primary btn-sm" >
//             <span className="text-uppercase">Btc<i className="mdi mdi-chevron-down align-middle ms-1"></i></span>
//           </DropdownToggle>
//           <DropdownMenu className="dropdown-menu-end">
//             <DropdownItem>BTC</DropdownItem>
//             <DropdownItem>USD</DropdownItem>
//             <DropdownItem>Euro</DropdownItem>
//           </DropdownMenu>
//         </UncontrolledDropdown>

//       </div>
//     </CardHeader>

//     <CardBody>
//       <div id="portfolio_donut_charts" dir="ltr">
//         {/* My Portfolio Chart */}
//         <MyPortfolioCharts dataColors='["--vz-primary", "--vz-primary-rgb, 0.85", "--vz-primary-rgb, 0.65", "--vz-primary-rgb, 0.50"]' />
//       </div>

//       <ListGroup className="border-dashed mb-0" flush>
//         {(guaranteeGroupPortfolio || []).map((item, key) => (<ListGroupItem className="px-0" key={key}>
//           <div className="d-flex">
//             <div className="flex-shrink-0 avatar-xs">
//               <span className="avatar-title bg-light p-1 rounded-circle">
//                 <img src={item.img} className="img-fluid" alt="" />
//               </span>
//             </div>
//             <div className="flex-grow-1 ms-2">
//               <h6 className="mb-1">{item.label}</h6>
//               <p className="fs-12 mb-0 text-muted"><i className={"mdi mdi-circle fs-10 align-middle me-1 text-" + item.coinNameClass}></i>{item.coinName}</p>
//             </div>
//             <div className="flex-shrink-0 text-end">
//               <h6 className="mb-1">{item.coinName} {item.coinVolume}</h6>
//               <p className={"fs-12 mb-0 text-" + item.priceClass}>{item.price}</p>
//             </div>
//           </div>
//         </ListGroupItem>))}
//       </ListGroup>
//     </CardBody>
//   </Card>
// </Col>
// <Col xxl={4} xl={6}>
//   <Card className="card-height-100">
//     <CardHeader className="align-items-center d-flex">
//       <h4 className="card-title mb-0 flex-grow-1">Sessions by Countries</h4>
//       <div>
//         <Button color="secondary" size="sm" className="btn-soft-secondary me-1">
//           ALL
//         </Button>
//         <Button color="primary" size="sm" className="btn-soft-primary me-1">
//           1M
//         </Button>
//         <Button color="secondary" size="sm" className="btn-soft-secondary">
//           6M
//         </Button>
//       </div>
//     </CardHeader>
//     <CardBody className="p-0">
//       <div>
//         <div id="countries_charts" className="apex-charts" dir="ltr">
//           {/* Sessions by Countries */}
//           <SessionsByCountriesCharts dataColors='["--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4"]' />
//         </div>
//       </div>
//     </CardBody>
//   </Card>
// </Col>
// </Row>
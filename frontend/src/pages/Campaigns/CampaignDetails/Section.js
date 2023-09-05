import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";

import {
  ImageLargeCircle,
  ImageCampaignBackground,
} from "../../../Components/Common/ImageFrames";
import { MemberRankOptions } from "../../../Components/constants";

import SwiperCore, { Autoplay } from "swiper";

import OverviewTab from "./OverviewTab";
import MembersTab from "./MembersTab";
import GuaranteesTab from "./GuaranteesTab";
import AttendeesTab from "./AttendeesTab";
import SortingTab from "./SortingTab";
import ElectorsTab from "./ElectorsTab";
import ActivitiesTab from "./ActivitiesTab";
import EditTab from "./EditTab";

const TAB_VISIBILITY_RULES = {
  members: [1, 2, 3, 4, 5, 6, 0],
  members: [1, 2, 3, 0],
  guarantees: [1, 2, 3, 4, 0],
  attendees: [1, 2, 3, 5, 0],
  sorting: [1, 2, 3, 4, 5, 6, 0],
  edit: [1, 0],
};

function isTabVisible(tabName, rank) {
  return TAB_VISIBILITY_RULES[tabName].includes(rank);
}

// const Section = ({ campaign, campaignCandidateList }) => {
const Section = ({
  currentCampaignMember,
  campaign,
  campaignMembers,
  campaignGuarantees,
  electionCommittees,
}) => {
  SwiperCore.use([Autoplay]);

  const [activeTab, setActiveTab] = useState("1");
  const [activityTab, setActivityTab] = useState("1");

  const rankId = currentCampaignMember.rank;
  const currentCampaignMemberRank = MemberRankOptions.find(
    (option) => option.id === rankId
  );

  const { currentUser } = useSelector((state) => ({
    currentUser: state.Users.currentUser,
  }));

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const toggleActivityTab = (tab) => {
    if (activityTab !== tab) {
      setActivityTab(tab);
    }
  };
  return (
    <React.Fragment>
      <ImageCampaignBackground imagePath={campaign.election.image} />
      <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
        <Row className="g-4">
          <div className="col-auto">
            <ImageLargeCircle imagePath={campaign.candidate.image} />
          </div>

          <Col>
            <div className="p-2">
              <h3 className="text-white mb-1">{campaign.candidate.name}</h3>
              <p className="text-white-75">{campaign.election.name}</p>
              <div className="hstack text-white-50 gap-1">
                <div className="me-2">
                  <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                  Date: {campaign.election.duedate}
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} className="col-lg-auto order-last order-lg-0">
            <Row className="text text-white-50 text-center">
              <Col lg={6} xs={4}>
                <div className="p-2">
                  <h4 className="text-white mb-1">{campaignMembers.length}</h4>
                  <p className="fs-14 mb-0">Team</p>
                </div>
              </Col>
              <Col lg={6} xs={4}>
                <div className="p-2">
                  <h4 className="text-white mb-1">
                    {campaignGuarantees.length}
                  </h4>
                  <p className="fs-14 mb-0">Guarantees</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Row>
        <Col lg={12}>
          <div>
            <div className="d-flex profile-wrapper">
              <Nav
                pills
                className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                role="tablist"
              >
                <NavItem>
                  <NavLink
                    href="#overview-tab"
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggleTab("1");
                    }}
                  >
                    <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                    <span className="d-none d-md-inline-block">Overview</span>
                  </NavLink>
                </NavItem>

                {isTabVisible("members", currentCampaignMember.rank) && (
                  <NavItem>
                    <NavLink
                      href="#members"
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => {
                        toggleTab("2");
                      }}
                    >
                      <i className="ri-list-unordered d-inline-block d-md-none"></i>{" "}
                      <span className="d-none d-md-inline-block">Members</span>
                    </NavLink>
                  </NavItem>
                )}

                {isTabVisible("guarantees", currentCampaignMember.rank) && (
                  <NavItem>
                    <NavLink
                      href="#guarantees"
                      className={classnames({ active: activeTab === "3" })}
                      onClick={() => {
                        toggleTab("3");
                      }}
                    >

                      <span className="d-none d-md-inline-block">
                        Guarantees <i className="ri-price-tag-line d-inline-block d-md-none"></i>
                      </span>
                    </NavLink>
                  </NavItem>
                )}
                {
                  isTabVisible("attendees", currentCampaignMember.rank) && (

                    <NavItem>
                      <NavLink
                        href="#attendees"
                        className={classnames({ active: activeTab === "4" })}
                        onClick={() => {
                          toggleTab("4");
                        }}
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">Attendees</span>
                      </NavLink>
                    </NavItem>
                  )
                }
                {
                  isTabVisible("sorting", currentCampaignMember.rank) && (
                    <NavItem>
                      <NavLink
                        href="#sorting"
                        className={classnames({ active: activeTab === "5" })}
                        onClick={() => {
                          toggleTab("5");
                        }}
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">Sorting</span>
                      </NavLink>
                    </NavItem>
                  )
                }
                <NavItem>
                  <NavLink
                    href="#electors"
                    className={classnames({ active: activeTab === "6" })}
                    onClick={() => {
                      toggleTab("6");
                    }}
                    style={{ backgroundColor: 'black' }}
                  >
                    <i className="ri-folder-4-line d-inline-block d-md-none"></i>{" "}
                    <span className="d-none d-md-inline-block">Search Electors</span>
                  </NavLink>
                </NavItem>
              </Nav >

              {currentUser && currentUser.is_staff === true && (

                <div className="flex-shrink-0">
                  <NavItem className="btn btn-success">
                    <NavLink
                      href="#edit"
                      className={classnames({ active: activeTab === "9" })}
                      onClick={() => {
                        toggleTab("9");
                      }}
                    >
                      <i className="ri-edit-box-line align-bottom"></i>
                      <span className="d-none d-md-inline-block">
                        Edit
                      </span>
                    </NavLink>
                  </NavItem>
                </div>
              )}

            </div >

            <TabContent activeTab={activeTab} className="pt-4">
              <TabPane tabId="1">
                <OverviewTab />
              </TabPane>

              <TabPane tabId="2">
                <MembersTab campaignMembers={campaignMembers} />
              </TabPane>

              <TabPane tabId="3">
                <GuaranteesTab
                  campaignGuarantees={campaignGuarantees}
                  campaignMembers={campaignMembers}
                />
              </TabPane>

              <TabPane tabId="4">
                <AttendeesTab />
              </TabPane>
              <TabPane tabId="5">
                <SortingTab />
              </TabPane>
              <TabPane tabId="6">
                <ElectorsTab />
              </TabPane>
              <TabPane tabId="9">
                <EditTab />
              </TabPane>
            </TabContent >
          </div >
        </Col >
      </Row >
    </React.Fragment >
  );
};

export default Section;

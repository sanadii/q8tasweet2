import React, { useState } from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { electionSelector, categorySelector } from 'Selectors';


// UI & Utilities
import { Card, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";



//import Tabs & Widges
import EditElection from "./EditElection";
import EditSortingMembers from "./EditSortingMembers";


const NavTabs = ({ tabs, activeTab, toggleTab }) => (
  <Nav
    pills
    className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
    role="tablist"
  >
    {tabs.filter(Boolean).map((tab) => (  // Filter out falsy values before mapping
      <NavItem key={tab.id}>
        <NavLink
          className={classnames({ active: activeTab === tab.id }, "fw-semibold")}
          onClick={() => toggleTab(tab.id)}
          href="#"
        >
          <i className={`${tab.icon} d-inline-block d-md-none`}></i>
          <span className="d-none d-md-inline-block text-black">{tab.title}</span>
        </NavLink>
      </NavItem>
    ))}
  </Nav>
);


const EditTab = () => {
  const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);
  const { categories } = useSelector(categorySelector);

  const categoryId = election.category; // assuming election object has a categoryId property
  const category = categories.find(cat => cat.id === categoryId);
  const electionCategoryName = category ? category.name : 'Category Not Found';

  const mainTabs = [
    { id: "1", title: "تعديل الإنتخابات", icon: 'ri-activity-line', },
    { id: "2", title: "موظفو الفرز", icon: 'ri-activity-line', },
  ];

  const [activeTab, setActiveTab] = useState("1");

  const tabComponents = {
    "1": <EditElection />,
    "2": <EditSortingMembers />,
  };

  //Tab
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  return (
    <React.Fragment>
      <Card>
        <Row>
          <Col lg={12}>
            <div className="d-flex profile-wrapper">
              <NavTabs tabs={mainTabs} activeTab={activeTab} toggleTab={toggleTab} />
              <div className="flex-shrink-0">
              
              </div>
            </div>
            <TabContent activeTab={activeTab} className="pt-4">
              {Object.entries(tabComponents).map(([key, component]) => (
                <TabPane tabId={key} key={key}>
                  {component}
                </TabPane>
              ))}
            </TabContent>
          </Col >
        </Row >
      </Card>
    </React.Fragment >
  );
};

export default EditTab;

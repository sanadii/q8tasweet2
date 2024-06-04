import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuarantee } from "store/actions";
import { campaignSelector } from 'selectors';
import classnames from "classnames";
import { usePermission } from 'shared/hooks';

// Shared imports
import { Col, Row, Badge, Button, Card, CardBody, CardHeader, TabContent, TabPane, Progress } from "reactstrap";
import { TableContainerHeader, } from "shared/components";

// Components
import GuaranteeGroupList from "./GruaranteeGroupList"
import GuaranteesList from "./GuaranteeList"
// import MembersList from "./MembersList"
import MembersModal from "./MembersList/MembersModal";
import GuaranteesModal from "./GuaranteeList/GuaranteesModal";
import GuaranteeGroupsModal from "./GruaranteeGroupList/GuaranteeGroupsModal";


// Utility imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GuaranteesTab = () => {
  const dispatch = useDispatch();

  // Constants
  const [campaignMember, setCampaignMember] = useState(null);
  const [campaignGuarantee, setCampaignGuarantee] = useState(null);
  const [campaignGuaranteeGroup, setCampaignGuaranteeGroup] = useState([]);

  const [campaigMemberModal, setCampaigMemberModal] = useState(false);
  const [campaigGuaranteeModal, setCampaigGuaranteeModal] = useState(false);
  const [campaigGuaranteeGroupModal, setCampaigGuaranteeGroupModal] = useState(false);

  const [selectedCampaignMember, setSelectedCampaignMember] = useState(null);
  const [selectedCampaignGuaranteeGroup, setSelectedCampaignGuaranteeGroup] = useState(null);
  const [selectedCampaignGuarantee, setSelectedCampaignGuarantee] = useState(null);


  const [modalMode, setModalMode] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);


  // 
  // Campaign Members Functions
  // 
  const toggleCampaignMember = useCallback(() => {
    if (campaigMemberModal) {
      setCampaigMemberModal(false);
      setCampaignMember(null);
    } else {
      setCampaigMemberModal(true);
    }
  }, [campaigMemberModal]);

  const handleMemberAddClick = () => {
    setCampaignMember("");
    setModalMode("memberAddModal")
    setIsEdit(false);
    toggleCampaignMember();
  };

  const handleSelectCampaignMember = (campaignMember) => {
    setSelectedCampaignMember(campaignMember)
    setActiveTab(tabs[1]);
  }


  // 
  // Campaign Guarantee Groups Functions
  // 
  const toggleCampaignGuaranteeGroup = useCallback(() => {
    if (campaigGuaranteeGroupModal) {
      setCampaigGuaranteeGroupModal(false);
      setCampaignGuaranteeGroup(null);
    } else {
      setCampaigGuaranteeGroupModal(true);
    }
  }, [campaigGuaranteeGroupModal]);

  const handleGuaranteeGroupAddClick = () => {
    setCampaignGuaranteeGroup("");
    setModalMode("addGuaranteeGroup")
    setIsEdit(false);
    toggleCampaignGuaranteeGroup();
  };

  const handleSelectCampaignGuaranteeGroup = (campaignGuaranteeGroup) => {
    setSelectedCampaignGuaranteeGroup(campaignGuaranteeGroup)
    setActiveTab(tabs[2]);
  }

  // 
  // Campaign Guarantees Functions
  // 
  const toggleCampaignGuarantee = useCallback(() => {
    if (campaigGuaranteeModal) {
      setCampaigGuaranteeModal(false);
      setCampaignGuarantee(null);
    } else {
      setCampaigGuaranteeModal(true);
    }
  }, [campaigGuaranteeModal]);

  const handleGuaranteeAddClick = () => {
    toggleCampaignGuarantee();
    setCampaignGuarantee("");
    setModalMode("guaranteeAddModal")
    setIsEdit(false);

  };

  // 
  // Tabs
  // 
  const tabs = [
    // {
    //   tabId: "1",
    //   href: '#campaignGuarantor',
    //   icon: 'ri ri-user-4-fill',
    //   title: "فريق العمل",
    //   component: <MembersList
    //     toggle={toggleCampaignMember}
    //     setCampaignMember={setCampaignMember}
    //     setModalMode={setModalMode}
    //     handleSelectCampaignMember={handleSelectCampaignMember}
    //   />
    // },
    {
      tabId: "1",
      href: '#campaignGuaranteeGroups',
      icon: 'ri ri-user-2-fill',
      title: 'المجاميع الإنتخابية',
      component: <GuaranteeGroupList
        setCampaignGuaranteeGroup={setCampaignGuaranteeGroup}
        setModal={setCampaigGuaranteeGroupModal}
        modalMode={modalMode}
        setModalMode={setModalMode}
        toggle={toggleCampaignGuaranteeGroup}
        selectedCampaignMember={selectedCampaignMember}
        handleSelectCampaignGuaranteeGroup={handleSelectCampaignGuaranteeGroup}
      />
    },
    {
      tabId: "2",
      permission: 'guarantee',
      href: '#campaignGuarantees',
      icon: 'ri ri-user-3-fill',
      title: 'الضمانات',
      component: <GuaranteesList
        setCampaignGuarantee={setCampaignGuarantee}
        modalMode={modalMode}
        setModalMode={setModalMode}
        setModal={setCampaigGuaranteeModal}
        toggle={toggleCampaignGuarantee}
      />
    },
  ];

  // Tabs
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Toggle for ActiveTab
  const toggleTab = (tab) => {
    if (activeTab.tabId !== tab.tabId) {
      setActiveTab(tab);
      setCurrentStep(Number(tab.tabId));
    }
    if (tab.tabId === "1") {
      setSelectedCampaignMember(null);
      setSelectedCampaignGuaranteeGroup(null);
    }
    if (tab.tabId === "2") {
      setSelectedCampaignGuaranteeGroup(null);
    }
  };


  return (
    <React.Fragment>
      <MembersModal
        modal={campaigMemberModal}
        toggle={toggleCampaignMember}
        modalMode={modalMode}
        campaignMember={campaignMember}
      />

      <GuaranteeGroupsModal
        modal={campaigGuaranteeGroupModal}
        toggle={toggleCampaignGuaranteeGroup}
        modalMode={modalMode}
        campaignGuaranteeGroup={campaignGuaranteeGroup}
      />

      <GuaranteesModal
        modal={campaigGuaranteeModal}
        toggle={toggleCampaignGuarantee}
        modalMode={modalMode}
        campaignGuarantee={campaignGuarantee}
      />

      <Row>
        <Col lg={12}>
          <Card id="memberList">
            <CardHeader>
              <TableContainerHeader
                // Title
                ContainerHeaderTitle={activeTab.title}

                // Add Elector Button
                PrimaryButtonText="إضافة ضمان"
                HandlePrimaryButton={handleGuaranteeAddClick}
                SecondaryButtonText="إضافة مجموعة"
                HandleSecondaryButton={handleGuaranteeGroupAddClick}
                // TertiaryButtonText="إضافة عضو"
                // HandleTertiaryButton={handleMemberAddClick}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                toggle={toggleCampaignGuarantee}

              // // Delete Button
              // isMultiDeleteButton={isMultiDeleteButton}
              // setDeleteModalMulti={setDeleteModalMulti}
              />

            </CardHeader>
            <CardBody>

              <Progress multi className='progress-step-arrow progress-info'>
                {tabs.map((tab) => (
                  <Progress
                    key={tab.tabId} bar value="50"
                    href={tab.href}
                    className={classnames({ active: activeTab.tabId === tab.tabId })}
                    onClick={() => toggleTab(tab)}

                  >
                    <div className={`card-title m-0`}>
                      <i className={`${tab.icon} circle-line align-middle me-1`}></i>
                      <strong>{tab.title}</strong>
                      {/* <span className="fs-12">{tab.selectedItem}</span> */}
                    </div>
                  </Progress>
                ))}
              </Progress>
              <SelectedInfo
                selectedCampaignMember={selectedCampaignMember}
                selectedCampaignGuaranteeGroup={selectedCampaignGuaranteeGroup}
                onClearMember={() => setSelectedCampaignMember(null)}
                onClearGroup={() => setSelectedCampaignGuaranteeGroup(null)}
              />

              <TabContent activeTab={activeTab.tabId} className="pt-4">
                {tabs.map((tab) => (
                  <TabPane key={tab.tabId} tabId={tab.tabId}>
                    {activeTab.tabId === tab.tabId ? tab.component : null}
                  </TabPane>
                ))}
              </TabContent>

              <ToastContainer closeButton={false} limit={1} />
            </CardBody>

          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

const SelectedInfo = ({ selectedCampaignMember, selectedCampaignGuaranteeGroup, onClearMember, onClearGroup }) => {
  return (
    <div className="p-2">
      <h5>
        {selectedCampaignMember && (
          <span className="m-2 badge bg-soft-info text-info badge-border d-inline-flex align-items-center">
            <span className="me-2">
              العضو: {selectedCampaignMember.name}
            </span>
            <Badge bg="danger" onClick={onClearMember} style={{ cursor: 'pointer' }}>x</Badge>
          </span>
        )}

        {selectedCampaignGuaranteeGroup && (
          <span className="m-2 badge bg-soft-info text-info badge-border">
            <span className="me-2">
              المجموعة: {selectedCampaignGuaranteeGroup.name}
            </span>
            <Badge bg="danger" onClick={onClearGroup} style={{ cursor: 'pointer' }}>x</Badge>
          </span>
        )}
      </h5>
    </div>
  );
};


export default GuaranteesTab;

import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuarantee } from "store/actions";
import { campaignSelector } from 'selectors';
import classnames from "classnames";
import { usePermission } from 'shared/hooks';

// Shared imports
import { Col, Row, Card, CardBody, CardHeader, Nav, NavItem, NavLink, TabContent, TabPane, Progress } from "reactstrap";
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader, TableContainerFilter } from "shared/components";
import { CheckboxHeader, CheckboxCell, Id, Name, Phone, Attended, Status, Guarantor, Actions } from "./GuaranteeList/GuaranteesCol";
import { useDelete, useFilter } from "shared/hooks"

// Components
import GuaranteeGroupList from "./GruaranteeGroupList"
import GuaranteesList from "./GuaranteeList"
import MembersList from "./MembersList"
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


  // Delete Hook
  const {
    handleDeleteItem,
    onClickDelete,
    deleteModal,
    setDeleteModal,
    checkedAll,
    deleteCheckbox,
    isMultiDeleteButton,
    deleteModalMulti,
    setDeleteModalMulti,
    deleteMultiple,
  } = useDelete(deleteCampaignGuarantee);

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
    // setCampaignMember(campaignMember)
    setSelectedCampaignMember(campaignMember)
  }

  console.log("campaignMember: ", campaignMember)
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
    setModalMode("guaranteeGroupAddModal")
    setIsEdit(false);
    toggleCampaignGuaranteeGroup();
  };

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
    console.log("toggled, modalMod: ", modalMode, "campaigGuaranteeModal:", campaigGuaranteeModal)

  };

  // 
  // Tabs
  // 


  const tabs = [
    {
      tabId: "1",
      href: '#campaignGuarantor',
      icon: 'ri ri-user-4-fill',
      title: "فريق العمل",
      component: <MembersList
        toggle={toggleCampaignMember}
        setCampaignMember={setCampaignMember}
        setModalMode={setModalMode}
        handleSelectCampaignMember={handleSelectCampaignMember}
      />
    },
    {
      tabId: "2",
      href: '#campaignGuaranteeGroups',
      icon: 'ri ri-user-2-fill',
      title: 'المجاميع الإنتخابية',
      component: <GuaranteeGroupList
        setCampaignGuaranteeGroup={setCampaignGuaranteeGroup}
        setModal={setCampaigGuaranteeGroupModal}
        modalMode={modalMode}
        setModalMode={setModalMode}
        toggle={toggleCampaignGuaranteeGroup}
      />
    },
    {
      tabId: "3",
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
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteItem}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />

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
                TertiaryButtonText="إضافة عضو"
                HandleTertiaryButton={handleMemberAddClick}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                toggle={toggleCampaignGuarantee}

                // Delete Button
                isMultiDeleteButton={isMultiDeleteButton}
                setDeleteModalMulti={setDeleteModalMulti}
              />

            </CardHeader>
            <CardBody>

              <Progress multi className='progress-step-arrow progress-info'>
                {tabs.map((tab) => (
                  <Progress
                    key={tab.tabId} bar value="35"
                    href={tab.href}
                    className={classnames({ active: activeTab.tabId === tab.tabId })}
                    onClick={() => toggleTab(tab)}

                  >
                    <div className={`card-title m-0 text-white`}>
                      <i className={`${tab.icon} circle-line align-middle me-1`}></i>
                      <strong>{tab.title}</strong>
                      {/* <span className="fs-12">{tab.selectedItem}</span> */}
                    </div>
                  </Progress>
                ))}
              </Progress>
              {selectedCampaignMember &&
                <div>
                  <span className="muted">العضو: {selectedCampaignMember.name}</span>
                </div>
              }
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

export default GuaranteesTab;

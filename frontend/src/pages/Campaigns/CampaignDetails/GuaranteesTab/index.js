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

  // States
  const {
    campaignGuarantees,
    campaignMembers,
    isCampaignGuaranteeSuccess,
    error
  } = useSelector(campaignSelector);

  // Constants
  const [campaignGuarantee, setCampaignGuarantee] = useState(null);
  const [campaigGuaranteeModal, setCampaigGuaranteeModal] = useState(false);

  const [campaignGuaranteeGroup, setCampaignGuaranteeGroup] = useState([]);
  const [campaigGuaranteeGroupModal, setCampaigGuaranteeGroupModal] = useState(false);

  const [modalMode, setModalMode] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  const getProgressBarColor = (tabId) => {
    return currentStep >= tabId ? "success" : "light";
  };


  console.log("campaignGuarantee:", campaignGuarantee)
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

  // Modal Constants

  // campaignGuaranteeGroup Functions
  const toggleGuaranteeGroup = useCallback(() => {
    if (campaigGuaranteeGroupModal) {
      setCampaigGuaranteeGroupModal(false);
      setCampaignGuaranteeGroup(null);
    } else {
      setCampaigGuaranteeGroupModal(true);
    }
  }, [campaigGuaranteeGroupModal]);

  const handleGuaranteeGroupAddClick = () => {
    setCampaignGuaranteeGroup("");
    setModalMode("GuaranteeGroupAddModal")
    setIsEdit(false);
    toggleGuaranteeGroup();
  };

  // campaignGuarantee Functions
  const toggleGuarantee = useCallback(() => {
    if (campaigGuaranteeModal) {
      setCampaigGuaranteeModal(false);
      setCampaignGuarantee(null);
    } else {
      setCampaigGuaranteeModal(true);
    }
  }, [campaigGuaranteeModal]);

  const handleGuaranteeAddClick = () => {
    setCampaignGuarantee("");
    setIsEdit(false);
    toggleGuarantee();
  };


  // Tabs
  const tabs = [
    {
      tabId: "1",
      href: '#campaignGuarantor',
      icon: 'ri ri-user-4-fill',
      title: 'فريق العمل',
      component: <MembersList
        setCampaignGuaranteeGroup={setCampaignGuaranteeGroup}
        setModal={setCampaigGuaranteeGroupModal}
        modalMode={modalMode}
        setModalMode={setModalMode}
        toggle={toggleGuaranteeGroup}
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
        toggle={toggleGuaranteeGroup}
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
        toggle={toggleGuarantee}
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
  console.log("modalMod: ", modalMode, "campaignGuarantee: ", campaignGuarantee)


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
        modal={campaigGuaranteeModal}
        modalMode={modalMode}
        toggle={toggleGuarantee}
        campaignGuarantee={campaignGuarantee}
      />

      <GuaranteeGroupsModal
        modal={campaigGuaranteeGroupModal}
        modalMode={modalMode}
        toggle={toggleGuaranteeGroup}
        campaignGuarantee={campaignGuarantee}
      />

      <GuaranteesModal
        modal={campaigGuaranteeModal}
        modalMode={modalMode}
        toggle={toggleGuarantee}
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
                HandleTertiaryButton={handleGuaranteeGroupAddClick}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                toggle={toggleGuarantee}

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
                    </div>

                  </Progress>

                ))}
              </Progress>


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

import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuarantee } from "store/actions";
import { campaignSelector } from 'selectors';
import classnames from "classnames";
import { usePermission } from 'shared/hooks';

// Shared imports
import { Col, Row, Card, CardBody, CardHeader, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader, TableContainerFilter } from "shared/components";
import { CheckboxHeader, CheckboxCell, Id, Name, Phone, Attended, Status, Guarantor, Actions } from "./GuaranteeList/GuaranteesCol";
import { useDelete, useFilter } from "shared/hooks"

import GuaranteesModal from "./GuaranteeList/GuaranteesModal";
import GuaranteeGroupsModal from "./GruaranteeGroupList/GuaranteeGroupsModal";

// Components
import GuaranteeGroupList from "./GruaranteeGroupList"
import GuaranteesList from "./GuaranteeList"

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
      href: '#campaignGuaranteeGroups',
      icon: 'ri-list-unordered',
      title: 'مجاميعي الإنتخابية',
      component: <GuaranteeGroupList
        setCampaignGuaranteeGroup={setCampaignGuaranteeGroup}
        setModal={setCampaigGuaranteeGroupModal}
        modalMode={modalMode}
        setModalMode={setModalMode}
        toggle={toggleGuaranteeGroup}
      />
    },
    {
      tabId: "2",
      permission: 'guarantee',
      href: '#campaignGuarantees',
      icon: 'ri-list-unordered',
      title: 'ضماناتي',
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

      <GuaranteesModal
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

                isEdit={isEdit}
                setIsEdit={setIsEdit}
                toggle={toggleGuarantee}

                // Delete Button
                isMultiDeleteButton={isMultiDeleteButton}
                setDeleteModalMulti={setDeleteModalMulti}
              />

            </CardHeader>
            <CardBody>
              <div>
                <Nav pills role="tablist">
                  {tabs.map((tab) => (
                    <NavItem key={tab.tabId}>
                      <NavLink
                        href={tab.href}
                        className={classnames({ active: activeTab.tabId === tab.tabId })}
                        onClick={() => toggleTab(tab)}
                      >
                        <i className={`${tab.icon} circle-line me-1 align-bottom`}></i>
                        {tab.title}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
                <TabContent activeTab={activeTab.tabId} className="pt-4">
                  {tabs.map((tab) => (
                    <TabPane key={tab.tabId} tabId={tab.tabId}>
                      {activeTab.tabId === tab.tabId ? tab.component : null}
                    </TabPane>
                  ))}
                </TabContent>
              </div>
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>

          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default GuaranteesTab;

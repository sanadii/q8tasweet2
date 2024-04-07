import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuarantee } from "store/actions";
import { campaignSelector } from 'selectors';
import classnames from "classnames";
import { usePermission } from 'shared/hooks';

// Shared imports
import { Col, Row, Card, CardBody, CardHeader, Nav, NavItem, NavLink } from "reactstrap";
import { Loader, DeleteModal, TableContainer, TableFilters, TableContainerHeader, TableContainerFilter } from "shared/components";
import { CheckboxHeader, CheckboxCell, Id, Name, Phone, Attended, Status, Guarantor, Actions } from "./GuaranteesCol";
import { useDelete, useFilter } from "shared/hooks"

import GuaranteesModal from "./GuaranteesModal";


// Components
import GuaranteesTab2 from "./GuaranteesTab2"

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

  
  // Permissions
  const {
    canChangeCampaign,
    canViewCampaignMember,
    canViewCampaignGuarantee,
    // canViewCampaignAttendees,
  } = usePermission();

  // Modal Constants
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Tabs & visibility
  const permissions = usePermission();
  const visibleTabs = useMemo(() => tabs.filter(tab => !!permissions[tab.permission]), [tabs, permissions]);

  const [activeTab, setActiveTab] = useState(String(visibleTabs[0]?.tabId || 1));

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(String(tab));
    }
  };

  // Tabs
  const tabs = [
    { tabId: 1, href: '#guaranteeGroup', icon: 'ri-overview-line', title: 'المجموعات الإنتخابية' },
    { tabId: 2, permission: 'guarantee', href: '#members', icon: 'ri-list-unordered', title: 'المضامين' },
    // { tabId: 1, permission: 'canViewCampaign', href: '#overview', icon: 'ri-overview-line', title: 'الملخص' },
    // { tabId: 2, permission: 'canViewCampaignMember', href: '#members', icon: 'ri-list-unordered', title: 'فريق العمل' },
    // { tabId: 3, permission: 'canViewCampaignGuarantee', href: '#guarantees', icon: 'ri-shield-line', title: 'الضمانات' },
    // { tabId: 4, permission: 'canViewCampaignAttendee', href: '#attendees', icon: 'ri-group-line', title: 'الحضور' },
    // { tabId: 5, permission: 'canViewCampaign', href: '#sorting', icon: 'ri-sort-line', title: 'الفرز' },
    // { tabId: 6, permission: 'canViewElector', href: '#voters', icon: 'ri-user-voice-line', title: 'الناخبين' },
    // { tabId: 7, permission: 'canViewActivitie', href: '#activities', icon: 'ri-activity-line', title: 'الأنشطة' },
    // { tabId: 9, permission: 'canViewCampaign', href: '#edit', icon: 'ri-activity-line', title: 'تعديل' },
  ];

  const tabComponents = {
    1: <GuaranteesTab />,
    // 1: <OverviewTab />,
    // 2: <MembersTab />,
    // 3: <GuaranteesTab campaignGuarantees={campaignGuarantees} campaignMembers={campaignMembers} />,
    // 4: <AttendeesTab />,
    // 5: <SortingTab />,
    // 6: <VotersTab />,
    // 7: <ActivitiesTab />,
    // 9: <EditTab />,
    // ... add other tabs similarly if they require props
  };


  const toggle = useCallback(() => {
    setIsModalVisible(prevIsModalVisible => !prevIsModalVisible);
  }, []);

  const handleCampaignGuaranteeClick = useCallback(
    (arg, modalMode) => {
      const campaignGuarantee = arg;
      setCampaignGuarantee({
        id: campaignGuarantee.id,
        member: campaignGuarantee.member,
        campaign: campaignGuarantee.campaign,
        civil: campaignGuarantee.civil,
        fullName: campaignGuarantee.fullName,
        gender: campaignGuarantee.gender,
        boxNo: campaignGuarantee.boxNo,
        membershipNo: campaignGuarantee.membershipNo,
        enrollmentDate: campaignGuarantee.enrollmentDate,
        phone: campaignGuarantee.phone,
        status: campaignGuarantee.status,
        notes: campaignGuarantee.notes,
      });

      // Set the modalMode state here
      setModalMode(modalMode);
      toggle();
    },
    [toggle]
  );



  const memberName = (campaignMembers || []).reduce((acc, member) => {
    acc[member.id] = member;
    return acc;
  }, {});
  const columns = useMemo(
    () => [
      {
        Header: () => <CheckboxHeader checkedAll={checkedAll} />,
        accessor: "id",
        Cell: (cellProps) => <CheckboxCell {...cellProps} deleteCheckbox={deleteCheckbox} />,
      },
      {
        Header: "م.",
        Cell: (cellProps) => <Id {...cellProps} />
      },
      {
        Header: "الاسم",
        accessor: row => ({ name: row.name, gender: row.gender }),
        Cell: (cellProps) => <Name {...cellProps} />
      },
      {
        Header: "التليفون",
        accessor: "phone",
        Cell: (cellProps) => <Phone {...cellProps} />
      },
      {
        Header: "الحضور",
        accessor: "attended",
        Cell: (cellProps) => <Attended {...cellProps} />
      },
      {
        Header: "الحالة",
        filterable: false,
        Cell: (cellProps) => <Status {...cellProps} />
      },
      {
        Header: "الضامن",
        filterable: false,
        Cell: (cellProps) =>
          <Guarantor
            cellProps={cellProps}
            campaignMembers={campaignMembers}
          />
      },
      {
        Header: "إجراءات",
        Cell: (cellProps) =>
          <Actions
            cellProps={cellProps}
            handleCampaignGuaranteeClick={handleCampaignGuaranteeClick}
            onClickDelete={onClickDelete}
          />
      },
    ], [handleCampaignGuaranteeClick, campaignMembers]);

  // Filters
  const { filteredData: campaignGuaranteeList, filters, setFilters } = useFilter(campaignGuarantees);

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
        modal={isModalVisible}
        modalMode={modalMode}
        toggle={toggle}
        campaignGuarantee={campaignGuarantee}
      />

      <Row>
        <Col lg={12}>
          <Card id="memberList">
            {/* <CardHeader>
            </CardHeader> */}
            <CardBody>
              <div>
                <TableContainerHeader
                  // Title
                  ContainerHeaderTitle="المضامين"
                  toggle={toggle}

                  // Delete Button
                  isMultiDeleteButton={isMultiDeleteButton}
                  setDeleteModalMulti={setDeleteModalMulti}
                />
                <Nav
                  pills
                  className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                  role="tablist"
                >
                  {visibleTabs.map((tab) => (
                    <NavItem key={tab.tabId}>
                      <NavLink
                        href={tab.href}
                        className={classnames({ active: activeTab === tab.tabId })}
                        onClick={() => toggleTab(tab.tabId)}
                      >
                        <i className={`${tab.icon} d-inline-block d-md-none`}></i>
                        <span className="d-none d-md-inline-block">{tab.title}</span>
                      </NavLink>
                    </NavItem>
                  ))
                  }
                </Nav>

                <TableFilters
                  // Filters
                  isGlobalFilter={true}
                  preGlobalFilteredRows={true}
                  isGenderFilter={true}
                  isGuaranteeAttendanceFilter={true}
                  isGuaranteeStatusFilter={true}
                  isGuarantorFilter={true}
                  isResetFilters={true}

                  // Settings
                  filters={filters}
                  setFilters={setFilters}
                  SearchPlaceholder="البحث بالاسم أو الرقم المدني..."

                />

                {campaignGuaranteeList ? (
                  <TableContainer
                    // Data
                    columns={columns}
                    data={campaignGuaranteeList || []}
                    customPageSize={50}

                    // Styling
                    className="custom-header-css"
                    divClass="table-responsive table-card mb-2"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light"
                  />
                ) : (
                  <Loader error={error} />
                )}
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

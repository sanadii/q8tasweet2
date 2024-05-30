// React & Redux core imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector, campaignSelector } from 'selectors';

// Action & Selector imports
import { getCampaigns, deleteCampaign } from "store/actions";

// Constants & Component imports
import { Loader, DeleteModal, TableContainer, TableContainerHeader } from "shared/components";
import { CheckboxHeader, CheckboxCell, Id, Name, NameAvatar, SimpleName, DueDate, Badge, CreateBy, Actions } from "shared/components"

import { useDelete, useFilter } from "shared/hooks"
import CampaignModal from "./CampaignModal";
// UI Components & styling imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllCampaigns = () => {
  const dispatch = useDispatch();

  // State Management
  const { campaigns, isCampaignSuccess, error } = useSelector(campaignSelector);
  const [modal, setModal] = useState(false);
  const [campaignList, setCampaignList] = useState(campaigns);
  const [campaign, setCampaign] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // Delete Hook
  const {
    // Delete Modal
    handleDeleteItem,
    deleteModal,
    setDeleteModal,
    deleteModalMulti,
    handleDeleteMultiple,

    // Table Header
    isMultiDeleteButton,
    setDeleteModalMulti,

    // Column Actions
    handleItemDeleteClick,
    handleCheckAllClick,
    handleCheckCellClick,
  } = useDelete(deleteCampaign);


  // Campaign Data
  useEffect(() => {
    if (campaigns && !campaigns.length) {
      dispatch(getCampaigns());
    }
  }, [dispatch, campaigns]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCampaign(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Update Data
  const handleCampaignClick = useCallback(
    (campaignData) => {
      setCampaign(campaignData);
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Add Data
  const handleCampaignClicks = () => {
    setCampaign("");
    setIsEdit(false);
    toggle();
  };


  const columns = useMemo(
    () => [
      {
        Header: () =>
          <CheckboxHeader
            handleCheckAllClick={handleCheckAllClick}
          />,
        accessor: "id",
        Cell: (cellProps) =>
          <CheckboxCell
            {...cellProps}
            handleCheckCellClick={handleCheckCellClick}
          />,
      },
      {
        Header: "م.",
        Cell: (cellProps) => {
          return <Id {...cellProps} />;
        },
      },
      {
        Header: "الحملة",
        accessor: "name",
        Cell: (cellProps) =>
          <NameAvatar
            {...cellProps}
            urlDir="campaigns"
          />
      },
      {
        Header: "الانتخابات",
        Cell: (cellProps) =>
          <SimpleName
            name={cellProps.row.original.election.name}
            slug={cellProps.row.original.election.slug}
            urlDir="elections"

          />
      },

      {
        Header: "الموعد",
        accessor: "election.dueDate",
        filterable: false,
        Cell: (cellProps) => {
          return <DueDate date={cellProps.row.original.election.dueDate} />;
        },
      },
      {
        Header: "الحالة",
        Cell: (cellProps) =>
          <Badge
            option="status"
            value={cellProps.row.original.task.status} />
      },
      {
        Header: "الأولية",
        Cell: (cellProps) =>
          <Badge
            option="priority"
            value={cellProps.row.original.task.priority}
          />
      },
      // {
      //   Header: "Moderators",
      //   accessor: "moderators",
      //   filterable: false,
      //   Cell: (cell) => {
      //     return <Moderators {...cell} />;
      //   },
      // },
      {
        Header: "Created By",
        accessor: "createdBy",
        filterable: false,
        useFilters: true,

        Cell: (cellProps) => {
          return <CreateBy {...cellProps} />;
        },
      },
      {
        Header: "إجراءات",
        accessor: "campaign",
        Cell: (cellProps) =>
          <Actions
            options={["view", "update", "delete"]}
            cell={cellProps}
            handleItemClick={handleCampaignClick}
            handleItemDeleteClick={handleItemDeleteClick}
          />
      },
    ],
    [handleCheckCellClick, handleCheckAllClick, handleCampaignClick, handleItemDeleteClick]
  );
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteItem()}
        onCloseClick={() => setDeleteModal(false)}
      />

      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          handleDeleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <CampaignModal
        modal={modal}
        toggle={toggle}
        campaign={campaign}
        isEdit={isEdit}
        setModal={setModal}
      />

      <Row>
        <Col lg={12}>
          <Card id="electionList">
            <CardBody>
              <TableContainerHeader
                // Title
                ContainerHeaderTitle="الحملات الإنتخابية"

                // Add Elector Button
                isContainerAddButton={true}
                AddButtonText="إضافة حملة أنتخابية"
                isEdit={isEdit}
                handleEntryClick={handleCampaignClicks}
                toggle={toggle}

                // Delete Button
                isMultiDeleteButton={isMultiDeleteButton}
                setDeleteModalMulti={setDeleteModalMulti}
              />
              {isCampaignSuccess && campaigns.length ? (
                <TableContainer
                  setDeleteModalMulti={setDeleteModalMulti}
                  setIsEdit={setIsEdit}
                  toggle={toggle}
                  isTableContainerHeader={true}

                  // Filters
                  isGlobalFilter={true}
                  preGlobalFilteredRows={true}
                  isCampaignCategoryFilter={true}
                  // isGlobalSearch={true}
                  // isCampaignListFilter={true}
                  // isCustomerFilter={isCustomerFilter}
                  // FieldFiters
                  isFieldFilter={true}
                  isResetFilters={true}
                  isScampaignFilter={true}
                  isStatusFilter={true}
                  isPriorityFilter={true}
                  isMultiDeleteButton={isMultiDeleteButton}
                  // isTestFilter={true}

                  // Table
                  columns={columns}
                  data={campaigns || []}
                  setCampaignList={setCampaignList}


                  SearchPlaceholder="Search for campaigns or something..."
                  // useFilters={true}
                  customPageSize={20}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light table-nowrap"
                  thClass="table-light text-muted"
                  handleCampaignClick={handleCampaignClicks}
                />
              ) : (
                <Loader error={error} />
              )}
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AllCampaigns;

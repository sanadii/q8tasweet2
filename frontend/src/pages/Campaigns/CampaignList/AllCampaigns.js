// React & Redux core imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector, campaignSelector } from 'selectors';

// Action & Selector imports
import { getCampaigns, deleteCampaign } from "store/actions";

// Constants & Component imports
import { Loader, DeleteModal, TableContainer, TableContainerHeader } from "shared/components";
import CampaignModal from "./CampaignModal";
import { Id, Name, DueDate, Status, Priority, CreateBy, Actions } from "./CampaignListCol";

// UI Components & styling imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllCampaigns = () => {
  const dispatch = useDispatch();

  // State Management
  const { campaigns, isCampaignSuccess, error } = useSelector(campaignSelector);
  const [campaignList, setCampaignList] = useState(campaigns);
  const [campaign, setCampaign] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // Campaign Data
  useEffect(() => {
    if (campaigns && !campaigns.length) {
      dispatch(getCampaigns());
    }
  }, [dispatch, campaigns]);

  // Delete Campaign
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCampaign(null);
    } else {
      setModal(true);
      // setDate(defaultdate());
    }
  }, [modal]);

  // Delete Data
  const onDeleteCheckBoxClick = (campaign) => {
    setCampaign(campaign);
    setDeleteModal(true);
  };

  // Delete Data
  const handleDeleteCampaign = () => {
    if (campaign) {
      dispatch(deleteCampaign(campaign.id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCampaignClick = useCallback(
    (arg) => {
      const campaign = arg;
      setCampaign({
        id: campaign.id,
        candidateId: campaign.candidate.id,
        candidateName: campaign.candidate.name,
        electionId: campaign.election.id,
        electionName: campaign.election.name,
        electionDueDate: campaign.election.dueDate,
        description: campaign.description,
        targetVotes: campaign.targetVotes,

        // Task
        status: campaign.status,
        priority: campaign.priority,
      });

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

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".campaignCheckBox");

    if (checkall.checked) {
      checkedEntry.forEach((checkedEntry) => {
        checkedEntry.checked = true;
      });
    } else {
      checkedEntry.forEach((checkedEntry) => {
        checkedEntry.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(deleteCampaign(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(".campaignCheckBox:checked");
    checkedEntry.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(checkedEntry);
  };

  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="campaignCheckBox form-check-input"
              value={cellProps.row.original.id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        Header: "ID",
        accessor: "id",
        filterable: false,
        Cell: (cellProps) => {
          return <Id {...cellProps} />;
        },
      },
      {
        Header: "الحملة",
        accessor: "name",
        filterable: false,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "الانتخابات",
        accessor: "election.name",
        filterable: false,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },

      {
        Header: "الموعد",
        accessor: "election.dueDate",
        filterable: false,
        Cell: (cellProps) => {
          return <DueDate {...cellProps} />;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        filterable: true,
        // useFilters: true,

        Cell: (cellProps) => {
          return <Status status={cellProps.row.original.status} />;
        },
      },
      {
        Header: "Priority",
        accessor: "priority",
        filterable: true,
        Cell: (cellProps) => {
          return <Priority {...cellProps} />;
        },
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
        Header: "Actions",
        accessor: "campaign",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <Actions
              {...cellProps}
              handleCampaignClick={handleCampaignClick}
              onDeleteCheckBoxClick={onDeleteCheckBoxClick}
            />
          );
        },
      },
    ],
    [handleCampaignClick, checkedAll]
  );
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCampaign}
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

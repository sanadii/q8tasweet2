// React & Redux core imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector, campaignSelector } from 'selectors';

// Action & Selector imports
import { getCampaigns, deleteCampaign } from "store/actions";

// Constants & Component imports
import { Loader, DeleteModal, TableContainer, TableContainerHeader } from "shared/components";
<<<<<<< HEAD
import CampaignModal from "./CampaignModal";
import { Id, Name, DueDate, Status, Priority, CreateBy, Actions } from "./CampaignListCol";

=======
import { CheckboxHeader, CheckboxCell, Id, NameAvatar, SimpleName, DateTime, Badge, CreateBy, Actions } from "shared/components"

import { useDelete, useFilter } from "shared/hooks"
import CampaignModal from "./CampaignModal";
>>>>>>> sanad
// UI Components & styling imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllCampaigns = () => {
  const dispatch = useDispatch();

  // State Management
  const { campaigns, isCampaignSuccess, error } = useSelector(campaignSelector);
<<<<<<< HEAD
=======
  const [modal, setModal] = useState(false);
>>>>>>> sanad
  const [campaignList, setCampaignList] = useState(campaigns);
  const [campaign, setCampaign] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

<<<<<<< HEAD
=======
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


>>>>>>> sanad
  // Campaign Data
  useEffect(() => {
    if (campaigns && !campaigns.length) {
      dispatch(getCampaigns());
    }
  }, [dispatch, campaigns]);

<<<<<<< HEAD
  // Delete Campaign
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);

=======
>>>>>>> sanad
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCampaign(null);
    } else {
      setModal(true);
<<<<<<< HEAD
      // setDate(defaultdate());
    }
  }, [modal]);

  // Delete Data
  const onClickDelete = (campaign) => {
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

=======
    }
  }, [modal]);

  // Update Data
  const handleCampaignClick = useCallback(
    (campaignData) => {
      setCampaign(campaignData);
>>>>>>> sanad
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

<<<<<<< HEAD
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
=======
>>>>>>> sanad

  const columns = useMemo(
    () => [
      {
<<<<<<< HEAD
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
=======
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
>>>>>>> sanad
        Cell: (cellProps) => {
          return <Id {...cellProps} />;
        },
      },
      {
        Header: "الحملة",
        accessor: "name",
<<<<<<< HEAD
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
=======
        Cell: (cellProps) =>
          <NameAvatar
            name={cellProps.row.original.candidate.name}
            image={cellProps.row.original.candidate.image}
            slug={cellProps.row.original.slug}
            dirName="campaigns"
            subTitle={cellProps.row.original.party?.name || null}
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
>>>>>>> sanad
      },

      {
        Header: "الموعد",
        accessor: "election.dueDate",
        filterable: false,
        Cell: (cellProps) => {
<<<<<<< HEAD
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
=======
          return <DateTime date={cellProps.row.original.election.dueDate} />;
        },
      },
      // {
      //   Header: "الحالة",
      //   Cell: (cellProps) =>
      //     <Badge
      //       option="status"
      //       value={cellProps.row.original.task.status} />
      // },
      // {
      //   Header: "الأولية",
      //   Cell: (cellProps) =>
      //     <Badge
      //       option="priority"
      //       value={cellProps.row.original.task.priority}
      //     />
      // },
      // {
>>>>>>> sanad
      //   Header: "Moderators",
      //   accessor: "moderators",
      //   filterable: false,
      //   Cell: (cell) => {
      //     return <Moderators {...cell} />;
      //   },
      // },
<<<<<<< HEAD
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
              onClickDelete={onClickDelete}
            />
          );
        },
      },
    ],
    [handleCampaignClick, checkedAll]
=======
      // {
      //   Header: "Created By",
      //   accessor: "createdBy",
      //   filterable: false,
      //   useFilters: true,

      //   Cell: (cellProps) => {
      //     return <CreateBy {...cellProps} />;
      //   },
      // },
      {
        Header: "إجراءات",
        accessor: "campaign",
        Cell: (cellProps) =>
          <Actions
            options={["view", "update", "delete"]}
            cell={cellProps}
            handleItemClicks={handleCampaignClick}
            handleItemDeleteClick={handleItemDeleteClick}
          />
      },
    ],
    [handleCheckCellClick, handleCheckAllClick, handleCampaignClick, handleItemDeleteClick]
>>>>>>> sanad
  );
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
<<<<<<< HEAD
        onDeleteClick={handleDeleteCampaign}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
=======
        onDeleteClick={() => handleDeleteItem()}
        onCloseClick={() => setDeleteModal(false)}
      />

      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          handleDeleteMultiple();
>>>>>>> sanad
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

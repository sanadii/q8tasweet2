// React & Redux core imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { electionsSelector } from '../../../Selectors/electionsSelector';

// Action & Selector imports
import { getCampaigns, deleteCampaign, getModeratorUsers } from "../../../store/actions";

// Constants & Component imports
import { StatusOptions, PriorityOptions } from "../../../Components/constants";
import { AvatarMedium, Loader, DeleteModal, TableContainer, TableContainerHeader } from "../../../Components/Common";
import CampaignModal from "./CampaignModal";
import { Id, Name, DueDate, Status, Priority, CreateBy, Moderators, Actions } from "./CampaignListCol";
import SimpleBar from "simplebar-react";

// Form & validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

// UI Components & styling imports
import { Col, Modal, ModalBody, Row, Label, Input, Button, ModalHeader, FormFeedback, Form } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AllCampaigns = () => {
  const dispatch = useDispatch();

  // Campaign Data
  const { campaigns, moderators, isCampaignSuccess, error } = useSelector(electionsSelector);
  const [campaignList, setCampaignList] = useState(campaigns);
  const [campaign, setCampaign] = useState([]);
  const [campaignCandidates, setCampaignCandidates] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // Campaign Data
  useEffect(() => {
    if (campaigns && !campaigns.length) {
      dispatch(getCampaigns());
    }
    // console.log("Campaigns:", campaigns); // log campaigns
  }, [dispatch, campaigns]);



  // Moderators
  useEffect(() => {
    if (moderators && !moderators.length) {
      dispatch(getModeratorUsers());
    }
  }, [dispatch, moderators]);

  const [moderatorsMap, setModeratorsMap] = useState({});

  useEffect(() => {
    Promise.resolve(moderators).then((moderatorsList) => {
      const map = moderatorsList.reduce((acc, moderator) => {
        acc[moderator.id] = moderator;
        return acc;
      }, {});

      setModeratorsMap(map);
    });
  }, [moderators]);


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
      setDate(defaultdate());
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
        name: campaign.name,
        image:
          campaign && campaign.image
            ? process.env.REACT_APP_API_URL + campaign.image
            : "",

        dueDate: campaign.dueDate,
        description: campaign.description,

        // Taxonomies
        category: campaign.category,
        // categoryName: campaign.categoryName,
        subCategory: campaign.subCategory,
        // subCategoryName: campaign.subCategoryName,

        tags: campaign.tags,

        // Campaign Spesifications
        type: campaign.type,
        result: campaign.result,
        votes: campaign.votes,
        seats: campaign.seats,

        // Admin
        status: campaign.status,
        priority: campaign.priority,
        moderators: campaign.moderators,
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
        accessor: "candidate.name",
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
      {
        Header: "Moderators",
        accessor: "moderators",
        filterable: false,
        Cell: (cell) => {
          return <Moderators {...cell} />;
        },
      },
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

      <div className="row">
        <Col lg={12}>
          <div className="card" id="campaignsList">
            {isCampaignSuccess && campaigns.length ? (
              <TableContainer
                // Header
                // Title
                // Button Text
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
                data={campaignList || []}
                setCampaignList={setCampaignList}

                // isStatusFilter={true}
                // isGlobalPagination={true}
                // isColumnFilter={true} // Change the prop name
                // isCampaignScampaignFilter={true}
                // isScampaignFilter={true}

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
          </div>
        </Col>
      </div>

      <Modal
        isOpen={modal}
        toggle={toggle}
        centered
        size="lg"
        className="border-0"
        modalClassName="modal fade zoomIn"
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggle}>
          {!!isEdit ? "Edit Campaign" : "Create Campaign"}
        </ModalHeader>
        <Form
          className="tablelist-form"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <ModalBody className="modal-body">
            <Row className="g-3">
              <p>
                Campaign Name:
                Due Date:
                Election:

              </p>

              <Col lg={12}>
                <div>
                  <Label for="description-field" className="form-label">
                    Description
                  </Label>
                  <Input
                    name="description"
                    id="description-field"
                    className="form-control"
                    placeholder="Description"
                    type="textarea"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.description || ""}
                    invalid={
                      validation.touched.description &&
                        validation.errors.description
                        ? true
                        : false
                    }
                  />
                  {validation.touched.description &&
                    validation.errors.description ? (
                    <FormFeedback type="invalid">
                      {validation.errors.description}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col lg={12}>
                <Label className="form-label">Moderators</Label>
                <SimpleBar style={{ maxHeight: "95px" }}>
                  <ul className="list-unstyled vstack gap-2 mb-0">
                    {moderators &&
                      moderators.map((moderator) => (
                        <li key={moderator.id}>
                          <div className="form-check d-flex align-items-center">
                            <input
                              name="moderators"
                              className="form-check-input me-3"
                              type="checkbox"
                              onChange={(e) => {
                                const selectedId = parseInt(e.target.value);
                                const updatedModerators =
                                  validation.values.moderators.includes(
                                    selectedId
                                  )
                                    ? validation.values.moderators.filter(
                                      (id) => id !== selectedId
                                    )
                                    : [
                                      ...validation.values.moderators,
                                      selectedId,
                                    ];
                                validation.setFieldValue(
                                  "moderators",
                                  updatedModerators
                                );
                              }}
                              onBlur={validation.handleBlur}
                              value={moderator.id}
                              checked={validation.values.moderators.includes(
                                moderator.id
                              )}
                              id={moderator.image}
                            />

                            <label
                              className="form-check-label d-flex align-items-center"
                              htmlFor={moderator.image}
                            >
                              <span className="flex-shrink-0">
                                <img
                                  src={
                                    process.env.REACT_APP_API_URL +
                                    moderator.image
                                  }
                                  alt=""
                                  className="avatar-xxs rounded-circle"
                                />
                              </span>
                              <span className="flex-grow-1 ms-2">
                                {moderator.firstName}
                              </span>
                            </label>
                            {validation.touched.moderators &&
                              validation.errors.moderators ? (
                              <FormFeedback type="invalid">
                                {validation.errors.moderators}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </li>
                      ))}
                  </ul>
                </SimpleBar>
              </Col>
              <hr />
              {/* <p>Admin Use</p> */}
              <Col lg={6}>
                <Label for="status-field" className="form-label">
                  Status
                </Label>
                <Input
                  name="status"
                  type="select"
                  className="form-select"
                  id="ticket-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.status || ""}
                >
                  {StatusOptions.map((status) => (
                    <option key={status.id} value={status.value}>
                      {status.name}
                    </option>
                  ))}
                </Input>
                {validation.touched.status && validation.errors.status ? (
                  <FormFeedback type="invalid">
                    {validation.errors.status}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="priority-field" className="form-label">
                  Priority
                </Label>
                <Input
                  name="priority"
                  type="select"
                  className="form-select"
                  id="priority-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.priority || ""}
                >
                  {PriorityOptions.map((priority) => (
                    <option key={priority.id} value={priority.value}>
                      {priority.name}
                    </option>
                  ))}
                </Input>
                {validation.touched.priority && validation.errors.priority ? (
                  <FormFeedback type="invalid">
                    {validation.errors.priority}
                  </FormFeedback>
                ) : null}
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  setModal(false);
                }}
                className="btn-light"
              >
                Close
              </Button>
              <button type="submit" className="btn btn-success" id="add-btn">
                {!!isEdit ? "Update Campaign" : "Add Campaign"}
              </button>
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AllCampaigns;

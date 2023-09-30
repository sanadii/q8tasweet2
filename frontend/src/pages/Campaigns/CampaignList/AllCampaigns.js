import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Col,
  Modal,
  ModalBody,
  Nav,
  NavItem,
  NavLink,
  Row,
  Label,
  Input,
  Button,
  ModalHeader,
  FormFeedback,
  Form,
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";

// Components
// Custom component imports
import { GenderCircle, ImageCircle, ImageGenderCircle, Loader, DeleteModal, TableContainer } from "../../../Components/Common";
// import { TableContainer, DeleteModal, ImageCircle } from "../../../Components/Common";

import {
  StatusOptions,
  PriorityOptions,
  ElectionTypeOptions,
  ElectionResultOptions,
  // TagOptions,
} from "../../../Components/constants";

import SimpleBar from "simplebar-react";
import Flatpickr from "react-flatpickr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import React FilePond
import { registerPlugin } from "react-filepond";
import Select from "react-select";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import {
  getCampaigns,
  addNewCampaign,
  updateCampaign,
  deleteCampaign,
  getModeratorUsers,
  getCategories,
} from "../../../store/actions";

import {
  Id,
  Name,
  CandidateCount,
  DueDate,
  Status,
  Priority,
  Category,
  CreateBy,
  Moderators,
  Actions,
} from "./CampaignListCol";

import * as Yup from "yup";
import { useFormik } from "formik";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// # id, image, name, description,  dueDate, location, category, status, priority, canidates, moderators
const AllCampaigns = () => {
  const dispatch = useDispatch();

  // Campaign Data
  const { campaigns, moderators, categories, subCategories, isCampaignSuccess, user, error } = useSelector(
    (state) => ({
      campaigns: state.Campaigns.campaigns,
      moderators: state.Users.moderators,
      categories: state.Categories.categories,
      subCategories: state.Categories.subCategories,
      isCampaignSuccess: state.Campaigns.isCampaignSuccess,
      user: state.Profile.user,
      error: state.Campaigns.error,
    })
  );

  const [campaignList, setCampaignList] = useState(campaigns);
  const [campaign, setCampaign] = useState([]);
  const [category, setCategory] = useState([]);
  const [campaignCandidates, setCampaignCandidates] = useState([]);
  const [userName, setUserName] = useState("Admin");
  const [userId, setUserId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Campaign Data
  useEffect(() => {
    if (campaigns && !campaigns.length) {
      dispatch(getCampaigns());
    }
    // console.log("Campaigns:", campaigns); // log campaigns
  }, [dispatch, campaigns]);

  useEffect(() => {
    setCampaignList(campaigns);
    // console.log("Campaign List:", campaignList); // log campaignList
  }, [campaigns]);

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


  // User & id
  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let loggedUserId = "Not Logged In"; // default to "Logged In"
      let name = "Not Logged In"; // default to "Logged In"

      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        name = obj.providerData[0].email;
      } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
        loggedUserId = obj.data.id;
      }

      setUserName(name);
      setUserId(loggedUserId); // set userId from sessionStorage
    }
  }, [user]);







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

  // Image
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      // console.log("handleImageSelect called");
    }
  };

  const formData = new FormData();
  if (!selectedImage) {
    // console.log("no selected image");
  } else {
    formData.append("image", selectedImage);
    formData.append("folder", "campaigns"); // replace "yourFolderName" with the actual folder name
  }

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      name: (campaign && campaign.name) || "",
      image: (campaign && campaign.image) || "",
      selectedImage: selectedImage,
      description: (campaign && campaign.description) || "",
      dueDate: (campaign && campaign.dueDate) || "",
      category: (campaign && campaign.category) || 0,
      subCategory: (campaign && campaign.subCategory) || 0,
      tags: (campaign && campaign.tags) || [],

      // Campaign Specification
      type: (campaign && campaign.type) || "",
      result: (campaign && campaign.result) || "",
      votes: (campaign && campaign.votes) || 0,
      seats: (campaign && campaign.seats) || 0,

      // Admin
      status: (campaign && campaign.status) || "New",
      priority: (campaign && campaign.priority) || "High",
      moderators:
        campaign && Array.isArray(campaign.moderators)
          ? campaign.moderators.map((moderator) => moderator.id)
          : [],

      // System
      createdBy: userId,
      updatedBy: userId,
      createdDate: (campaign && campaign.createdDate) || "",
      updatedDate: (campaign && campaign.updatedDate) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Campaign Name"),
      category: Yup.number().integer().required('Category is required'),
      subCategory: Yup.number().integer().required('Sub-Category is required'),

    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedCampaign = {
          id: campaign ? campaign.id : 0,
          name: values.name,
          image: values.image,
          selectedImage: selectedImage,
          dueDate: values.dueDate,
          description: values.description,

          // Taxonomies
          category: values.category,
          subCategory: values.subCategory,
          tags: Array.isArray(values.tags) ? values.tags : [],

          // Campaign Spesifications
          type: values.type,
          result: values.result,
          votes: values.votes,
          seats: values.seats,

          // Admin
          status: values.status,
          priority: values.priority,
          moderators: values.moderators,
          updatedBy: userId,
        };
        // console.log(updatedCampaign); // before calling dispatch in onSubmit

        // Update campaign
        dispatch(
          updateCampaign({ campaign: updatedCampaign, formData: formData })
        );
      } else {
        const newCampaign = {
          id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          name: values.name,
          image: values.image,
          selectedImage: selectedImage,
          dueDate: values.dueDate,
          description: values.description,

          // Taxonomies
          category: values.category,
          subCategory: values.subCategory,
          tags: Array.isArray(values.tags) ? values.tags : [],

          // Campaign Spesifications
          type: values.type,
          result: values.result,
          votes: values.votes,
          seats: values.seats,

          // Admin
          status: values.status,
          priority: values.priority,
          moderators: values.moderators,
          createdBy: userId,
        };
        // console.log(newCampaign); // before calling dispatch in onSubmit
        // Save new campaign
        dispatch(addNewCampaign({ campaign: newCampaign, formData: formData }));
      }

      validation.resetForm();
      toggle();
    },
  });


  // Campaign Categories
  useEffect(() => {
    if (categories && !categories.length) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);

  useEffect(() => {
    setCategoryOptions(categories);
    setSubCategoryOptions(subCategories);
  }, [categories, subCategories]);

  const [categoryOptions, setCategoryOptions] = useState(categories);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [activeParentCategoryId, setActiveParentCategoryId] = useState(null);

  // Watch for changes in validation.values.category
  useEffect(() => {
    if (validation && validation.values.category) {
      const initialCategoryId = Number(validation.values.category);
      const relatedSubCategories = subCategories.filter(
        subCategory => subCategory.parent === initialCategoryId
      );

      setActiveParentCategoryId(initialCategoryId);
      setSubCategoryOptions(relatedSubCategories);
    }
  }, [validation, subCategories]);

  const changeSubCategoriesOptions = (e) => {
    const activeCategoryId = Number(e.target.value);
    const relatedSubCategories = subCategories.filter(
      subCategory => subCategory.parent === activeCategoryId
    );

    setActiveParentCategoryId(activeCategoryId);
    const currentSubCategoryValue = validation.values.subCategory;
    const isCurrentSubCategoryStillValid = relatedSubCategories.some(subCategory => subCategory.id === currentSubCategoryValue);

    if (!isCurrentSubCategoryStillValid) {
      // Reset the subCategory value to a default or append it to the list.
      // For example, set it to the first subCategory in the filtered list:
      validation.setFieldValue("subCategory", relatedSubCategories[0]?.id || "");

      // Or, if you want to append the current subCategory to the list instead:
      // const currentSubCategory = subCategories.find(subCategory => subCategory.id === currentSubCategoryValue);
      // relatedSubCategories.push(currentSubCategory);
    }

    setSubCategoryOptions(relatedSubCategories);
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
        candidateCount: campaign.candidateCount,
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
        name: "Image",
        title: "Image",
        accessor: "image",
        Cell: (cellProps) => (
          <ImageCircle imagePath={cellProps.row.original.image} />
        ), // Use the CircleImage component
      },

      {
        Header: "Campaigns",
        accessor: "name",
        filterable: false,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Candidates",
        accessor: "candidateCount",
        filterable: false,
        Cell: (cellProps) => {
          return <CandidateCount {...cellProps} />;
        },
      },

      {
        Header: "Due Date",
        accessor: "dueDate",
        filterable: false,
        Cell: (cellProps) => {
          return <DueDate {...cellProps} />;
        },
      },
      {
        Header: "Category",
        accessor: "category",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <Category
              category={cellProps.row.original.category}
              subCategory={cellProps.row.original.subCategory}
            />
          );
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

  // Dates
  const defaultdate = () => {
    let d = new Date();
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const [dueDate, setDate] = useState(defaultdate());

  const dateformate = (e) => {
    const selectedDate = new Date(e);
    const formattedDate = `${selectedDate.getFullYear()}-${(
      "0" +
      (selectedDate.getMonth() + 1)
    ).slice(-2)}-${("0" + selectedDate.getDate()).slice(-2)}`;

    // Update the form field value directly with the formatted date
    validation.setFieldValue("dueDate", formattedDate);
  };

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
              <Col lg={12}>
                <div>
                  <Label for="emage-field" className="form-label">
                    Upload Image
                  </Label>
                  <div className="text-center">
                    <label
                      htmlFor="emage-field"
                      className="mb-0"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title=""
                      data-bs-original-title="Select Image"
                    >
                      <div className="position-relative d-inline-block">
                        <div className="position-absolute top-100 start-100 translate-middle">
                          <div className="avatar-xs">
                            <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                              <i className="ri-image-fill"></i>
                            </div>
                          </div>
                        </div>
                        <div
                          className="avatar-xl"
                          style={{
                            width: "250px",
                            height: "250px",
                            overflow: "hidden",
                            cursor: "pointer", // Add this line
                            backgroundImage: `url(${validation.values.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        ></div>
                      </div>
                      <input
                        className="form-control d-none"
                        id="emage-field"
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={(e) => {
                          handleImageSelect(e);
                          const selectedImage = e.target.files[0];
                          if (selectedImage) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              // console.log(
                              //   "Image loaded successfully:",
                              //   reader.result
                              // );
                              const imgElement =
                                document.querySelector(".avatar-xl");
                              if (imgElement) {
                                imgElement.style.backgroundImage = `url(${reader.result})`;
                              }
                            };
                            reader.readAsDataURL(selectedImage);
                          }
                        }}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.image && validation.errors.image
                            ? "true"
                            : undefined
                        }
                      />
                    </label>
                  </div>
                  {validation.touched.image && validation.errors.image ? (
                    <FormFeedback type="invalid">
                      {validation.errors.image}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col lg={6}>
                <Label for="campaign=name-field" className="form-label">
                  Campaign Name
                </Label>
                <Input
                  name="name"
                  id="campaign-name-field"
                  className="form-control"
                  placeholder="Campaign Name"
                  type="text"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.name || ""}
                  invalid={
                    validation.touched.name && validation.errors.name
                      ? true
                      : false
                  }
                />
                {validation.touched.name && validation.errors.name ? (
                  <FormFeedback type="invalid">
                    {validation.errors.name}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="dueDate-field" className="form-label">
                  Due Date
                </Label>

                <Flatpickr
                  name="dueDate"
                  id="dueDate-field"
                  className="form-control"
                  placeholder="Select a dueDate"
                  options={{
                    altInput: true,
                    altFormat: "Y-m-d",
                    dateFormat: "Y-m-d",
                  }}
                  onChange={(e) => dateformate(e)}
                  value={validation.values.dueDate || ""}
                />
                {validation.touched.dueDate && validation.errors.dueDate ? (
                  <FormFeedback type="invalid">
                    {validation.errors.dueDate}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="category-field" className="form-label">
                  Campaign Category
                </Label>
                <Input
                  name="category"
                  type="select"
                  className="form-select"
                  id="category-field"
                  onChange={(e) => {
                    validation.handleChange(e);
                    changeSubCategoriesOptions(e);
                  }}
                  onBlur={validation.handleBlur}
                  value={validation.values.category || 0}
                >
                  <option value="">Choose Category</option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={parseInt(category.id)}>
                      {category.name}
                    </option>

                  ))}
                </Input>
                {validation.touched.category && validation.errors.category ? (
                  <FormFeedback type="invalid">
                    {validation.errors.category}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="sub-category-field" className="form-label">
                  Campaign Sub-Category
                </Label>
                <Input
                  name="subCategory"
                  type="select"
                  className="form-select"
                  id="sub-category-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.subCategory || ""}
                >
                  <option value="">Choose Sub-Category</option>
                  {subCategoryOptions.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </Input>
                {validation.touched.subCategory &&
                  validation.errors.subCategory ? (
                  <FormFeedback type="invalid">
                    {validation.errors.subCategory}
                  </FormFeedback>
                ) : null}
              </Col>

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
              <Col lg={6}>
                <Label for="campaign-type-field" className="form-label">
                  Campaign Type
                </Label>
                <Input
                  name="type"
                  type="select"
                  className="form-select"
                  id="ticket-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.type || ""}
                >
                  {ElectionTypeOptions.map((type) => (
                    <option key={type.id} value={type.value}>
                      {type.name}
                    </option>
                  ))}
                </Input>
                {validation.touched.type && validation.errors.type ? (
                  <FormFeedback type="invalid">
                    {validation.errors.type}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="campaign-result-field" className="form-label">
                  Campaign Type
                </Label>
                <Input
                  name="result"
                  type="select"
                  className="form-select"
                  id="ticket-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.result || ""}
                >
                  {ElectionResultOptions.map((result) => (
                    <option key={result.id} value={result.value}>
                      {result.name}
                    </option>
                  ))}
                </Input>
                {validation.touched.result && validation.errors.result ? (
                  <FormFeedback result="invalid">
                    {validation.errors.result}
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

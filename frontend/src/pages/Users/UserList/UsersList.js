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

// Custom component imports
import { GenderCircle, ImageCircle, ImageGenderCircle, Loader, DeleteModal, TableContainer } from "../../../shared/components";
// import { TableContainer, DeleteModal, ImageCircle } from "../../../Components/Common";

import {
  StatusOptions,
  PriorityOptions,
  ElectionMethodOptions,
  ElectionResultOptions,
  // TagOptions,
} from "shared/constants";

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
  getElections,
  addElection,
  updateUser,
  deleteElection,
  getModeratorUsers,
  getCategories,
} from "../../../store/actions";

import {
  Id,
  Name,
  UserCount,
  DueDate,
  Status,
  Priority,
  Category,
  CreateBy,
  Moderators,
  Actions,
} from "./UserListCol";

import * as Yup from "yup";
import { useFormik } from "formik";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Elections = () => {
  const dispatch = useDispatch();

  // User Data
  const { elections, moderators, categories, subCategories, isElectionSuccess, user, error } = useSelector(
    (state) => ({
      elections: state.Elections.elections,
      moderators: state.Users.moderators,
      categories: state.Categories.categories,
      subCategories: state.Categories.subCategories,
      isElectionSuccess: state.Elections.isElectionSuccess,
      user: state.Profile.user,
      error: state.Elections.error,
    })
  );

  const [electionList, setElectionList] = useState(elections);
  const [user, setElection] = useState([]);
  const [category, setCategory] = useState([]);
  const [userElections, setUserElections] = useState([]);
  const [userName, setUserName] = useState("Admin");
  const [userId, setUserId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // User Data
  useEffect(() => {
    if (elections && !elections.length) {
      dispatch(getElections());
    }
    // console.log("Elections:", elections); // log elections
  }, [dispatch, elections]);

  useEffect(() => {
    setElectionList(elections);
    // console.log("User List:", electionList); // log electionList
  }, [elections]);

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
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      let loggedUserId = "Not Logged In"; // default to "Logged In"
      let name = "Not Logged In"; // default to "Logged In"

      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        name = obj.providerData[0].email;
      } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
        loggedUserId = obj.data.id;
      }

      setUserName(name);
      setUserId(loggedUserId); // set userId from localStorage
    }
  }, [user]);

  // Delete User
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElection(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);

  // Delete Data
  const onDeleteCheckBoxClick = (user) => {
    setElection(user);
    setDeleteModal(true);
  };

  // Delete Data
  const handleDeleteElection = () => {
    if (user) {
      dispatch(deleteElection(user.id));
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
    formData.append("folder", "elections"); // replace "yourFolderName" with the actual folder name
  }

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      name: (user && user.name) || "",
      image: (user && user.image) || "",
      selectedImage: selectedImage,
      description: (user && user.description) || "",
      dueDate: (user && user.dueDate) || "",
      category: (user && user.category) || 0,
      subCategory: (user && user.subCategory) || 0,
      tags: (user && user.tags) || [],

      // User Specification
      type: (user && user.type) || "",
      result: (user && user.result) || "",
      votes: (user && user.votes) || 0,
      seats: (user && user.seats) || 0,
      voters: (user && user.voters) || 0,
      attendees: (user && user.attendees) || 0,

      // Admin
      status: (user && user.status) || 0,
      priority: (user && user.priority) || 1,
      moderators:
        user && Array.isArray(user.moderators)
          ? user.moderators.map((moderator) => moderator.id)
          : [],

      // System
      createdBy: userId,
      updatedBy: userId,
      createdDate: (user && user.createdDate) || "",
      updatedDate: (user && user.updatedDate) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter User Name"),
      category: Yup.number().integer().required('Category is required'),
      subCategory: Yup.number().integer().required('Sub-Category is required'),
      status: Yup.number().integer().required('Status is required'),
      priority: Yup.number().integer().required('priority is required'),


    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedElection = {
          id: user ? user.id : 0,
          name: values.name,
          image: values.image,
          selectedImage: selectedImage,
          dueDate: values.dueDate,
          description: values.description,

          // Taxonomies
          category: values.category,
          subCategory: values.subCategory,
          tags: Array.isArray(values.tags) ? values.tags : [],

          // User Spesifications
          type: values.type,
          result: values.result,
          votes: values.votes,
          seats: values.seats,
          voters: values.voters,
          attendees: values.attendees,

          // Admin
          status: parseInt(values.status, 10),
          priority: parseInt(values.priority, 10),
          moderators: values.moderators,
          updatedBy: userId,
        };
        // console.log(updatedElection); // before calling dispatch in onSubmit

        // Update user
        dispatch(
          updateUser({ user: updatedElection, formData: formData })
        );
      } else {
        const newElection = {
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

          // User Spesifications
          type: values.type,
          result: values.result,
          votes: values.votes,
          seats: values.seats,

          // Admin
          status: parseInt(values.status, 10),
          priority: parseInt(values.priority, 10),
          moderators: values.moderators,
          createdBy: userId,
        };
        // console.log(newElection); // before calling dispatch in onSubmit
        // Save new user
        dispatch(addElection({ user: newElection, formData: formData }));
      }

      validation.resetForm();
      toggle();
    },
  });


  // User Categories
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
  const handleElectionClick = useCallback(
    (arg) => {
      const user = arg;

      setElection({
        id: user.id,
        name: user.name,
        image:
          user && user.image
            ? process.env.REACT_APP_API_URL + user.image
            : "",

        dueDate: user.dueDate,
        userCount: user.userCount,
        description: user.description,

        // Taxonomies
        category: user.category,
        // categoryName: user.categoryName,
        subCategory: user.subCategory,
        // subCategoryName: user.subCategoryName,

        tags: user.tags,

        // User Spesifications
        type: user.type,
        result: user.result,
        votes: user.votes,
        seats: user.seats,
        voters: user.voters,
        attendees: user.attendees,

        // Admin
        status: user.status,
        priority: user.priority,
        moderators: user.moderators,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Add Data
  const handleElectionClicks = () => {
    setElection("");
    setIsEdit(false);
    toggle();
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".electionCheckBox");

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
      dispatch(deleteElection(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(".electionCheckBox:checked");
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
              className="electionCheckBox form-check-input"
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
        Header: "Elections",
        accessor: "name",
        filterable: false,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Users",
        accessor: "userCount",
        filterable: false,
        Cell: (cellProps) => {
          return <UserCount {...cellProps} />;
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
        accessor: "user",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <Actions
              {...cellProps}
              handleElectionClick={handleElectionClick}
              onDeleteCheckBoxClick={onDeleteCheckBoxClick}
            />
          );
        },
      },
    ],
    [handleElectionClick, checkedAll]
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
        onDeleteClick={handleDeleteElection}
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
          <div className="card" id="electionsList">
            {isElectionSuccess && elections.length ? (
              <TableContainer
                // Header
                isTableContainerHeader={true}
                ContainerHeaderTitle="User Guarantees"
                AddButtonText="Add New User"
                setDeleteModalMulti={setDeleteModalMulti}
                setIsEdit={setIsEdit}
                toggle={toggle}

                // Filters
                isGlobalFilter={true}
                preGlobalFilteredRows={true}
                isElectionCategoryFilter={true}
                // isGlobalSearch={true}
                // isElectionListFilter={true}
                // isCustomerFilter={isCustomerFilter}
                // FieldFiters
                isFieldFilter={true}
                isResetFilters={true}
                isSelectionFilter={true}
                isStatusFilter={true}
                isPriorityFilter={true}
                isMultiDeleteButton={isMultiDeleteButton}
                // isTestFilter={true}

                // Table
                columns={columns}
                data={electionList || []}
                setElectionList={setElectionList}

                // isStatusFilter={true}
                // isGlobalPagination={true}
                // isColumnFilter={true} // Change the prop name
                // isElectionSelectionFilter={true}
                // isSelectionFilter={true}

                SearchPlaceholder="Search for elections or something..."
                // useFilters={true}
                customPageSize={20}
                className="custom-header-css"
                divClass="table-responsive table-card mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light text-muted"
                handleElectionClick={handleElectionClicks}
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
          {!!isEdit ? "Edit User" : "Create User"}
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
              <Col lg={6}>
                <div>
                  <Label for="name-field" className="form-label">
                    User Name
                  </Label>
                  <Input
                    id="name-field"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="User Name"
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
                </div>
                <div>
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
                </div>
                <div>
                  <Label for="category-field" className="form-label">
                    User Category
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
                </div>
                <div>
                  <Label for="sub-category-field" className="form-label">
                    User Sub-Category
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
                </div>
              </Col>
              <Col lg={6}>
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
                <Label for="user-type-field" className="form-label">
                  User Type
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
                  {ElectionMethodOptions.map((type) => (
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
                <Label for="user-result-field" className="form-label">
                  Result Type
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
              <Col lg={6}>
                <Label for="user-votes-field" className="form-label">
                  Number of Votes
                </Label>
                <Input
                  id="votes-field"
                  name="votes"
                  type="number"
                  value={validation.values.votes || ""}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                >
                </Input>
                {validation.touched.votes && validation.errors.votes ? (
                  <FormFeedback votes="invalid">
                    {validation.errors.votes}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="user-seats-field" className="form-label">
                  Number of Seats
                </Label>
                <Input
                  id="seats-field"
                  name="seats"
                  type="number"
                  className="form-control"
                  placeholder="0"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.seats || ""}
                >

                </Input>
                {validation.touched.seats && validation.errors.seats ? (
                  <FormFeedback seats="invalid">
                    {validation.errors.seats}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="voters-field" className="form-label">
                  Number of Voters
                </Label>
                <Input
                  id="voters-field"
                  name="voters"
                  type="number"
                  className="form-control"
                  placeholder="0"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.voters || ""}
                >

                </Input>
                {validation.touched.voters && validation.errors.seats ? (
                  <FormFeedback voters="invalid">
                    {validation.errors.voters}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="attendees-field" className="form-label">
                  Nunber of Attendees
                </Label>
                <Input
                  id="attendees-field"
                  name="attendees"
                  type="number"
                  className="form-control"
                  placeholder="0"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.attendees || ""}
                >
                </Input>
                {validation.touched.attendees && validation.errors.attendees ? (
                  <FormFeedback attendees="invalid">
                    {validation.errors.attendees}
                  </FormFeedback>
                ) : null}
              </Col>
              <hr />

              {/* <Col lg={12}>
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
              </Col> */}
              <Col lg={6}>
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
              {/* <p>Admin Use</p> */}
              <Col lg={6}>
                <div>
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
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </Input>
                  {validation.touched.status && validation.errors.status ? (
                    <FormFeedback type="invalid">
                      {validation.errors.status}
                    </FormFeedback>
                  ) : null}
                </div>
                <div>
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
                      <option key={priority.id} value={priority.id}>
                        {priority.name}
                      </option>
                    ))}
                  </Input>
                  {validation.touched.priority && validation.errors.priority ? (
                    <FormFeedback type="invalid">
                      {validation.errors.priority}
                    </FormFeedback>
                  ) : null}
                </div>
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
                {!!isEdit ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Elections;

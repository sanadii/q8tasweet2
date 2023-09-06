import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useParams } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getElectionDetails, updateElection } from "../../../store/actions";
// import { useCategoryOptions } from "../../../Components/Hooks"; // adjust path according to your project structure

// Others
import { isEmpty } from "lodash";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
  FormFeedback,
  Form,
} from "reactstrap";

import { getModeratorUsers } from "../../../store/actions";
//Import Flatepicker
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Dropzone from "react-dropzone";

import {
  StatusOptions,
  PriorityOptions,
  RankOptions,
  ElectionTypeOptions,
  ElectionResultOptions,
  TagOptions,
} from "../../../Components/constants";

const EditTab = ({ election }) => {
  const dispatch = useDispatch();


  const { electionDetails } = useSelector((state) => ({
    electionDetails: state.Elections.electionDetails,
  }));


  // Media
  const MEDIA_URL = process.env.MEDIA_URL;
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      console.log("handleImageSelect called");
    }
  };

  const formData = new FormData();

  if (selectedImage) {
    formData.append("image", selectedImage);
    formData.append("folder", "elections"); // Replace "elections" with the actual folder name
  } else {
    console.log("No selected image");
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: (election && election.name) || "",
      image: election.image ? `${MEDIA_URL}${election.image}` : "",
      selectedImage: selectedImage,
      description: (election && election.description) || "",
      dueDate: (election && election.dueDate) || "",

      category: (election && election.category) || "",
      subCategory: (election && election.subCategory) || "",
      tags: (election && election.tags) || [],

      // candidates: (election && election.candidates) || [],
      // committees: (election && election.committees) || [],
      // moderators: (election && election.moderators) || [],

      status: (election && election.status) || "New",
      priority: (election && election.priority) || "High",

      // Election Specification
      type: (election && election.type) || "",
      result: (election && election.result) || "",
      votes: (election && election.votes) || 0,
      seats: (election && election.seats) || 0,

      // System
      delet: (election && election.delet) || "",
      createdBy: (election && election.createdBy) || "",
      createdDate: (election && election.createdDate) || "",
      updatedBy: (election && election.updatedBy) || "",
      updatedDate: (election && election.updatedDate) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Election Name"),
    }),
    onSubmit: (values) => {
      const updatedElection = {
        id: election ? election.id : 0,
        name: values.name,
        image: values.image,
        selectedImage: selectedImage,
        dueDate: dueDate,
        description: values.description,

        // Taxonomies
        category: values.category,
        subCategory: values.subCategory,
        tags: Array.isArray(values.tags) ? values.tags : [],

        // Election Spesifications
        type: values.type,
        result: values.result,
        votes: values.votes,
        seats: values.seats,

        // Admin
        status: values.status,
        priority: values.priority,

        // System
        createdBy: values.createdBy,
        createdDate: values.createdDate,
        updatedBy: values.updatedBy,
        updatedDate: values.updatedDate,

        // candidates: Array.isArray(values.candidates) ? values.candidates : [],
        // committees: Array.isArray(values.committees) ? values.committees : [],
        // moderators: Array.isArray(values.moderators) ? values.moderators : [],
      };
      dispatch(
        updateElection({ election: updatedElection, formData: formData })
      );
    },
  });

  // Categories
  const categories = useSelector((state) => state.Categories.categories);
  const subCategories = useSelector((state) => state.Categories.subcategories);

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
      (subCategory) => subCategory.parent === activeCategoryId
    );

    setActiveParentCategoryId(activeCategoryId);
    const currentSubCategoryValue = validation.values.subCategory;
    const isCurrentSubCategoryStillValid = relatedSubCategories.some(
      (subCategory) => subCategory.id === currentSubCategoryValue
    );

    if (!isCurrentSubCategoryStillValid) {
      // Reset the subCategory value to a default or append it to the list.
      // For example, set it to the first subCategory in the filtered list:
      validation.setFieldValue(
        "subCategory",
        relatedSubCategories[0]?.id || ""
      );

      // Or, if you want to append the current subCategory to the list instead:
      // const currentSubCategory = subCategories.find(subCategory => subCategory.id === currentSubCategoryValue);
      // relatedSubCategories.push(currentSubCategory);
    }

    setSubCategoryOptions(relatedSubCategories);
  };

  const [selectedMulti, setselectedMulti] = useState(null);

  const handleMulti = (selectedMulti) => {
    setselectedMulti(selectedMulti);
  };

  //Dropzone file upload
  const [selectedFiles, setselectedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  const handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  };

  // Formats the size
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Format the Date
  const defaultdate = () => {
    let d = new Date();
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };
  const [dueDate, setDueDate] = useState(defaultdate());

  const dateformate = (e) => {
    const selectedDate = new Date(e);
    const formattedDate = `${selectedDate.getFullYear()}-${(
      "0" +
      (selectedDate.getMonth() + 1)
    ).slice(-2)}-${("0" + selectedDate.getDate()).slice(-2)}`;
    setDueDate(formattedDate);
  };

  document.title =
    "Update Election | Q8Tasweet - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <Form
        className="tablelist-form"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <Row>
          <Col lg={2}>
            <div className="card">
              <CardHeader>
                <h5>ِAdmin</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
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
                            width: "150px",
                            height: "150px",
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
                              console.log(
                                "Image loaded successfully:",
                                reader.result
                              );
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
                <div className="mb-3 mb-lg-0">
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
                      <option key={priority.name} value={priority.value}>
                        {priority.value}
                      </option>
                    ))}
                  </Input>{" "}
                  {validation.touched.priority && validation.errors.priority ? (
                    <FormFeedback type="invalid">
                      {validation.errors.priority}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3 mb-lg-0">
                  <Label for="status-field" className="form-label">
                    Status
                  </Label>
                  <Input
                    name="status"
                    type="select"
                    className="form-select"
                    id="status-field"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.status || ""}
                  >
                    {StatusOptions.map((status) => (
                      <option key={status.name} value={status.value}>
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
              </CardBody>
            </div>
          </Col>
          <Col lg={7}>
            <Card>
              <CardHeader>
                <h5>Details</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={8}>
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="election-name-input"
                      >
                        Election Name / {election.name}
                      </Label>
                      <Input
                        name="name"
                        id="election-name-field"
                        className="form-control"
                        placeholder="Election Name"
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
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div>
                      <Label
                        htmlFor="datepicker-deadline-input"
                        className="form-label"
                      >
                        Date
                      </Label>
                      <Flatpickr
                        name="dueDate"
                        id="dueDate-field"
                        className="form-control"
                        placeholder="Select a Date"
                        options={{
                          altInput: true,
                          altFormat: "Y-m-d",
                          dateFormat: "Y-m-d",
                        }}
                        onChange={(e) => dateformate(e)}
                        value={validation.values.dueDate || ""}
                      />
                      {validation.touched.dueDate &&
                        validation.errors.dueDate ? (
                        <FormFeedback type="invalid">
                          {validation.errors.dueDate}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={4}>
                    <div>
                      <Label for="category-field" className="form-label">
                        Election Category
                      </Label>
                      <Input
                        name="category"
                        type="select"
                        className="form-select"
                        id="ticket-field"
                        onChange={(e) => {
                          validation.handleChange(e);
                          changeSubCategoriesOptions(e);
                        }}
                        onBlur={validation.handleBlur}
                        value={validation.values.category || ""}
                      >
                        <option value="">Choose Category</option>
                        {/* Dynamically generate options based on categories */}
                        {categoryOptions.map(
                          (category) =>
                            // Add a conditional check for parent === 0 and id !== 0
                            category.parent === 0 &&
                            category.id !== 0 && (
                              <option
                                key={category.id}
                                id={category.id}
                                value={category.name}
                              >
                                {category.name}
                              </option>
                            )
                        )}
                      </Input>{" "}
                      {validation.touched.category &&
                        validation.errors.category ? (
                        <FormFeedback type="invalid">
                          {validation.errors.category}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div>
                      <Label for="sub-category-field" className="form-label">
                        Election Sub-Category
                      </Label>
                      <Input
                        name="subCategory"
                        type="select"
                        className="form-select"
                        id="sub-category-field" // Change the id to "sub-category-field"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.subCategory || ""}
                      >
                        <option value="">Choose Sub-Category</option>
                        {/* Dynamically generate options based on subCategoryList */}
                        {categoryOptions.map((subCategory) => (
                          <option key={subCategory.id} value={subCategory.name}>
                            {subCategory.name}
                          </option>
                        ))}
                      </Input>
                      {validation.touched.category &&
                        validation.errors.category ? (
                        <FormFeedback type="invalid">
                          {validation.errors.category}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div>
                      <Label
                        htmlFor="choices-text-input"
                        className="form-label"
                      >
                        Tags
                      </Label>
                      <Select
                        value={selectedMulti}
                        isMulti={true}
                        onChange={() => {
                          handleMulti();
                        }}
                        options={TagOptions}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="mb-3">
                  <Label className="form-label">Election Description</Label>
                  <CKEditor
                    name="description"
                    id="description-field"
                    className="form-control"
                    editor={ClassicEditor}
                    data={validation.values.description || ""}
                    onReady={(editor) => {
                      // You can store the "editor" and use when it is needed.
                    }}
                    // onChange={(editor) => {
                    //     editor.getData();
                    // }}
                    // onChange={validation.handleChange}
                    // onBlur={validation.handleBlur}
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
              </CardBody>
            </Card>
            {validation.touched.priority && validation.errors.priority ? (
              <FormFeedback type="invalid">
                {validation.errors.priority}
              </FormFeedback>
            ) : null}

            <div className="text-end mb-4">
              {/* <button type="submit" className="btn btn-danger w-sm me-1">Delete</button>
                                    <button type="submit" className="btn btn-secondary w-sm me-1">Draft</button>
                                    <button type="submit" className="btn btn-success w-sm">Update</button> */}
              {/* <Button
                                        type="button"
                                        onClick={() => {
                                            setModal(false);
                                        }}
                                        className="btn-light"
                                    >
                                        Close
                                    </Button> */}

              <button type="submit" className="btn btn-success" id="add-btn">
                Update Election
              </button>
            </div>
          </Col>
          <Col lg={3}>
            <Card>
              <CardHeader>
                <h5>Specifications</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <Label for="election-type" className="form-label">
                    Election Type
                  </Label>
                  <Input
                    name="type"
                    type="select"
                    className="form-select"
                    id="election-type-field"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.type || ""}
                  >
                    <option value="">- Select Election Type -</option>{" "}
                    {/* Placeholder option */}
                    {ElectionTypeOptions.map((option) => (
                      <option key={option.name} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </Input>

                  {validation.touched.option && validation.errors.option ? (
                    <FormFeedback type="invalid">
                      {validation.errors.option}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label for="election-type" className="form-label">
                    Election Result Type
                  </Label>
                  <Input
                    name="result"
                    type="select"
                    className="form-select"
                    id="result-field"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.result || ""}
                  >
                    <option value="">- Select Result Type -</option>{" "}
                    {/* Placeholder option */}
                    {ElectionResultOptions.map((option) => (
                      <option key={option.name} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </Input>

                  {validation.touched.option && validation.errors.option ? (
                    <FormFeedback type="invalid">
                      {validation.errors.option}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label htmlFor="seats-number-input" className="form-label">
                    Number of Seats
                  </Label>
                  <input
                    id="seats-number-input"
                    name="seats" // Add this
                    type="number"
                    className="form-control"
                    value={validation.values.seats || ""}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                </div>

                <div className="mb-3">
                  <Label htmlFor="seats-number-input" className="form-label">
                    Number of Votes
                  </Label>
                  <input
                    id="votes-number-input"
                    name="votes" // Add this
                    type="number"
                    className="form-control"
                    value={validation.values.votes || ""}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Attached files</h5>
              </CardHeader>
              <CardBody>
                <div>
                  <p className="text-muted">Add Attached files here.</p>

                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      handleAcceptedFiles(acceptedFiles);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div className="dropzone dz-clickable">
                        <div
                          className="dz-message needsclick"
                          {...getRootProps()}
                        >
                          <div className="mb-3">
                            <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                          </div>
                          <h4>Drop files here or click to upload.</h4>
                        </div>
                      </div>
                    )}
                  </Dropzone>

                  <ul className="list-unstyled mb-0" id="dropzone-preview">
                    {selectedFiles.map((f, i) => {
                      return (
                        <Card
                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                <img
                                  data-dz-thumbnail=""
                                  height="80"
                                  className="avatar-sm rounded bg-light"
                                  alt={f.name}
                                  src={f.preview}
                                />
                              </Col>
                              <Col>
                                <Link
                                  to="#"
                                  className="text-muted font-weight-bold"
                                >
                                  {f.name}
                                </Link>
                                <p className="mb-0">
                                  <strong>{f.formattedSize}</strong>
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      );
                    })}
                  </ul>
                </div>
              </CardBody>
              {/* <CardHeader>
                    <h5 className="card-title mb-0">Candidates</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="mb-3">
                      <Label
                        htmlFor="choices-lead-input"
                        className="form-label"
                      >
                        Candidates (counts)
                      </Label>

                      <Input
                        name="candidates"
                        type="select"
                        multiple
                        className="form-select"
                        id="candidates-field"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.candidates || []}
                      >
                        <option value="Sylvia Wright">Sylvia Wright</option>
                        <option value="Ellen Smith">Ellen Smith</option>
                        <option value="Jeffrey Salazar">Jeffrey Salazar</option>
                        <option value="Mark Williams">Mark Williams</option>
                      </Input>
                      {validation.touched.candidates &&
                      validation.errors.candidates ? (
                        <FormFeedback type="invalid">
                          {validation.errors.candidates}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label
                        htmlFor="choices-lead-input"
                        className="form-label"
                      >
                        Committees (counts)
                      </Label>

                      <Input
                        name="Committees"
                        type="select"
                        multiple
                        className="form-select"
                        id="committees-field"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.committees || []}
                      >
                        <option value="Sylvia Wright">Sylvia Wright</option>
                        <option value="Ellen Smith">Ellen Smith</option>
                        <option value="Jeffrey Salazar">Jeffrey Salazar</option>
                        <option value="Mark Williams">Mark Williams</option>
                      </Input>
                      {validation.touched.committees &&
                      validation.errors.committees ? (
                        <FormFeedback type="invalid">
                          {validation.errors.committees}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div>
                      <Label className="form-label">Moderators</Label>
                      <div className="avatar-group">
                        <Link
                          to="#"
                          className="avatar-group-item"
                          data-bs-toggle="tooltip"
                          data-bs-trigger="hover"
                          data-bs-placement="top"
                          title="Brent Gonzalez"
                        >
                          <div className="avatar-xs">
                            <img
                              src={avatar3}
                              alt=""
                              className="rounded-circle img-fluid"
                            />
                          </div>
                        </Link>
                        <Link
                          to="#"
                          className="avatar-group-item"
                          data-bs-toggle="tooltip"
                          data-bs-trigger="hover"
                          data-bs-placement="top"
                          title="Sylvia Wright"
                        >
                          <div className="avatar-xs">
                            <div className="avatar-title rounded-circle bg-secondary">
                              S
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="#"
                          className="avatar-group-item"
                          data-bs-toggle="tooltip"
                          data-bs-trigger="hover"
                          data-bs-placement="top"
                          title="Ellen Smith"
                        >
                          <div className="avatar-xs">
                            <img
                              src={avatar4}
                              alt=""
                              className="rounded-circle img-fluid"
                            />
                          </div>
                        </Link>
                        <Link
                          to="#"
                          className="avatar-group-item"
                          data-bs-toggle="tooltip"
                          data-bs-trigger="hover"
                          data-bs-placement="top"
                          title="Add Members"
                        >
                          <div
                            className="avatar-xs"
                            data-bs-toggle="modal"
                            data-bs-target="#inviteMembersModal"
                          >
                            <div className="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary">
                              +
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </CardBody> */}
            </Card>
            {validation.touched.priority && validation.errors.priority ? (
              <FormFeedback type="invalid">
                {validation.errors.priority}
              </FormFeedback>
            ) : null}

            <div className="text-end mb-4">
              {/* <button type="submit" className="btn btn-danger w-sm me-1">Delete</button>
                                    <button type="submit" className="btn btn-secondary w-sm me-1">Draft</button>
                                    <button type="submit" className="btn btn-success w-sm">Update</button> */}
              {/* <Button
                                        type="button"
                                        onClick={() => {
                                            setModal(false);
                                        }}
                                        className="btn-light"
                                    >
                                        Close
                                    </Button> */}

              <button type="submit" className="btn btn-success" id="add-btn">
                Update Election
              </button>
            </div>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default EditTab;

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useParams } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getElectionDetails, getModeratorUsers, getCategories, updateElection } from "../../../store/actions";
import useCategoryManager from "../../../Components/Hooks/CategoryHooks";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Input, Label, Row, FormFeedback, Form } from "reactstrap";

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import Select from "react-select";

import Dropzone from "react-dropzone";

import { StatusOptions, PriorityOptions, RankOptions, ElectionTypeOptions, ElectionResultOptions, TagOptions } from "../../../Components/constants";

const EditTab = ({ election }) => {
  const dispatch = useDispatch();


  const { electionDetails, categories, subCategories } = useSelector((state) => ({
    electionDetails: state.Elections.electionDetails,
    categories: state.Categories.categories,
    subCategories: state.Categories.subCategories,
  }));



  // Election Categories
  useEffect(() => {
    if (categories && !categories.length) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);

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

      status: (election && election.status) || "New",
      priority: (election && election.priority) || "High",

      // Election Specification
      type: (election && election.type) || "",
      result: (election && election.result) || "",
      votes: (election && election.votes) || 0,
      seats: (election && election.seats) || 0,
      electors: (election && election.electors) || 0,
      electorsMales: (election && election.electorsMales) || 0,
      electorsFemales: (election && election.electorsFemales) || 0,

      attendees: (election && election.attendees) || 0,
      attendeesMales: (election && election.attendeesMales) || 0,
      attendeesFemales: (election && election.attendeesFemales) || 0,

      // System
      delet: (election && election.delet) || "",
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
        electors: values.electors,
        electorsMales: values.electorsMales,
        electorsFemales: values.electorsFemales,

        attendees: values.attendees,
        attendeesMales: values.attendeesMales,
        attendeesFemales: values.attendeesFemales,

        // Admin
        status: values.status,
        priority: values.priority,
      };
      dispatch(
        updateElection({ election: updatedElection, formData: formData })
      );
    },
  });

  // Categories ---------------
  const {
    categoryOptions,
    subCategoryOptions,
    changeSubCategoriesOptions,
    activeParentCategoryId
  } = useCategoryManager(categories, subCategories, validation);

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

          <Col lg={4}>
            <Card>
              <CardHeader>
                <h5>Details</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={12}>
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
                  <Col lg={12}>
                    <div className="mb-3">
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
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label for="category-field" className="form-label">
                        Election Category
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
                        value={validation.values.category || ""}
                      >
                        <option value="">Choose Category</option>
                        {categoryOptions.map((category) => (
                          <option key={category.id} value={parseInt(category.id)}>
                            {category.name}
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
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label for="sub-category-field" className="form-label">
                        Election Sub-Category
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
                  {/* <Col lg={4}>
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
                  </Col> */}
                </Row>
                <Row>
                  <div className="mb-3">
                    <Label className="form-label">Election Description</Label>
                    <Input
                      name="description"
                      id="description-field"
                      className="form-control"
                      type="textarea"
                      placeholder="Election Description"
                      validate={{
                        required: { value: true },
                      }}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.description || ""}
                      invalid={
                        validation.touched.description && validation.errors.description
                          ? true
                          : false
                      }
                    />
                    {validation.touched.description && validation.errors.description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.description}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Row>
              </CardBody>
            </Card>
            {validation.touched.priority && validation.errors.priority ? (
              <FormFeedback type="invalid">
                {validation.errors.priority}
              </FormFeedback>
            ) : null}

            <div className="text-end mb-4">
              <button type="submit" className="btn btn-success" id="add-btn">
                Update Election
              </button>
            </div>
          </Col>
          <Col lg={4}>
            <Card>
              <CardHeader>
                <h5>وصف الإنتخابات</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label for="election-type" className="form-label">
                        نوع الإنتخابات
                      </Label>
                      <Input
                        name="type"
                        type="select"
                        className="form-select"
                        id="election-type-field"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      // value={validation.values.type || ""}
                      >
                        <option value="">- إختر نوع الإنتخابات -</option>{" "}
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
                  </Col>
                  <Col lg={6}>

                    <div className="mb-3">
                      <Label for="election-type" className="form-label">
                        عرض النتائج
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
                        <option value="">- إختر عرض النتائج -</option>{" "}
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
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="seats-number-input" className="form-label">
                        عدد المقاعد للفائزين
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
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="seats-number-input" className="form-label">
                        عدد الأصوات للناخبين
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
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5>الناخبين</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="electors-input" className="form-label">
                        عدد الناخبين
                      </Label>
                      <input
                        id="electors-input"
                        name="electors" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.electors || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="electorsMales-input" className="form-label">
                        عدد الناخبين الرجال
                      </Label>
                      <input
                        id="electors-input"
                        name="electorsMales" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.electorsMales || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="electorsFemales-input" className="form-label">
                        عدد الناخبين النساء
                      </Label>
                      <input
                        id="electorsFemales-input"
                        name="electorsFemales" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.electorsFemales || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5>الحضور</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="attendees-input" className="form-label">
                        عدد الحضور
                      </Label>
                      <input
                        id="attendees-input"
                        name="attendees" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.attendees || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="attendeesMales-input" className="form-label">
                        حضور الرجال
                      </Label>
                      <input
                        id="attendeesMales-input"
                        name="attendeesMales" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.attendeesMales || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="attendeesFemales-input" className="form-label">
                        حضور النساء
                      </Label>
                      <input
                        id="attendeesFemales-input"
                        name="attendeesFemales" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.attendeesFemales || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <div className="card">
              <CardHeader>
                <h5>ِAdmin</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
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

                <div className="mb-3">
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
                <div className="mb-3">
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
            </div>
          </Col>
        </Row>
      </Form >
    </React.Fragment >
  );
};

export default EditTab;

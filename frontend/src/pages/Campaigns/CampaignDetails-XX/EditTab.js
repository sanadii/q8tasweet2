import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useParams } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getElectionDetails, updateElection } from "../../../store/actions";

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
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  StatusOptions,
  PriorityOptions,
  TagOptions,
} from "../../../common/data/elections";

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Dropzone from "react-dropzone";

//Import Images
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";

const EditTab = ({ election }) => {
  // const { id } = useParams(); // Access the id parameter from the URL
  const dispatch = useDispatch();
  // const [election, setElection] = useState({});
  // console.log("THE ELECTIONS IS:", election);
  // useEffect(() => {
  //   dispatch(getElectionDetails({ id: id })); // Dispatch the action with the 'id' parameter
  // }, [dispatch, id]);

  // const { electionDetails } = useSelector((state) => ({
  //   electionDetails: state.Elections.electionDetails,
  // }));

  // useEffect(() => {
  //   if (!isEmpty(electionDetails)) {
  //     setElection({
  //       id: electionDetails.id,
  //       title: electionDetails.title,
  //       image: electionDetails.image
  //         ? "http://q8tasweet.com/" + electionDetails.image
  //         : "",
  //       duedate: electionDetails.duedate,
  //       canidates: electionDetails.canidates,
  //       description: electionDetails.description,
  //       category: electionDetails.category,
  //       sub_category: electionDetails.sub_category,
  //       status: electionDetails.status,
  //       priority: electionDetails.priority,
  //     });
  //   }
  // }, [electionDetails]);

  //   Image Upload
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      console.log("handleImageSelect called");
    }
  };

  const formData = new FormData();

  if (!selectedImage) {
    console.log("no selected image");
  } else {
    formData.append("image", selectedImage);
    formData.append("folder", "elections"); // replace "yourFolderName" with the actual folder name
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: (election && election.title) || "",
      // image: (election && election.image) || "",
      image: election.image
        ? "http://q8tasweet.com/" + election.image
        : "",

      selectedImage: selectedImage,

      description: (election && election.description) || "",
      duedate: (election && election.duedate) || "",
      category: (election && election.category) || " ??? ",
      sub_category: (election && election.sub_category) || " ??? ",

      tags: (election && election.tags) || [],

      candidates: (election && election.candidates) || [],
      committees: (election && election.committees) || [],
      moderators: (election && election.moderators) || [],

      status: (election && election.status) || "New",
      priority: (election && election.priority) || "High",

      del_flag: (election && election.del_flag) || "",
      created_by: (election && election.created_by) || "",
      created_date: (election && election.created_date) || "",
      updated_by: (election && election.updated_by) || "",
      updated_date: (election && election.updated_date) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Title Name"),
    }),
    onSubmit: (values) => {
      const updatedElection = {
        id: election ? election.id : 0,
        title: values.title,
        image: values.image,
        selectedImage: selectedImage,

        duedate: duedate,
        description: values.description,

        category: values.category,
        sub_category: values.sub_category,
        tags: Array.isArray(values.tags) ? values.tags : [],

        candidates: Array.isArray(values.candidates) ? values.candidates : [],
        committees: Array.isArray(values.committees) ? values.committees : [],
        moderators: Array.isArray(values.moderators) ? values.moderators : [],

        status: values.status,
        priority: values.priority,

        created_by: values.created_by,
        created_date: values.created_date,

        updated_by: values.updated_by,
        updated_date: values.updated_date,
      };
      dispatch(
        updateElection({ election: updatedElection, formData: formData })
      );
    },
  });

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
  const [duedate, setDate] = useState(defaultdate());

  const dateformate = (e) => {
    const selectedDate = new Date(e);
    const formattedDate = `${selectedDate.getFullYear()}-${(
      "0" +
      (selectedDate.getMonth() + 1)
    ).slice(-2)}-${("0" + selectedDate.getDate()).slice(-2)}`;
    setDate(formattedDate);
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
          <Col lg={8}>
            <Card>
              <CardBody>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="election-title-input">
                    Election Title / {election.title}
                  </Label>
                  <Input
                    name="title"
                    id="titleName-field"
                    className="form-control"
                    placeholder="Title name"
                    type="text"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.title || ""}
                    invalid={
                      validation.touched.title && validation.errors.title
                        ? true
                        : false
                    }
                  />
                  {validation.touched.title && validation.errors.title ? (
                    <FormFeedback type="invalid">
                      {validation.errors.title}
                    </FormFeedback>
                  ) : null}
                </div>

                <Row>
                  <Col lg={6}>
                    <div>
                      <Label
                        htmlFor="choices-categories-input"
                        className="form-label"
                      >
                        Categories
                      </Label>
                      <Input
                        name="category"
                        type="select"
                        className="form-select"
                        id="category-field"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.category || ""}
                      >
                        <option defaultValue="">Category</option>
                        <option value="Ommah Assembly">Ommah Assembly</option>
                        <option value="Clubs">Clubs</option>
                        <option value="Cooperations">Cooperations</option>
                        <option value="Association">Association</option>
                        <option value="Others">Others</option>
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
                        htmlFor="choices-sub-category-input"
                        className="form-label"
                      >
                        Sub-Category
                      </Label>
                      <Input
                        name="sub-category"
                        type="select"
                        className="form-select"
                        id="sub-category-field"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.category || ""}
                      >
                        <option defaultValue="">Sub-Category</option>
                        <option value="Ommah Assembly">Ommah Assembly</option>
                        <option value="Clubs">Clubs</option>
                        <option value="Cooperations">Cooperations</option>
                        <option value="Association">Association</option>
                        <option value="Others">Others</option>
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
                        htmlFor="datepicker-deadline-input"
                        className="form-label"
                      >
                        Date
                      </Label>
                      <Flatpickr
                        name="duedate"
                        id="duedate-field"
                        className="form-control"
                        placeholder="Select a duedate"
                        options={{
                          altInput: true,
                          altFormat: "Y-m-d",
                          dateFormat: "Y-m-d",
                        }}
                        onChange={(e) => dateformate(e)}
                        value={validation.values.duedate || ""}
                      />
                      {validation.touched.duedate &&
                      validation.errors.duedate ? (
                        <FormFeedback type="invalid">
                          {validation.errors.duedate}
                        </FormFeedback>
                      ) : null}
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

          <Col lg={4}>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Admin</h5>
              </div>
              <CardBody>
                <Row>
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
                </Row>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3 mb-lg-0">
                      <Label
                        htmlFor="choices-priority-input"
                        className="form-label"
                      >
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
                        <option value="">Priority</option>
                        {PriorityOptions.map((priority) => (
                          <option key={priority.id} value={priority.name}>
                            {priority.name}
                          </option>
                        ))}
                      </Input>
                      {validation.touched.priority &&
                      validation.errors.priority ? (
                        <FormFeedback type="invalid">
                          {validation.errors.priority}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3 mb-lg-0">
                      <Label
                        htmlFor="choices-status-input"
                        className="form-label"
                      >
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
                        <option value="">Status</option>
                        {StatusOptions.map((status) => (
                          <option key={status.id} value={status.name}>
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
                  </Col>
                </Row>
                <Row>
                  <div>
                    <Label htmlFor="choices-text-input" className="form-label">
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
                </Row>
              </CardBody>
            </div>

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
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default EditTab;

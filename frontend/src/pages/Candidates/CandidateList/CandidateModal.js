// React & Redux
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addNewCandidate, updateCandidate } from "../../../store/actions";

// Custom Components & ConstantsImports
import { GenderOptions, PriorityOptions, StatusOptions } from "../../../Components/constants";
import SimpleBar from "simplebar-react";

// Form and Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import { Card, CardBody, Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";


const CandidateModal = ({ isEdit, setModal, modal, toggle, candidate }) => {
  const dispatch = useDispatch();

  // State Management
  const moderators = useSelector((state) => state.Users.moderators);

  // Image Upload Helper
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const formData = new FormData();
  if (!selectedImage) {
    // console.log("no selected image");
  } else {
    formData.append("image", selectedImage);
    formData.append("folder", "candidates"); // replace "yourFolderName" with the actual folder name
  }

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      name: (candidate && candidate.name) || "",
      image: (candidate && candidate.image) || "",
      selectedImage: selectedImage,
      gender: (candidate && candidate.gender) || 0,
      phone: (candidate && candidate.phone) || "",
      email: (candidate && candidate.email) || "",
      twitter: (candidate && candidate.twitter) || "",
      instagram: (candidate && candidate.instagram) || "",
      description: (candidate && candidate.description) || "",

      // Candidate Specification

      // Admin
      status: (candidate && candidate.status) || 0,
      priority: (candidate && candidate.priority) || 1,
      moderators:
        candidate && Array.isArray(candidate.moderators)
          ? candidate.moderators.map((moderator) => moderator.id)
          : [],

    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Candidate Name"),
      status: Yup.number().integer().required('Status is required'),
      priority: Yup.number().integer().required('priority is required'),


    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedCandidate = {
          id: candidate ? candidate.id : 0,
          name: values.name,
          gender: parseInt(values.gender, 10),
          image: values.image,
          selectedImage: selectedImage,
          description: values.description,


          // Contact
          phone: values.phone,
          email: values.email,
          twitter: values.twitter,
          instagram: values.instagram,

          // Admin
          status: parseInt(values.status, 10),
          priority: parseInt(values.priority, 10),
          moderators: values.moderators,
        };

        // Update candidate
        dispatch(
          updateCandidate({ candidate: updatedCandidate, formData: formData })
        );
      } else {
        const newCandidate = {
          name: values.name,
          gender: values.gender,
          image: values.image,
          selectedImage: selectedImage,
          description: values.description,

          // Contact
          phone: values.phone,
          email: values.email,
          twitter: values.twitter,
          instagram: values.instagram,

          // Admin
          status: parseInt(values.status, 10),
          priority: parseInt(values.priority, 10),
          moderators: values.moderators,
        };
        dispatch(addNewCandidate({ candidate: newCandidate, formData: formData }));
      }

      validation.resetForm();
      toggle();
    },
  });

  return (
    <Modal
      isOpen={modal}
      // toggle={toggle}
      centered
      size="lg"
      className="border-0"
      modalClassName="modal fade zoomIn"
    >
      <ModalHeader className="p-3 bg-soft-info" toggle={toggle}>
        {!!isEdit ? "Edit Candidate" : "Create Candidate"}
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
                  Candidate Name
                </Label>
                <Input
                  id="name-field"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Candidate Name"
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
                <Label for="gender-field" className="form-label">
                  Gender
                </Label>
                <Input
                  name="gender"
                  type="select"
                  className="form-select"
                  id="gender-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.gender || 0}
                >
                  <option key={0} value={0}>
                    - اختر النوع -
                  </option>
                  {GenderOptions.map((gender) => (
                    <option key={gender.id} value={gender.id}>
                      {gender.name}
                    </option>
                  ))}
                </Input>
                {validation.touched.gender && validation.errors.gender ? (
                  <FormFeedback type="invalid">
                    {validation.errors.gender}
                  </FormFeedback>
                ) : null}
              </div>

              <div>
                <Label for="description-field" className="form-label">
                  Description
                </Label>
                <Input
                  id="description-field"
                  name="description"
                  type="textarea"
                  className="form-control"
                  placeholder="Candidate Name"
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
              {!!isEdit ? "Update Candidate" : "Add Candidate"}
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CandidateModal;

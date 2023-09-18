// ------------ React & Redux ------------
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// ------------ Import Actions ------------
import { addElection, updateElection, getCategories } from "../../../store/actions";
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import { Card, CardBody, Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

// ------------ Custom Components & ConstantsImports ------------
import { ElectionResultOptions, ElectionTypeOptions, PriorityOptions, StatusOptions } from "../../../Components/constants";
import useCategoryManager from "../../../Components/Hooks/CategoryHooks";

import Flatpickr from "react-flatpickr";
import SimpleBar from "simplebar-react";

const ElectionModal = ({ isEdit, setModal, modal, toggle, election }) => {
  const dispatch = useDispatch();

  // ------------ State Management ------------
  const { moderators, categories, subCategories } = useSelector((state) => ({
    // userId: state.Users.currentUser.id,
    moderators: state.Users.moderators,
    categories: state.Categories.categories,
    subCategories: state.Categories.subCategories,
  }));

  // ------------ Image Upload Helper ------------
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
      name: (election && election.name) || "",
      image: (election && election.image) || "",
      selectedImage: selectedImage,
      description: (election && election.description) || "",
      dueDate: (election && election.dueDate) || null,
      category: (election && election.category) || null,
      subCategory: (election && election.subCategory) || null,
      tags: (election && election.tags) || [],

      // Election Specification
      type: (election && election.type) || "",
      result: (election && election.result) || "",
      votes: (election && election.votes) || 0,
      seats: (election && election.seats) || 0,
      electors: (election && election.electors) || 0,
      attendees: (election && election.attendees) || 0,

      // Admin
      status: (election && election.status) || 0,
      priority: (election && election.priority) || 1,
      moderators:
        election && Array.isArray(election.moderators)
          ? election.moderators.map((moderator) => moderator.id)
          : [],

    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Election Name"),
      category: Yup.number().integer().nullable().notRequired('Category is required'),
      subCategory: Yup.number().integer().nullable().notRequired('Sub-Category is required'),
      status: Yup.number().integer().required('Status is required'),
      priority: Yup.number().integer().required('priority is required'),


    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedElection = {
          id: election ? election.id : 0,
          name: values.name,
          image: values.image,
          selectedImage: selectedImage,
          dueDate: values.dueDate,
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
          attendees: values.attendees,

          // Admin
          status: parseInt(values.status, 10),
          priority: parseInt(values.priority, 10),
          moderators: values.moderators,
        };

        // Update election
        dispatch(
          updateElection({ election: updatedElection, formData: formData })
        );
      } else {
        const newElection = {
          name: values.name,
          image: values.image,
          selectedImage: selectedImage,
          dueDate: values.dueDate,
          description: values.description,

          // Taxonomies
          category: parseInt(values.category, 10),
          subCategory: parseInt(values.subCategory, 10),
          tags: Array.isArray(values.tags) ? values.tags : [],

          // Election Spesifications
          type: values.type,
          result: values.result,
          votes: values.votes,
          seats: values.seats,

          // Admin
          status: parseInt(values.status, 10),
          priority: parseInt(values.priority, 10),
          moderators: values.moderators,
        };
        dispatch(addElection({ election: newElection, formData: formData }));
      }

      validation.resetForm();
      toggle();
    },
  });

  const {
    categoryOptions,
    subCategoryOptions,
    changeSubCategoriesOptions,
    activeParentCategoryId
  } = useCategoryManager(categories, subCategories, validation);

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
    <Modal
      isOpen={modal}
      // toggle={toggle}
      centered
      size="lg"
      className="border-0"
      modalClassName="modal fade zoomIn"
    >
      <ModalHeader className="p-3 bg-soft-info" toggle={toggle}>
        {!!isEdit ? "Edit Election" : "Create Election"}
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
                  Election Name
                </Label>
                <Input
                  id="name-field"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Election Name"
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
                {validation.touched.category && validation.errors.category ? (
                  <FormFeedback type="invalid">
                    {validation.errors.category}
                  </FormFeedback>
                ) : null}
              </div>
              <div>
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
              <Label for="election-type-field" className="form-label">
                Election Type
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
              <Label for="election-result-field" className="form-label">
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
              <Label for="election-votes-field" className="form-label">
                Number of Votes
              </Label>
              <Input
                id="votes-field"
                name="votes"
                type="number"
                value={validation.values.votes || ""}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              ></Input>
              {validation.touched.votes && validation.errors.votes ? (
                <FormFeedback votes="invalid">
                  {validation.errors.votes}
                </FormFeedback>
              ) : null}
            </Col>
            <Col lg={6}>
              <Label for="election-seats-field" className="form-label">
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
              ></Input>
              {validation.touched.seats && validation.errors.seats ? (
                <FormFeedback seats="invalid">
                  {validation.errors.seats}
                </FormFeedback>
              ) : null}
            </Col>
            <Col lg={6}>
              <Label for="electors-field" className="form-label">
                Number of Electors
              </Label>
              <Input
                id="electors-field"
                name="electors"
                type="number"
                className="form-control"
                placeholder="0"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.electors || ""}
              ></Input>
              {validation.touched.electors && validation.errors.seats ? (
                <FormFeedback electors="invalid">
                  {validation.errors.electors}
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
              ></Input>
              {validation.touched.attendees && validation.errors.attendees ? (
                <FormFeedback attendees="invalid">
                  {validation.errors.attendees}
                </FormFeedback>
              ) : null}
            </Col>
            <hr />


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
                              {moderator.first_name}
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
              {!!isEdit ? "Update Election" : "Add Election"}
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ElectionModal;

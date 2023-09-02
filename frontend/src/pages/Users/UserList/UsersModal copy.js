// ------------ React & Redux ------------
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// ------------ Import Actions ------------
import { addNewUser, updateUser } from "../../../store/actions";
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import {
  Col,
  Row,
  Label,
  Input,
  Form,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";

// ------------ Custom Components & ConstantsImports ------------
import { PriorityOptions, StatusOptions } from "../../../Components/constants";
import Flatpickr from "react-flatpickr";
import SimpleBar from "simplebar-react";

const UserModal = ({ isEdit, setModal, modal, toggle, user }) => {
  const dispatch = useDispatch();

  // ------------ State Management ------------
  const { moderators } = useSelector((state) => ({
    // userId: state.Users.currentUser.id,
    moderators: state.Users.moderators,
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
    formData.append("folder", "users"); // replace "yourFolderName" with the actual folder name
  }

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      name: (user && user.name) || "",
      email: (user && user.email) || "",
      password: (user && user.password) || "",
      username: (user && user.username) || "",
      firstName: (user && user.firstName) || "",
      lastName: (user && user.lastName) || "",
      image: (user && user.image) || "",
      selectedImage: selectedImage,
      // background: (user && user.background) || "",
      civil: (user && user.civil) || "", // New field
      gender: (user && user.gender) || "",
      dateOfBirth: (user && user.dateOfBirth) || "",
      description: (user && user.description) || "",

      mobile: (user && user.mobile) || "",
      twitter: (user && user.twitter) || "",
      instagram: (user && user.instagram) || "",

      // User Permissions
      isStaff: (user && user.isStaff) || false, // New field
      isActive: (user && user.isActive) || false, // New field
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter User Name"),
      status: Yup.number().integer().required("Status is required"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedUser = {
          id: user ? user.id : 0,
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          image: values.image,
          selectedImage: selectedImage,
          // background: values.background,

          description: values.description,
          civil: values.civil,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth,

          // Contact
          mobile: values.mobile,
          email: values.email,
          twitter: values.twitter,
          instagram: values.instagram,

          // Admin
          isStaff: values.isStaff,
          isActive: values.isActive,
          CreatedDate: values.CreatedDate,
        };

        // Update user
        dispatch(updateUser({ user: updatedUser, formData: formData }));
      } else {
        const newUser = {
          name: values.name,
          gender: values.gender,
          image: values.image,
          selectedImage: selectedImage,
          description: values.description,

          // Contact
          mobile: values.mobile,
          email: values.email,
          twitter: values.twitter,
          instagram: values.instagram,

          // Admin
          status: parseInt(values.status, 10),
        };
        dispatch(addNewUser({ user: newUser, formData: formData }));
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
      size="xs"
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
                <Label for="firstName-field" className="form-label">
                  First Name
                </Label>
                <Input
                  id="firstName-field"
                  name="firstName"
                  type="text"
                  className="form-control"
                  placeholder="firstName"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.firstName || ""}
                  invalid={
                    validation.touched.firstName && validation.errors.firstName
                      ? true
                      : false
                  }
                />
                {validation.touched.firstName && validation.errors.firstName ? (
                  <FormFeedback type="invalid">
                    {validation.errors.firstName}
                  </FormFeedback>
                ) : null}
              </div>
              <div>
                <Label for="lastName-field" className="form-label">
                  Last Name
                </Label>
                <Input
                  id="lastName-field"
                  name="lastName"
                  type="text"
                  className="form-control"
                  placeholder="lastName"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.lastName || ""}
                  invalid={
                    validation.touched.lastName && validation.errors.lastName
                      ? true
                      : false
                  }
                />
                {validation.touched.lastName && validation.errors.lastName ? (
                  <FormFeedback type="invalid">
                    {validation.errors.firslastNametName}
                  </FormFeedback>
                ) : null}
              </div>
              <div>
                <Label for="gender-field" className="form-label">
                  Gender
                </Label>
                <Input
                  id="gender-field"
                  name="gender"
                  type="text"
                  className="form-control"
                  placeholder="gender"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.gender || ""}
                  invalid={
                    validation.touched.gender && validation.errors.gender
                      ? true
                      : false
                  }
                />
                {validation.touched.gender && validation.errors.gender ? (
                  <FormFeedback type="invalid">
                    {validation.errors.gender}
                  </FormFeedback>
                ) : null}
              </div>
              <div>
                <Label for="civil-field" className="form-label">
                  Civil ID
                </Label>
                <Input
                  id="civil-field"
                  name="civil"
                  type="text"
                  className="form-control"
                  placeholder="civil"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.civil || ""}
                  invalid={
                    validation.touched.civil && validation.errors.civil
                      ? true
                      : false
                  }
                />
                {validation.touched.civil && validation.errors.civil ? (
                  <FormFeedback type="invalid">
                    {validation.errors.civil}
                  </FormFeedback>
                ) : null}
              </div>
              <div>
                <Label for="mobile-field" className="form-label">
                  Mobile
                </Label>
                <Input
                  id="mobile-field"
                  name="mobile"
                  type="text"
                  className="form-control"
                  placeholder="mobile"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.mobile || ""}
                  invalid={
                    validation.touched.mobile && validation.errors.mobile
                      ? true
                      : false
                  }
                />
                {validation.touched.mobile && validation.errors.mobile ? (
                  <FormFeedback type="invalid">
                    {validation.errors.mobile}
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
                  placeholder="User Name"
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

            {/* <p>Admin Use</p> */}
            {/* <Col lg={6}>
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
            </Col> */}
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
  );
};

export default UserModal;

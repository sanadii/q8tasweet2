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
  ModalFooter,
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
      firstName: Yup.string().required("Please Enter First Name"),
      username: Yup.string().required("Please Enter User Name"),
      password: Yup.string().required("Please Enter Password"),
      passwordConfirm: Yup.string()
        .required("Please Confirm Password")
        .oneOf([Yup.ref("password"), null], "Passwords must match"), // Check if password matches
      email: Yup.string().required("Please Enter Email"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("gender", values.gender);
      formData.append("image", values.image);
      // ... append other form data fields

      if (isEdit) {
        const updatedUser = {
          username: values.username,
          password: values.password,
          passwordConfirm: values.passwordConfirm,

          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          image: values.image,
          selectedImage: selectedImage,
          // background: values.background,

          description: values.description,
          civil: values.civil,
          dateOfBirth: values.dateOfBirth,

          // Contact
          mobile: values.mobile,
          email: values.email,
          twitter: values.twitter,
          instagram: values.instagram,

          // Admin
          isStaff: parseInt(values.status, 10),
          isActive: parseInt(values.status, 10),
        };

        // Update user
        dispatch(updateUser({ user: updatedUser, formData: formData }));
      } else {
        const newUser = {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          image: values.image,
          selectedImage: selectedImage,
          // background: values.background,

          description: values.description,
          civil: values.civil,
          dateOfBirth: values.dateOfBirth,

          // Contact
          mobile: values.mobile,
          email: values.email,
          twitter: values.twitter,
          instagram: values.instagram,

          // Admin
          isStaff: parseInt(values.status, 10),
          isActive: parseInt(values.status, 10),
        };
        dispatch(addNewUser({ user: newUser, formData: formData }));
      }

      validation.resetForm();
      toggle();
    },
  });


  const fields = [
    {
      id: "email-field",
      label: "Email",
      type: "text",
      name: "email",
    },
    {
      id: "username-field",
      label: "Username",
      type: "text",
      name: "username",
    },
    {
      id: "password-field",
      label: "Password",
      type: "password",
      name: "password",
    },
    {
      id: "passwordConfirm-field",
      label: "Confirm Password",
      type: "password",
      name: "passwordConfirm",
    },
    {
      id: "firstName-field",
      label: "First Name",
      type: "text",
      name: "firstName",
    },
    {
      id: "lastName-field",
      label: "Last Name",
      type: "text",
      name: "lastName",
    },
    {
      id: "gender-field",
      label: "Gender",
      type: "select",
      options: [
        { id: 1, name: "Male" },
        { id: 2, name: "Female" },
      ],
      name: "gender",
    },
    {
      id: "dateOfBirth-field",
      label: "Date of Birth",
      type: "date",
      name: "dateOfBirth",
    },
    {
      id: "mobile-field",
      label: "Mobile",
      type: "text",
      name: "mobile",
    },

    {
      id: "twitter-field",
      label: "Twitter",
      type: "text",
      name: "twitter",
    },
    {
      id: "instagram-field",
      label: "Instagram",
      type: "text",
      name: "instagram",
    },
    {
      id: "isStaff-field",
      label: "Is Staff",
      type: "select",
      options: [
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ],
      name: "isStaff",
    },
    {
      id: "isActive-field",
      label: "Is Active",
      type: "select",
      options: [
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ],
      name: "isActive",
    },
  ];

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
        {!!isEdit ? "Edit User" : "Create User"}
      </ModalHeader>
      <Form
        className="tablelist-form"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
        encType="multipart/form-data" // Add this attribute
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
            {fields.map((field) => (
              <Col lg={6} key={field.id}>
                <div>
                  <Label htmlFor={field.id} className="form-label">
                    {field.label}
                  </Label>
                  {field.type === "select" ? (
                    <Input
                      id={field.id}
                      name={field.name}
                      type={field.type}
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values[field.name] || ""}
                    >
                      {field.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </Input>
                  ) : (
                    <Input
                      id={field.id}
                      name={field.name}
                      type={field.type}
                      className="form-control"
                      placeholder={`Please Enter Your ${field.label}`}
                      validate={{
                        required: { value: true },
                      }}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values[field.name] || ""}
                      invalid={
                        validation.touched[field.name] &&
                        validation.errors[field.name]
                          ? true
                          : false
                      }
                    />
                  )}
                  {validation.touched[field.name] &&
                  validation.errors[field.name] ? (
                    <FormFeedback type="invalid">
                      {validation.errors[field.name]}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            ))}
          </Row>
        </ModalBody>
        <ModalFooter>
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
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UserModal;

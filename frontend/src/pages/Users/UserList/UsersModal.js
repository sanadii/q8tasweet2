// React & Redux
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Import Actions
import { addNewUser, updateUser } from "store/actions";


import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";
import { GenderOptions } from "Common/Constants"
import { FieldComponent } from "Common/Components";

import { Col, Row, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const UserModal = ({ isEdit, setModal, modal, toggle, user }) => {
  const dispatch = useDispatch();

  // State Management
  const { moderators } = useSelector((state) => ({
    // userId: state.Users.currentUser.id,
    moderators: state.Users.moderators,
  }));

  // Image Upload Helper
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
      id: (user && user.id) || 0,
      email: (user && user.email) || "",
      username: (user && user.username) || "",
      firstName: (user && user.firstName) || "",
      lastName: (user && user.lastName) || "",
      image: (user && user.image) || "",
      selectedImage: selectedImage,

      phone: (user && user.phone) || "",
      password: (user && user.phone) || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter First Name"),
      email: Yup.string().required("Please Enter Email"),
    }),
    onSubmit: (values) => {

      if (isEdit) {
        const updatedUser = {
          id: user ? user.id : 0,
          username: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          email: values.email,
          password: values.phone,

        };

        // Update user
        dispatch(updateUser(updatedUser));
      } else {
        const newUser = {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          email: values.email,
          username: values.email,
          password: values.phone,
        };
        dispatch(addNewUser(newUser));
      }

      validation.resetForm();
      toggle();
    },
  });

  const fields = [
    {
      id: "first-name-field",
      name: "firstName",
      label: "الاسم الأول",
      type: "text",
      placeholder: "ادخل الاسم الأول",
      colSize: "6",
    },
    {
      id: "last-name-field",
      name: "lastName",
      label: "اسم العائلة",
      type: "text",
      placeholder: "ادخل اسم العائلة",
      colSize: "6",
    },
    {
      id: "email-field",
      name: "email",
      label: "البريد الالكتروني",
      type: "email",
      placeholder: "ادخل البريد الالكتروني",
      colSize: "6",
    },
    {
      id: "phone-field",
      name: "phone",
      label: "الهاتف",
      type: "tel",
      placeholder: "ادخل رقم الهاتف",
      colSize: "6",
    },
  ];


  return (
    <Modal
      isOpen={modal}
      // toggle={toggle}
      centered
      size="md"
      className="border-0"
      modalClassName="modal fade zoomIn"
    >
      <ModalHeader className="p-3 bg-soft-info" toggle={toggle}>
        {!!isEdit ? "تحديث بيانات المستخدم" : "إضافة مستخدم"}
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
          <Row>
            {fields.map(field => (
              <FieldComponent
                key={field.id}
                field={field}
                validation={validation}
              />
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
                أغلق
              </Button>
              <button type="submit" className="btn btn-success" id="add-btn">
                {!!isEdit ? "تحديث" : "إضافة"}
              </button>
            </div>
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UserModal;

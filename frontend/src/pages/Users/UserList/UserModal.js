<<<<<<< HEAD
// React & Redux
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Import Actions
import { addNewUser, updateUser } from "store/actions";
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";
import { GenderOptions } from "shared/constants"
import { FieldComponent } from "shared/components";
import { Col, Row, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const UserModal = ({ isEdit, setModal, modal, toggle, user }) => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
=======
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addUser, updateUser } from "store/actions";
import "react-toastify/dist/ReactToastify.css";
import { Col, Row, Form, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormFields } from "shared/components";
import DualListBox from "react-dual-listbox";

const UserModal = ({ isEdit, setModal, modal, toggle, user, userGroups }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([]);
>>>>>>> sanad

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (!modal) {
      setShowPassword(false);
    }
  }, [modal]);

<<<<<<< HEAD
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

      phone: (user && user.phone) || "",
=======
  useEffect(() => {
    // Ensure user object and groups are defined before setting selectedFilter
    if (user && user.groups) {
      setSelectedFilter(user.groups.map(group => group.id));
    }
  }, [user]);

  // Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: user?.id || 0,
      email: user?.email || "",
      username: user?.username || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      groups: selectedFilter,
>>>>>>> sanad
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter First Name"),
      email: Yup.string().required("Please Enter Email"),
    }),
    onSubmit: (values) => {
<<<<<<< HEAD

      if (isEdit) {
        const updatedUser = {
          id: user ? user.id : 0,
          username: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          email: values.email,
          ...(values.password && { password: values.password }),

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
          password: showPassword ? values.password : values.phone,
        };
        dispatch(addNewUser(newUser));
=======
      const updatedUser = {
        id: user ? user.id : 0,
        username: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        groups: values.groups,
        ...(values.password && { password: values.password }),
      };

      if (isEdit) {
        // Update user
        dispatch(updateUser(updatedUser));
      } else {
        // Add new user
        dispatch(addUser(updatedUser));
>>>>>>> sanad
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
<<<<<<< HEAD
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
    {
      id: "password-field",
      name: "password",
      label: "كلمة المرور",
      type: showPassword ? "text" : "password",
      placeholder: "ادخل كلمة المرور",
      colSize: "6",
      // isEditPassword: true,
    },
  ];


=======
    // Add other fields here...
  ];

>>>>>>> sanad
  return (
    <Modal
      isOpen={modal}
      centered
<<<<<<< HEAD
      size="md"
=======
      size="lg"
>>>>>>> sanad
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
        encType="multipart/form-data"
      >
        <ModalBody className="modal-body">
          <Row>
            {fields.map((field) => (
<<<<<<< HEAD
              // Render all fields except the password field
              (field.name !== "password" || showPassword) && (
                <FieldComponent
=======
              (field.name !== "password" || showPassword) && (
                <FormFields
>>>>>>> sanad
                  key={field.id}
                  field={field}
                  validation={validation}
                />
              )
            ))}
          </Row>
<<<<<<< HEAD
          {/* Add a link to show the password field */}
=======
>>>>>>> sanad
          <Row>
            <Col>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  togglePasswordVisibility();
                }}
              >
                {isEdit && !showPassword ? (
                  "لتغيير كلمة المرور"
                ) : "لا لتغيير كلمة المرور"}
<<<<<<< HEAD

              </Link>
            </Col>
          </Row>
=======
              </Link>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <div className="mt-4">
                <h5 className="fs-14 mb-1">مجموعات المستخدم</h5>
                <p className="text-muted">اختر المجموعة التي ينتمي إليها المستخدم</p>
                <DualListBox
                  id="groups"
                  name="groups"
                  canFilter
                  filterCallback={(Optgroup, filterInput) => {
                    if (filterInput === "") {
                      return true;
                    }
                    return new RegExp(filterInput, "i").test(Optgroup.label);
                  }}
                  filterPlaceholder="Search..."
                  options={userGroups}
                  selected={selectedFilter} // Use the state variable to control selection
                  onChange={setSelectedFilter} // Update state directly on change
                  icons={{
                    moveLeft: <span className="mdi mdi-chevron-left" key="key" />,
                    moveAllLeft: [
                      <span className="mdi mdi-chevron-double-left" key="key" />,
                    ],
                    moveRight: <span className="mdi mdi-chevron-right" key="key" />,
                    moveAllRight: [
                      <span className="mdi mdi-chevron-double-right" key="key" />,
                    ],
                    moveDown: <span className="mdi mdi-chevron-down" key="key" />,
                    moveUp: <span className="mdi mdi-chevron-up" key="key" />,
                    moveTop: (
                      <span className="mdi mdi-chevron-double-up" key="key" />
                    ),
                    moveBottom: (
                      <span className="mdi mdi-chevron-double-down" key="key" />
                    ),
                  }}
                />
              </div>
            </Col>
          </Row>
>>>>>>> sanad
        </ModalBody>
        <ModalFooter>
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
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UserModal;
<<<<<<< HEAD

=======
>>>>>>> sanad

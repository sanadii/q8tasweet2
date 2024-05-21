// React & Redux
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

// Redux and Selector
import { useSelector, useDispatch } from "react-redux";
import { addNewUser, updateUser } from "store/actions";



import "react-toastify/dist/ReactToastify.css";
import { GenderOptions } from "shared/constants"

import { Col, Row, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";


// Form
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormFields } from "shared/components";
import DualListBox from "react-dual-listbox";

const UserModal = ({ isEdit, setModal, modal, toggle, user, userGroups }) => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (!modal) {
      setShowPassword(false);
    }
  }, [modal]);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      id: user?.id || 0,
      email: user?.email || "",
      username: user?.username || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      groups: user?.groups || [],
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
          groups: values.groups,
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
          groups: values.groups,
          password: showPassword ? values.password : values.phone,
        };
        console.log("newUser: ", newUser)
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



  const [selectedFilter, setSelectedFilter] = useState(["luna"]);


  const OptgroupFilter = [
    {
      label: "Skoda",
      options: [
        { value: "kushaq", label: "Kushaq" },
        { value: "superb", label: "Superb" },
        { value: "octavia", label: "Octavia" },
        { value: "rapid", label: "Rapid" },
      ],
    },
    {
      label: "Volkswagen",
      options: [
        { value: "polo", label: "Polo" },
        { value: "taigun", label: "Taigun" },
        { value: "vento", label: "Vento" },
      ],
    },
  ];


  console.log("userGroups: ", userGroups)
  return (
    <Modal
      isOpen={modal}
      centered
      size="lg"
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
              // Render all fields except the password field
              (field.name !== "password" || showPassword) && (
                <FormFields
                  key={field.id}
                  field={field}
                  validation={validation}
                />
              )
            ))}
            <Row>
              <Col lg={12}>
                <div className="mt-4">
                  <h5 className="fs-14 mb-1">Option Groups</h5>
                  <p className="text-muted">Example of Dual Listbox Option Groups</p>
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
                    selected={selectedFilter}
                    onChange={(e) => setSelectedFilter(e)}
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
          </Row>
          {/* Add a link to show the password field */}
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

              </Link>
            </Col>
          </Row>
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


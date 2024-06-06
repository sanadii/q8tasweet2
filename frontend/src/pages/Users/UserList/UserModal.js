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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (!modal) {
      setShowPassword(false);
    }
  }, [modal]);

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
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter First Name"),
      email: Yup.string().required("Please Enter Email"),
    }),
    onSubmit: (values) => {
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
    // Add other fields here...
  ];

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
              (field.name !== "password" || showPassword) && (
                <FormFields
                  key={field.id}
                  field={field}
                  validation={validation}
                />
              )
            ))}
          </Row>
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

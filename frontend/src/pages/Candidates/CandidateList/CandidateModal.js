// React & Redux
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNewCandidate, updateCandidate } from "store/actions";

// Custom Components & ConstantsImports
import { GenderOptions, PriorityOptions, StatusOptions } from "Common/Constants";

// UI & Utilities Components
import { CardHeader, Col, Row, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import SimpleBar from "simplebar-react";

// Form and Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";
import defaultAvatar from 'assets/images/users/default.jpg';


const CandidateModal = ({ isEdit, setModal, modal, toggle, candidate }) => {
  const dispatch = useDispatch();
  const moderators = useSelector((state) => state.Users.moderators);
  const [selectedImage, setSelectedImage] = useState(candidate?.image || null);

  useEffect(() => {
    // Reset selected image when candidate changes
    if (candidate?.image) {
      setSelectedImage(candidate.image);
    } else {
      setSelectedImage(null);
    }
  }, [candidate]);

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const initialValues = {
    name: candidate?.name || "",
    image: selectedImage || defaultAvatar,
    gender: candidate?.gender || 1,
    status: candidate?.status || 1,
    priority: candidate?.priority || 1,
    moderators: candidate?.moderators?.map((moderator) => moderator.id) || [],
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Candidate Name"),
      status: Yup.number().integer().required('Status is required'),
      priority: Yup.number().integer().required('priority is required'),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('id', candidate ? candidate.id : 0);
      formData.append('name', values.name);
      formData.append('gender', values.gender);
      formData.append('status', values.status);
      formData.append('priority', values.priority);
      if (selectedImage && selectedImage !== defaultAvatar) {
        formData.append("image", selectedImage);
      }

      if (isEdit) {
        dispatch(updateCandidate(formData));
      } else {
        dispatch(addNewCandidate(formData));
      }
      
      // Reset form and selected image after dispatch
      validation.resetForm();
      setSelectedImage(null);
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
            <CardHeader>
              <h5><strong>المرشح</strong></h5>
            </CardHeader>
            <Col lg={8}>
              <div>
                <Label for="name-field" className="form-label">
                  اسم المرشح
                </Label>
                <Input
                  id="name-field"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="ادخل اسم المرشح"
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
                  النوع
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
            </Col>
            <Col lg={4}>
              <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                <img
                  src={validation.values.image}
                  className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                  alt="user-profile"
                />
                <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                  <Input
                    id="profile-img-file-input"
                    type="file"
                    className="profile-img-file-input"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={(e) => {
                      const selectedImage = e.target.files[0];
                      if (selectedImage) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          // Update the image src instead of background
                          const imgElement = document.querySelector(".user-profile-image");
                          if (imgElement) {
                            imgElement.src = reader.result;
                          }
                        };
                        reader.readAsDataURL(selectedImage);
                      }
                      // Handle image selection for validation and form submission
                      handleImageSelect(e);
                    }}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.image && validation.errors.image ? "true" : undefined
                    }
                  />
                  {validation.touched.image && validation.errors.image ? (
                    <FormFeedback type="invalid">
                      {validation.errors.image}
                    </FormFeedback>
                  ) : null}
                  <Label
                    htmlFor="profile-img-file-input"
                    className="profile-photo-edit avatar-xs">
                    <span className="avatar-title rounded-circle bg-light text-body">
                      <i className="ri-camera-fill"></i>
                    </span>
                  </Label>
                </div>
              </div>
            </Col>
            <CardHeader>
              <h5><strong>الإدارة</strong></h5>
            </CardHeader>
            <Col lg={6}>
              <div>
                <Label for="status-field" className="form-label">
                  الحالة
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
                  الأولية
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
            <Col lg={6}>
              <Label className="form-label">المراقب</Label>
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
              اغلاق
            </Button>
            <button type="submit" className="btn btn-success" id="add-btn">
              {!!isEdit ? "تحديث" : "إضافة"}
            </button>
          </div>
        </div>
      </Form>
    </Modal >
  );
};

export default CandidateModal;

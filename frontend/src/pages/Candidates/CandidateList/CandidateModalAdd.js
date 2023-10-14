import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector } from 'Selectors';
import "react-toastify/dist/ReactToastify.css";

import { Card, CardBody, Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

// -Components & Constants imports-
import CandidateModalUpdate from "./CandidateModalUpdate";
import CandidateModalAdd from "./CandidateModalAdd";
import { GuaranteeStatusOptions } from "../../../../Components/constants";

const CandidateModal = ({ modal, toggle, modalMode, elector }) => {
  const { campaignMembers } = useSelector(campaignSelector);

  const [modalSubmit, setModalSubmit] = useState(null);

  let ModalTitle;
  let ModalContent;
  let ModalButton;

  switch (modalMode) {
    case "CandidateModalAdd":
      ModalTitle = "Create New Candidate";
      ModalContent = CandidateModalAdd;
      ModalButton = "Submit";
      break;
    case "CandidateModalUpdate":
      ModalTitle = "Update Candidate";
      ModalContent = CandidateModalUpdate;
      ModalButton = "Submit";
      break;

    default:
      ModalTitle = "Default Modal"; // A default title for other cases
      ModalContent = CandidateModalDefault;
      ModalButton = "Close"; // A default button text
  }

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
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
              <Label for="candidate-type-field" className="form-label">
                Candidate Type
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
              <Label for="candidate-result-field" className="form-label">
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
              <Label for="candidate-votes-field" className="form-label">
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
              <Label for="candidate-seats-field" className="form-label">
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

            {/* <Col lg={12}>
            <div>
              <Label for="description-field" className="form-label">
                Description
              </Label>
              <Input
                name="description"
                id="description-field"
                className="form-control"
                placeholder="Description"
                type="textarea"
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
          </Col> */}
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

const CandidateModalDefault = () => null; // Defining a named component for the default case

export default CandidateModal;

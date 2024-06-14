// ------------ React & Redux ------------
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userSelector, campaignSelector } from 'selectors';

// ------------ Import Actions ------------
<<<<<<< HEAD
import { addNewCampaign, updateCampaign } from "../../../store/actions";
=======
import { addCampaign, updateCampaign } from "../../../store/actions";
>>>>>>> sanad
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import { Card, CardBody, Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

// ------------ Custom Components & ConstantsImports ------------
import { PriorityOptions, StatusOptions } from "shared/constants";

import Flatpickr from "react-flatpickr";
import SimpleBar from "simplebar-react";

const CampaignModal = ({ isEdit, setModal, modal, toggle, campaign }) => {
  const dispatch = useDispatch();

  // ------------ State Management ------------
  const { campaigns, isCampaignSuccess, error } = useSelector(campaignSelector);
  const { moderators } = useSelector(userSelector);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      election_candidate: (campaign && campaign.election_candidate) || "",
      // candidateName: (campaign && campaign.candidateName) || "",
      // electionName: (campaign && campaign.electionName) || "",
      // electionDueDate: (campaign && campaign.electionDueDate) || "",
      // targetVotes: (campaign && campaign.targetVotes) || "",
      description: (campaign && campaign.description) || "",

      // Admin
      status: (campaign && campaign.status) || "New",
      priority: (campaign && campaign.priority) || "High",
      moderators:
        campaign && Array.isArray(campaign.moderators)
          ? campaign.moderators.map((moderator) => moderator.id)
          : [],

      // System
    },
    validationSchema: Yup.object({
      // name: Yup.string().required("Please Enter Campaign Name"),

    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedCampaign = {
          id: campaign ? campaign.id : 0,
          election_candidate: values.election_candidate,
          description: values.description,

          // Admin
          status: values.status,
          priority: values.priority,
          moderators: values.moderators,
        };

        // Update campaign
        dispatch(
          updateCampaign(updatedCampaign)
        );
      } else {
        const newCampaign = {
          id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          description: values.description,

          // Admin
          status: values.status,
          priority: values.priority,
          moderators: values.moderators,
        };
<<<<<<< HEAD
        dispatch(addNewCampaign(newCampaign));
=======
        dispatch(addCampaign(newCampaign));
>>>>>>> sanad
      }

      validation.resetForm();
      toggle();
    },
  });

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
        {!!isEdit ? "Edit Campaign" : "Create Campaign"}
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
            <Col lg={12}>
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
            </Col>
            <Col lg={12}>
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
            <hr />
            {/* <p>Admin Use</p> */}
            <Col lg={6}>
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
                  <option key={status.id} value={status.value}>
                    {status.name}
                  </option>
                ))}
              </Input>
              {validation.touched.status && validation.errors.status ? (
                <FormFeedback type="invalid">
                  {validation.errors.status}
                </FormFeedback>
              ) : null}
            </Col>
            <Col lg={6}>
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
                  <option key={priority.id} value={priority.value}>
                    {priority.name}
                  </option>
                ))}
              </Input>
              {validation.touched.priority && validation.errors.priority ? (
                <FormFeedback type="invalid">
                  {validation.errors.priority}
                </FormFeedback>
              ) : null}
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
              {!!isEdit ? "Update Campaign" : "Add Campaign"}
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CampaignModal;

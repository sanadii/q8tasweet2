// ------------ React & Redux ------------
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { electionSelector, categorySelector, userSelector } from 'Selectors';

// ------------ Import Actions ------------
import { addElection, updateElection, getCategories } from "../../../store/actions";
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import { Card, CardBody, Col, Row, Table, Label, Input, Form, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

// ------------ Custom Components & ConstantsImports ------------
import { ElectionResultOptions, ElectionTypeOptions, PriorityOptions, StatusOptions } from "../../../Common/Constants";
import useCategoryManager from "../../../Common/Hooks/CategoryHooks";

import Flatpickr from "react-flatpickr";
import SimpleBar from "simplebar-react";

const ElectionModal = ({ isEdit, setModal, modal, toggle, election }) => {
  const dispatch = useDispatch();

  // ------------ State Management ------------
  const { moderators } = useSelector(userSelector);
  const { isElectionSuccess, error } = useSelector(electionSelector);
  const { categories, subCategories } = useSelector(categorySelector);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      dueDate: (election && election.dueDate) || null,
      category: (election && election.category) || null,
      subCategory: (election && election.subCategory) || null,
      tags: (election && election.tags) || [],

      // Election Specification
      electType: (election && election.electType) || 1,
      electResult: (election && election.electResult) || 1,
      electVotes: (election && election.electVotes) || 0,
      electSeats: (election && election.electSeats) || 0,
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
      category: Yup.number().integer().nullable().notRequired('Category is required'),
      subCategory: Yup.number().integer().nullable().notRequired('Sub-Category is required'),


    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedElection = {
          id: election ? election.id : 0,
          dueDate: values.dueDate,

          // Taxonomies
          category: values.category,
          subCategory: values.subCategory,
          tags: Array.isArray(values.tags) ? values.tags : [],

          // Election Spesifications
          electType: values.electType,
          electResult: values.electResult,
          electVotes: values.electVotes,
          electSeats: values.electSeats,
          electors: values.electors,
          attendees: values.attendees,

          // Admin
          status: parseInt(values.status, 10),
          priority: parseInt(values.priority, 10),
          moderators: values.moderators,
        };

        // Update election
        dispatch(
          updateElection({ election: updatedElection })
        );
      } else {
        const newElection = {
          dueDate: values.dueDate,

          // Taxonomies
          category: parseInt(values.category, 10),
          subCategory: parseInt(values.subCategory, 10),
          tags: Array.isArray(values.tags) ? values.tags : [],

          // Election Spesifications
          electType: values.electType,
          electResult: values.electResult,
          electVotes: values.electVotes,
          electSeats: values.electSeats,

          // Admin
          status: parseInt(values.status, 10),
          priority: parseInt(values.priority, 10),
          moderators: values.moderators,
        };
        dispatch(addElection({ election: newElection }));
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
            <Col lg={4}>
              <div>
                <Label for="category-field" className="form-label">
                  تصنيف الانتخابات
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
            </Col>

            <Col lg={4}>
              <div>
                <Label for="sub-category-field" className="form-label">
                  تصنيف الإنتخابات
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
                  <option value="">التصنيف الفرعي</option>
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
            <Col lg={4}>
              <div>
                <Label for="dueDate-field" className="form-label">
                  الموعد
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
            </Col>
            <Col lg={4}>
              <Label for="electType-field" className="form-label">
                نوع الانتخابات
              </Label>
              <Input
                name="electType"
                type="select"
                className="form-select"
                id="ticket-field"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.electType || 1}
              >
                {ElectionTypeOptions.map((electType) => (
                  <option key={electType.id} value={electType.id}>
                    {electType.name}
                  </option>
                ))}
              </Input>
              {validation.touched.electType && validation.errors.electType ? (
                <FormFeedback type="invalid">
                  {validation.errors.type}
                </FormFeedback>
              ) : null}
            </Col>
            <Col lg={4}>
              <Label for="electResult-field" className="form-label">
                نتائج الانتخابات
              </Label>
              <Input
                id="elect-result-field"
                name="electResult"
                type="select"
                className="form-select"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.electResult || 1}
              >
                {ElectionResultOptions.map((electResult) => (
                  <option key={electResult.id} value={electResult.id}>
                    {electResult.name}
                  </option>
                ))}
              </Input>
              {validation.touched.electResult && validation.errors.electResult ? (
                <FormFeedback type="invalid">
                  {validation.errors.electResult}
                </FormFeedback>
              ) : null}
            </Col>
            <Col lg={4}>
              <Label for="electVotes-field" className="form-label">
                عدد الأصوات
              </Label>
              <Input
                id="elect-votes-field"
                name="electVotes"
                type="number"
                value={validation.values.electVotes || 0}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              ></Input>
              {validation.touched.electVotes && validation.errors.electVotes ? (
                <FormFeedback electVotes="invalid">
                  {validation.errors.electVotes}
                </FormFeedback>
              ) : null}
            </Col>
            <Col lg={4}>
              <Label for="electSeats-field" className="form-label">
                عدد المقاعد
              </Label>
              <Input
                id="elect-seats-field"
                name="electSeats"
                type="number"
                className="form-control"
                placeholder="0"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.electSeats || 0}
              ></Input>
              {validation.touched.electSeats && validation.errors.electSeats ? (
                <FormFeedback electSeats="invalid">
                  {validation.errors.electSeats}
                </FormFeedback>
              ) : null}
            </Col>
            <Col lg={4}>
              <Label for="electors-field" className="form-label">
                عدد الناخبين
              </Label>
              <Input
                id="electors-field"
                name="electors"
                type="number"
                className="form-control"
                placeholder="0"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.electors || 0}
              ></Input>
              {validation.touched.electors && validation.errors.electSeats ? (
                <FormFeedback electors="invalid">
                  {validation.errors.electors}
                </FormFeedback>
              ) : null}
            </Col>
            <Col lg={4}>
              <Label for="attendees-field" className="form-label">
                عدد الحضور
              </Label>
              <Input
                id="attendees-field"
                name="attendees"
                type="number"
                className="form-control"
                placeholder="0"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.attendees || 0}
              ></Input>
              {validation.touched.attendees && validation.errors.attendees ? (
                <FormFeedback attendees="invalid">
                  {validation.errors.attendees}
                </FormFeedback>
              ) : null}
            </Col>
            <hr />


            <Col lg={6}>
              <Label className="form-label">المشرفين</Label>
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
              إغلاق
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

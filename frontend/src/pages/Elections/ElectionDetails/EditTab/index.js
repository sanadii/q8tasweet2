import React, { useState } from "react";
import { electionSelector, categorySelector } from 'Selectors';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { updateElection } from "store/actions";
import useCategoryManager from "Common/Hooks/CategoryHooks";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Input, Label, Row, FormFeedback, Form } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import Dropzone from "react-dropzone";
import { StatusOptions, PriorityOptions, RoleOptions, ElectionTypeOptions, ElectionResultOptions, TagOptions } from "Common/Constants";

const EditTab = () => {
  const dispatch = useDispatch();

  const { election, electionId } = useSelector(electionSelector);
  const { categories, subCategories } = useSelector(categorySelector);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      category: (election && election.category) || "",
      subCategory: (election && election.subCategory) || "",
      dueDate: (election && election.dueDate) || "",

      tags: (election && election.tags) || [],

      // Election Specification
      electType: (election && election.electType) || 1,
      electResult: (election && election.electResult) || 1,
      electVotes: (election && election.electVotes) || 0,
      electSeats: (election && election.electSeats) || 0,

      // ElectionElectors
      electors: (election && election.electors) || 0,
      electorsMales: (election && election.electorsMales) || 0,
      electorsFemales: (election && election.electorsFemales) || 0,

      // ElectionElectorAttendees
      attendees: (election && election.attendees) || 0,
      attendeesMales: (election && election.attendeesMales) || 0,
      attendeesFemales: (election && election.attendeesFemales) || 0,

      // System
      status: (election && election.status) || 1,
      priority: (election && election.priority) || 1,
      delet: (election && election.delet) || "",
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Please Enter Election Name"),
      subCategory: Yup.string().required("Please Enter Election Name"),
      dueDate: Yup.string().required("Please Enter Election Name"),
      status: Yup.number().integer().required('Status is required'),
      priority: Yup.number().integer().required('priority is required'),

    }),

    onSubmit: (values) => {
      const updatedElection = {
        id: electionId,
        category: values.category,
        subCategory: values.subCategory,
        dueDate: dueDate,

        // Taxonomies
        tags: Array.isArray(values.tags) ? values.tags : [],

        // Election Spesifications
        electType: values.electType,
        electResult: values.electResult,
        electVotes: values.electVotes,
        electSeats: values.electSeats,
        electors: values.electors,
        electorsMales: values.electorsMales,
        electorsFemales: values.electorsFemales,

        attendees: values.attendees,
        attendeesMales: values.attendeesMales,
        attendeesFemales: values.attendeesFemales,

        // Admin
        status: values.status,
        priority: values.priority,
      };
      dispatch(updateElection(updatedElection));
      validation.resetForm();

    },
  });

  // Categories
  const { categoryOptions, subCategoryOptions, changeSubCategoriesOptions, activeParentCategoryId } = useCategoryManager(categories, subCategories, validation);

  const [selectedMulti, setselectedMulti] = useState(null);

  const handleMulti = (selectedMulti) => {
    setselectedMulti(selectedMulti);
  };

  //Dropzone file upload
  const [selectedFiles, setselectedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  const handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  };

  // Formats the size
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Format the Date
  const defaultdate = () => {
    let d = new Date();
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };
  const [dueDate, setDueDate] = useState(defaultdate());

  const dateformate = (e) => {
    const selectedDate = new Date(e);
    const formattedDate = `${selectedDate.getFullYear()}-${(
      "0" +
      (selectedDate.getMonth() + 1)
    ).slice(-2)}-${("0" + selectedDate.getDate()).slice(-2)}`;
    setDueDate(formattedDate);
  };

  document.title =
    "Update Election | Q8Tasweet - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <Form
        className="tablelist-form"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <Row>
          <div className="text-end mb-4">
            <button type="submit" className="btn btn-success" id="add-btn">
              تعديل
            </button>
          </div>
        </Row>
        <Row>

          <Col lg={4}>
            <Card>
              <CardHeader>
                <h4>التفاصيل</h4>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label
                        htmlFor="datepicker-deadline-input"
                        className="form-label"
                      >
                        يوم الإقتراع
                      </Label>
                      <Flatpickr
                        name="dueDate"
                        id="dueDate-field"
                        className="form-control"
                        placeholder="Select a Date"
                        options={{
                          altInput: true,
                          altFormat: "Y-m-d",
                          dateFormat: "Y-m-d",
                        }}
                        onChange={(e) => dateformate(e)}
                        value={validation.values.dueDate || ""}
                      />
                      {validation.touched.dueDate &&
                        validation.errors.dueDate ? (
                        <FormFeedback type="invalid">
                          {validation.errors.dueDate}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label for="category-field" className="form-label">
                        التصنيف
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
                        <option value="">- اختر التصنيف -</option>
                        {categoryOptions.map((category) => (
                          <option key={category.id} value={parseInt(category.id)}>
                            {category.name}
                          </option>
                        ))}
                      </Input>
                      {validation.touched.category &&
                        validation.errors.category ? (
                        <FormFeedback type="invalid">
                          {validation.errors.category}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label for="sub-category-field" className="form-label">
                        التصنيف الفرعي
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
                        <option value="">- اختر التصنيف الفرعي -</option>
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
                </Row>
              </CardBody>
              {validation.touched.priority && validation.errors.priority ? (
                <FormFeedback type="invalid">
                  {validation.errors.priority}
                </FormFeedback>
              ) : null}
              <CardHeader>
                <h4>إعدادات الإنتخابات</h4>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label for="election-type" className="form-label">
                        نوع الإنتخابات
                      </Label>
                      <Input
                        name="electType"
                        type="select"
                        className="form-select"
                        id="electionType"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      // value={validation.values.type || ""}
                      >
                        {/* Placeholder option */}
                        {ElectionTypeOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Input>

                      {validation.touched.option && validation.errors.option ? (
                        <FormFeedback type="invalid">
                          {validation.errors.option}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={6}>

                    <div className="mb-3">
                      <Label for="electResult" className="form-label">
                        عرض النتائج
                      </Label>
                      <Input
                        name="electResult"
                        type="select"
                        className="form-select"
                        id="electResult-field"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.electResult || ""}
                      >
                        {/* Placeholder option */}
                        {ElectionResultOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Input>

                      {validation.touched.option && validation.errors.option ? (
                        <FormFeedback type="invalid">
                          {validation.errors.option}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="electSeats-input" className="form-label">
                        عدد المقاعد للفائزين
                      </Label>
                      <input
                        id="electSeats-input"
                        name="electSeats" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.electSeats || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="electVotes-input" className="form-label">
                        عدد الأصوات للناخبين
                      </Label>
                      <input
                        id="electVotes-input"
                        name="electVotes" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.electVotes || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

          </Col>
          <Col lg={4}>
            <Card>
              <CardHeader>
                <h4>الناخبين</h4>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="electors-input" className="form-label">
                        عدد الناخبين
                      </Label>
                      <input
                        id="electors-input"
                        name="electors" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.electors || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="electorsMales-input" className="form-label">
                        عدد الناخبين الرجال
                      </Label>
                      <input
                        id="electors-input"
                        name="electorsMales" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.electorsMales || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="electorsFemales-input" className="form-label">
                        عدد الناخبين النساء
                      </Label>
                      <input
                        id="electorsFemales-input"
                        name="electorsFemales" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.electorsFemales || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>

              <CardHeader>
                <h4>الحضور</h4>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="attendees-input" className="form-label">
                        عدد الحضور
                      </Label>
                      <input
                        id="attendees-input"
                        name="attendees" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.attendees || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="attendeesMales-input" className="form-label">
                        حضور الرجال
                      </Label>
                      <input
                        id="attendeesMales-input"
                        name="attendeesMales" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.attendeesMales || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="attendeesFemales-input" className="form-label">
                        حضور النساء
                      </Label>
                      <input
                        id="attendeesFemales-input"
                        name="attendeesFemales" // Add this
                        type="number"
                        className="form-control"
                        value={validation.values.attendeesFemales || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <div className="card">
              <CardHeader>
                <h4>الإدارة</h4>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
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
                  </Input>{" "}
                  {validation.touched.priority && validation.errors.priority ? (
                    <FormFeedback type="invalid">
                      {validation.errors.priority}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label for="status-field" className="form-label">
                    الحالة
                  </Label>
                  <Input
                    name="status"
                    type="select"
                    className="form-select"
                    id="status-field"
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
                <div className="mb-3">
                  <p className="text-muted">Add Attached files here.</p>

                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      handleAcceptedFiles(acceptedFiles);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div className="dropzone dz-clickable">
                        <div
                          className="dz-message needsclick"
                          {...getRootProps()}
                        >
                          <div className="mb-3">
                            <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                          </div>
                          <h4>Drop files here or click to upload.</h4>
                        </div>
                      </div>
                    )}
                  </Dropzone>

                  <ul className="list-unstyled mb-0" id="dropzone-preview">
                    {selectedFiles.map((f, i) => {
                      return (
                        <Card
                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                <img
                                  data-dz-thumbnail=""
                                  height="80"
                                  className="avatar-sm rounded bg-light"
                                  alt={f.name}
                                  src={f.preview}
                                />
                              </Col>
                              <Col>
                                <Link
                                  to="#"
                                  className="text-muted font-weight-bold"
                                >
                                  {f.name}
                                </Link>
                                <p className="mb-0">
                                  <strong>{f.formattedSize}</strong>
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      );
                    })}
                  </ul>
                </div>
              </CardBody>
              <ToastContainer closeButton={false} limit={1} />

            </div>
          </Col>
        </Row>
      </Form >
    </React.Fragment >
  );
};

export default EditTab;

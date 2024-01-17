import React, { useState } from "react";
import { electionSelector, categorySelector } from 'Selectors';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { updateElection } from "store/actions";
import { useCategoryManager } from "hooks";
import { FormFields } from "components";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { Col, Row, Form, Card, CardHeader, CardBody } from "reactstrap";

//Import Flatepicker
import Dropzone from "react-dropzone";
import { StatusOptions, PriorityOptions, RoleOptions, ElectionMethodOptions, ElectionResultOptions, ElectionPartyResultOptions, ElectionSortingResultOptions, TagOptions } from "constants";

const EditElection = () => {
  const dispatch = useDispatch();

  const { election, electionId } = useSelector(electionSelector);
  const { categories, subCategories } = useSelector(categorySelector);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      category: election?.category ?? "",
      subCategory: election?.subCategory ?? "",
      dueDate: election?.dueDate ?? "",
      tags: election?.tags ?? [],

      // Settings
      electionMethod: election?.electionMethod ?? "candidateOnly",
      electionResult: election?.electionResult ?? "candidateOnly",
      electionPartyResult: election?.electionPartyResult ?? 1,
      electionSortingResult: election?.electionSortingResult ?? false,
      electVotes: election?.electVotes ?? 0,
      electSeats: election?.electSeats ?? 0,

      // Electors
      electors: election?.electors ?? 0,
      electorsMales: election?.electorsMales ?? 0,
      electorsFemales: election?.electorsFemales ?? 0,

      // Attendees
      attendees: election?.attendees ?? 0,
      attendeesMales: election?.attendeesMales ?? 0,
      attendeesFemales: election?.attendeesFemales ?? 0,

      // System
      status: election?.task?.status ?? 1,
      priority: election?.task?.priority ?? 1,
      delet: election?.delet ?? "",
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Please Enter Election Name"),
      subCategory: Yup.string().required("Please Enter Election Name"),
      dueDate: Yup.string().required("Please Enter Election Name"),
      status: Yup.number().integer().required('Status is required'),
      priority: Yup.number().integer().required('priority is required'),

    }),

    onSubmit: (values) => {
      const electionResultJson = {
        election_result: values.electionResult,
        election_party_result: values.electionPartyResult,
        election_sorting_result: values.electionSortingResult,
      };

      
      const updatedElection = {
        id: electionId,
        category: values.category,
        subCategory: values.subCategory,
        dueDate: values.dueDate,

        // Taxonomies
        tags: Array.isArray(values.tags) ? values.tags : [],

        // Election Spesifications
        electionMethod: values.electionMethod,
        electionResult: JSON.stringify(electionResultJson), // Convert the object to a JSON string
  
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





  document.title =
    "Update Election | Q8Tasweet - React Admin & Dashboard Template";

  const fields = [
    {
      column: "columnOne",
      sections: [
        {
          section: "التفاصيل",
          fields: [
            {
              id: "dueDate-field",
              name: "dueDate",
              label: "الموعد",
              type: "date",
              colSize: 4,
              colSize: 12,
            },
            {
              id: "category-field",
              name: "category",
              label: "التصنيف",
              type: "select",
              options: categoryOptions.map(category => ({
                id: category.id,
                label: category.name,
                value: category.id
              })),
              onChange: (e) => {
                validation.handleChange(e);
                changeSubCategoriesOptions(e);
              },
              colSize: 6,
            },
            {
              id: "sub-category-field",
              name: "subCategory",
              label: "التصنيف الفرعي",
              type: "select",
              options: subCategoryOptions.map(subCategory => ({
                id: subCategory.id,
                label: subCategory.name,
                value: subCategory.id
              })),
              colSize: 6,
            },
          ]
        },
        {
          section: "إعدادات الإنتخابات",
          fields: [
            {
              id: "electionMethod-field",
              name: "electionMethod",
              label: "نوع الإنتخابات",
              type: "select",
              options: ElectionMethodOptions.map(option => ({
                id: option.id,
                label: option.name,
                value: option.value
              })),
              colSize: 6,
            },
            {
              id: "electionResult-field",
              name: "electionResult",
              label: "عرض النتائج",
              type: "select",
              options: ElectionResultOptions.map(option => ({
                id: option.id,
                label: option.name,
                value: option.id
              })),
              colSize: 6,
            },
            {
              id: "resultPartyType-field",
              name: "resultPartyType",
              label: "عرض نتائج القوائم",
              type: "select",
              options: ElectionPartyResultOptions.map(option => ({
                id: option.id,
                label: option.name,
                value: option.id
              })),
              colSize: 6,
            },
            {
              id: "resultSortingType-field",
              name: "resultSortingType",
              label: "عرض نتائج الفرز",
              type: "select",
              options: ElectionSortingResultOptions.map(option => ({
                id: option.id,
                label: option.name,
                value: option.id
              })),
              colSize: 6,
            },
            {
              id: "electionResultParty-field",
              name: "electionResultParty",
              label: "عرض نتائج إنتخابات القوائم",
              type: "select",
              options: ElectionResultOptions.map(option => ({
                id: option.id,
                label: option.name,
                value: option.id
              })),
              colSize: 6,
            },
            {
              id: "electSeats-input",
              name: "electSeats",
              label: "عدد المقاعد للفائزين",
              type: "number",
              value: validation.values.electSeats || "",
              colSize: 6,
            },
            {
              id: "electVotes-input",
              name: "electVotes",
              label: "عدد الأصوات للناخبين",
              type: "number",
              value: validation.values.electVotes || "",
              colSize: 6,
            },
          ]
        },
      ]
    },
    {
      column: "columnTwo",
      sections: [
        {
          section: "الناخبين",
          fields: [
            {
              id: "electors-input",
              name: "electors",
              label: "عدد الناخبين",
              type: "number",
              colSize: 12,
            },
            {
              id: "electorsMales-input",
              name: "electorsMales",
              label: "عدد الناخبين الرجال",
              type: "number",
              colSize: 6,
            },
            {
              id: "electorsFemales-input",
              name: "electorsFemales",
              label: "عدد الناخبين النساء",
              type: "number",
              colSize: 6,
            },
          ]
        },
        {
          section: "الحضور",
          fields: [
            {
              id: "attendees-input",
              name: "attendees",
              label: "عدد الحضور",
              type: "number",
              colSize: 12,
            },
            {
              id: "attendeesMales-input",
              name: "attendeesMales",
              label: "حضور الرجال",
              type: "number",
              colSize: 6,
            },
            {
              id: "attendeesFemales-input",
              name: "attendeesFemales",
              label: "حضور النساء",
              type: "number",
              colSize: 6,
            },]
        },
      ]
    },
    {
      column: "columnThree",
      sections: [
        {
          section: "الإدارة",
          fields: [
            {
              id: "priority-field",
              name: "priority",
              label: "الأولية",
              type: "select",
              options: PriorityOptions.map(priority => ({
                id: priority.id,
                label: priority.name,
                value: priority.id
              })),
              colSize: 12,
            },
            {
              id: "status-field",
              name: "status",
              label: "الحالة",
              type: "select",
              options: StatusOptions.map(status => ({
                id: status.id,
                label: status.name,
                value: status.id
              })),
              colSize: 12,
            },
            // {
            //   id: "file-upload",
            //   name: "fileUpload",
            //   label: "Add Attached files here.",
            //   type: "file",
            //   dropzoneOptions: {
            //     onDrop: handleAcceptedFiles,
            //     // Additional Dropzone options as needed
            //   },
            //   colSize: 12,
            // },
          ]
        },
      ]
    },
  ];


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
        <Row className="g-3">
          {fields.map((column) => (
            <Col lg={4} key={column.column}>
              {column.sections.map((section) => (
                <Card key={section.section}>
                  <CardHeader>
                    <h4>{section.section}</h4>
                  </CardHeader>
                  <CardBody>
                    <Row className="g-3">
                      {section.fields.map((field) => (
                        (field.condition === undefined || field.condition) && (
                          <Col lg={12} key={field.id}>
                            <FormFields
                              field={field}
                              validation={validation}
                            />
                          </Col>
                        )
                      ))}
                    </Row>
                  </CardBody>
                </Card>
              ))}
            </Col>
          ))}
        </Row>
        <Row>
          <div className="text-end mb-4">
            <button type="submit" className="btn btn-success" id="add-btn">
              تعديل
            </button>
          </div>
        </Row>
      </Form>


    </React.Fragment >
  );
};

export default EditElection;

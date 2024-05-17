import React, { useState } from "react";
import { electionSelector, categorySelector } from 'selectors';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { updateElection } from "store/actions";
import { useCategoryManager } from "shared/hooks";
import { FormFields } from "shared/components";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button, Col, Row, Form, Card, CardHeader, CardBody } from "reactstrap";

//Import Flatepicker


// Components
import ElectionSchema from "./ElectionSchema";
import { getOptionOptions } from "shared/utils";

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
      electionMethod: (election && election.electionMethod) || "candidateOnly",
      electionResult: (election && election.electionResult) || "candidateOnly",
      isDetailedResults: (election && election.isDetailedResults) || false,
      isSortingResults: (election && election.isSortingResults) || false,
      
      electSeats: (election && election.electSeats) || 0,
      electVotes: (election && election.electVotes) || 0,

      // Voters
      electorCount: (election && election.electorCount) || 0,
      electorMaleCount: (election && election.electorMaleCount) || 0,
      electorFemaleCount: (election && election.electorFemaleCount) || 0,

      // Attendees
      attendeeCount: (election && election.attendeeCount) || 0,
      attendeeMaleCount: (election && election.attendeeMaleCount) || 0,
      attendeeFemaleCount: (election && election.attendeeFemaleCount) || 0,

      // System
      status: (election && election.status) || 0,
      priority: (election && election.priority) || 0,
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
      const electionResultJson = {
        view: values.electionResultView || "total",
        party: values.electionResultParty || "candidateOnly",
        sorting: values.electionResultSorting, // No need to parse as it's already a boolean
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
        isDetailedResults: values.isDetailedResults || false,
        isSortingResults: values.isSortingResults || false,
        electSeats: values.electSeats,
        electVotes: values.electVotes,

        electorCount: values.electorCount,
        electorMaleCount: values.electorMaleCount,
        electorFemaleCount: values.electorFemaleCount,

        attendeeCount: values.attendeeCount,
        attendeeMaleCount: values.attendeeMaleCount,
        attendeeFemaleCount: values.attendeeFemaleCount,

        // Admin
        status: values.status,
        priority: values.priority,
      };
      dispatch(updateElection(updatedElection));
      validation.resetForm();

    },
  });

  console.log("electionelection: ", election)


  // Categories
  const { categoryOptions, subCategoryOptions, changeSubCategoriesOptions, activeParentCategoryId } = useCategoryManager(categories, subCategories, validation);


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
              colSize: 12, // Corrected colSize value
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
              options: getOptionOptions("electionMethod"),
              colSize: 12,
            },
            // {
            //   id: "electionResult-field",
            //   name: "electionresult",
            //   label: "عرض النتائج",
            //   type: "select",
            //   options: getOptionOptions("electionResult"),
            //   colSize: 12,
            // },
            {
              id: "isDetailedResults-field",
              name: "isDetailedResults",
              label: "نتائج تفصيلية؟",
              type: "checkBox",
              colSize: 6,
            },
            {
              id: "isSortingResults-field",
              name: "isSortingResults",
              label: "نتائج الفرز؟",
              type: "checkBox",
              colSize: 6,
            },
          ]
        }
      ]
    },
    {
      column: "columnTwo",
      sections: [
        {
          section: "الناخبين والحضور",
          fields: [
            {
              id: "electorCount-input",
              name: "electorCount",
              label: "الناخبين",
              type: "number",
              colSize: 4,
            },
            {
              id: "electorMaleCount-input",
              name: "electorMaleCount",
              label: "الرجال",
              type: "number",
              colSize: 4,
            },
            {
              id: "electorFemaleCount-input",
              name: "electorFemaleCount",
              label: "النساء",
              type: "number",
              colSize: 4,
            },

            {
              id: "attendeeCount-input",
              name: "attendeeCount",
              label: "الحضور",
              type: "number",
              colSize: 4,
            },
            {
              id: "attendeeMaleCount-input",
              name: "attendeeMaleCount",
              label: "الرجال",
              type: "number",
              colSize: 4,
            },
            {
              id: "attendeeFemaleCount-input",
              name: "attendeeFemaleCount",
              label: "النساء",
              type: "number",
              colSize: 4,
            },
          ],

        },
        {
          section: "الإدارة",
          fields: [
            {
              id: "priority-field",
              name: "priority",
              label: "الأولية",
              type: "select",
              options: getOptionOptions("priority"),
              colSize: 6,
            },
            {
              id: "status-field",
              name: "status",
              label: "الحالة",
              type: "select",
              options: getOptionOptions("status"),
              colSize: 6,
            },
          ]
        },
      ],
    }
  ];




  return (
    <React.Fragment >
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
                    <Row className="g-2">
                      {section.fields.map((field) => (
                        (field.condition === undefined || field.condition) && (
                          <FormFields
                            key={field.id}
                            field={field}
                            validation={validation}
                          />
                        )
                      ))}
                    </Row>
                  </CardBody>
                </Card>
              ))}
            </Col>
          ))}
          <Col lg={4}>
            <ElectionSchema election={election} />

          </Col>
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

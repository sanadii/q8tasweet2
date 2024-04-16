import React, { useState } from "react";
import { electionSelector, categorySelector } from 'selectors';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { updateElection, addElectionDatabase } from "store/actions";
import { useCategoryManager } from "shared/hooks";
import { FormFields } from "shared/components";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button, Col, Row, Form, Card, CardHeader, CardBody } from "reactstrap";

//Import Flatepicker
import Dropzone from "react-dropzone";
import { StatusOptions, PriorityOptions, RoleOptions, ElectionMethodOptions, ElectionResultOptions, PartyResultOptions, SortingResultOptions, TagOptions } from "shared/constants";

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
      electionResultView: (election && election.electionResultView) || "total",
      electionResultParty: (election && election.electionResultParty) || "candidateOnly",
      electionResultSorting: (election && election.electionResultSorting) || false,
      electSeats: (election && election.electSeats) || 0,
      electVotes: (election && election.electVotes) || 0,

      // Voters
      voters: (election && election.voters) || 0,
      votersMales: (election && election.votersMales) || 0,
      votersFemales: (election && election.votersFemales) || 0,

      // Attendees
      attendees: (election && election.attendees) || 0,
      attendeesMales: (election && election.attendeesMales) || 0,
      attendeesFemales: (election && election.attendeesFemales) || 0,

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
        electionResult: JSON.stringify(electionResultJson), // Convert the object to a JSON string
        electSeats: values.electSeats,
        electVotes: values.electVotes,
        voters: values.voters,
        votersMales: values.votersMales,
        votersFemales: values.votersFemales,

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
              id: "electionResultView-field",
              name: "electionResultView",
              label: "عرض النتائج",
              type: "select",
              options: ElectionResultOptions.map(option => ({
                id: option.id,
                label: option.name,
                value: option.value
              })),
              colSize: 6,
            },
            {
              id: "electionResultParty-field",
              name: "electionResultParty",
              label: "عرض نتائج القوائم",
              type: "select",
              options: PartyResultOptions.map(option => ({
                id: option.id,
                label: option.name,
                value: option.value
              })),
              colSize: 6,
            },
            {
              id: "electionResultSorting-field",
              name: "electionResultSorting",
              label: "عرض نتائج الفرز",
              type: "select",
              options: SortingResultOptions.map(option => ({
                id: option.id,
                label: option.name,
                value: option.value // No need to convert to a string
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
              id: "voters-input",
              name: "voters",
              label: "عدد الناخبين",
              type: "number",
              colSize: 12,
            },
            {
              id: "votersMales-input",
              name: "votersMales",
              label: "عدد الناخبين الرجال",
              type: "number",
              colSize: 6,
            },
            {
              id: "votersFemales-input",
              name: "votersFemales",
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

  const handleAddElectionDatabase = () => {
    dispatch(addElectionDatabase(election.slug))
  }

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
          <Button
            onClick={handleAddElectionDatabase}>Add Election Dtabase
            </Button>

{/* TODO: to add different upload sections for different use
1) add sqlite table
// Elections
1) upload electors
2) upload electors stats
3) upload committees
4) upload candidates / results
* make sure ids are compatables

// Campaign
1) campaign Data,
2) team images, background images and stuff

3) upload team
4) upload guarantees
5) upload s */}

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

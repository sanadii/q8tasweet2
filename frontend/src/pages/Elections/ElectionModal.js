// React & Redux
import React from "react";
import * as moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { electionSelector, categorySelector, userSelector } from 'selectors';

// Import Actions
import { addElection, updateElection } from "store/actions";
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

import { Row, Form, Modal, ModalHeader, ModalBody, Button } from "reactstrap";

// Custom Components & ConstantsImports
import { FormFields } from "shared/components";
import { ElectionMethodOptions, ElectionResultOptions, ElectionPartyResultOptions, ElectionSortingResultOptions, PriorityOptions, StatusOptions } from "shared/constants";
import { useCategoryManager } from "shared/hooks";
import { handleValidDate } from "shared/utils"

const ElectionModal = ({ isEdit, setModal, modal, toggle, election }) => {
  const dispatch = useDispatch();
  const { categories, subCategories } = useSelector(categorySelector);

  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      category: (categories.length > 0) ? categories[0].id : null,
      subCategory: (subCategories.length > 0) ? subCategories[0].id : null,
      dueDate: (election && moment(election.dueDate, "YYYY-MM-DD", true).isValid()
        ? election.dueDate
        : moment().format("YYYY-MM-DD")),
      tags: (election && election.tags) || [],
      electionMethod: (election && election.electionMethod) || "candidateOnly",
      electionResult: (election && election.electionResult) || "total",
      electVotes: (election && election.electVotes) || 0,
      electSeats: (election && election.electSeats) || 0,
      voters: (election && election.voters) || 0,
      attendees: (election && election.attendees) || 0,

      // Task
      status: (election && election.task && election.task.status) || 1,
      priority: (election && election.task && election.task.priority) || 1,
      moderators:
        election && Array.isArray(election.moderators)
          ? election.moderators.map((moderator) => moderator.id)
          : [],
    },

    validationSchema: Yup.object({
      category: Yup.number().integer().nullable().notRequired('Category is required'),
      subCategory: Yup.number().integer().nullable().notRequired('Sub-Category is required'),
      // dueDate: Yup.date().nullable().required('Due Date is required').min(new Date(), 'Due Date must be in the future'),


    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedElection = {
          id: election ? election.id : 0,
          category: values.category,
          subCategory: values.subCategory,
          dueDate: values.dueDate,
          tags: Array.isArray(values.tags) ? values.tags : [],
          electionMethod: values.electionMethod,
          electionResult: values.electionResult,
          electVotes: values.electVotes,
          electSeats: values.electSeats,
          voters: values.voters,
          attendees: values.attendees,
          status: parseInt(values.status, 10),
          priority: parseInt(values.priority, 10),
          moderators: values.moderators,
        };

        // Update election
        dispatch(
          updateElection(updatedElection)
        );
      } else {
        const newElection = {
          category: parseInt(values.category, 10),
          subCategory: parseInt(values.subCategory, 10),
          dueDate: values.dueDate,
          tags: Array.isArray(values.tags) ? values.tags : [],
          electionMethod: values.electionMethod,
          electionResult: values.electionResult,
          electVotes: values.electVotes,
          electSeats: values.electSeats,
          status: parseInt(values.status, 10),
          priority: parseInt(values.priority, 10),
          moderators: values.moderators,
        };
        dispatch(addElection(newElection));
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

  const fields = [
    // Existing fields
    {
      id: "category-field",
      name: "category",
      label: "تصنيف الانتخابات",
      type: "select",
      options: categoryOptions.map(item => ({
        id: item.id,
        label: item.name,
        value: item.id
      })),
      onChange: (e) => {
        validation.handleChange(e);
        changeSubCategoriesOptions(e);
      },
      colSize: 4,
    },
    {
      id: "subCategory-field",
      name: "subCategory",
      label: "تصنيف الإنتخابات",
      type: "select",
      options: subCategoryOptions.map(item => ({
        id: item.id,
        label: item.name,
        value: item.id
      })),
      colSize: 4,
    },
    {
      id: "dueDate-field",
      name: "dueDate",
      label: "الموعد",
      type: "date",
      colSize: 4,
    },
    {
      id: "electionMethod-field",
      name: "electionMethod",
      label: "نوع الانتخابات",
      type: "select",
      options: ElectionMethodOptions.map(electionMethod => ({
        id: electionMethod.id,
        label: electionMethod.name,
        value: electionMethod.value
      })),
      colSize: 4,
    },
    // Additional fields
    {
      id: "electionResult-field",
      name: "electionResult",
      label: "نتائج الانتخابات",
      type: "select",
      options: ElectionResultOptions.map(electionResult => ({
        id: electionResult.id,
        label: electionResult.name,
        value: electionResult.value
      })),
      colSize: 4,
    },
    {
      id: "electVotes-field",
      name: "electVotes",
      label: "عدد الأصوات",
      type: "number",
      colSize: 4,
    },
    {
      id: "electSeats-field",
      name: "electSeats",
      label: "عدد المقاعد",
      type: "number",
      colSize: 4,
    },
    {
      id: "voters-field",
      name: "voters",
      label: "عدد الناخبين",
      type: "number",
      colSize: 4,
    },
    {
      id: "attendees-field",
      name: "attendees",
      label: "عدد الحضور",
      type: "number",
      colSize: 4,
    },
    // Special case for moderators - needs a custom component
    // {
    //   id: "moderators",
    //   name: "moderators",
    //   label: "المشرفين",
    //   type: "checkbox-group",
    //   options: moderators, // Assuming 'moderators' is an array of moderator objects
    //   colSize: 6,
    // },
    {
      id: "seperator",
      type: "seperator",
      colSize: 12,
    },
    {
      id: "title",
      type: "title",
      label: "الإدارة",
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
      colSize: 6,
    },
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
      colSize: 6,
    },
  ];


  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      centered
      size="lg"
      className="border-0"
      modalClassName="modal fadeInLeft zoomIn"
    >
      <ModalHeader className="p-3 bg-soft-danger" toggle={toggle}>
        {!!isEdit ? "تحديث الإنتخابات" : "إضافة أنتخابات"}
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
            {
              fields.map(field => {
                return (field.condition === undefined || field.condition) && (
                  <FormFields
                    key={field.id}
                    field={field}
                    validation={validation}
                  />
                );
              })
            }
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
              {!!isEdit ? " تحديث الإنتخابات" : "إضافة إنتخابات"}
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ElectionModal;

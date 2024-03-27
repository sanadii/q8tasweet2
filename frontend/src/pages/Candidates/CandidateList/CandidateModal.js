// React & Redux
import React from "react";
import { useDispatch } from "react-redux";
import { addNewCandidate, updateCandidate } from "store/actions";

// Custom Components & ConstantsImports
import { GenderOptions, PriorityOptions, StatusOptions } from "shared/constants";
import { FieldComponent } from "shared/components";

// UI & Utilities Components
import { Col, Row, Form, Modal, ModalHeader, ModalBody, Button } from "reactstrap";

// Form and Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";


const CandidateModal = ({ isEdit, setModal, modal, toggle, candidate }) => {
  const dispatch = useDispatch();

  const initialValues = {
    name: candidate?.name || "",
    image: candidate?.image || null, // Set to null if no image
    gender: candidate?.gender || 1,
    status: candidate?.status || 1,
    priority: candidate?.priority || 1,
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

      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      if (isEdit) {
        dispatch(updateCandidate(formData));
      } else {
        dispatch(addNewCandidate(formData));
      }

      // Reset form and selected image after dispatch
      validation.resetForm();
      toggle();
    },
  });

  const fieldGroup = [
    {
      fieldGroupTitle: "المرشح",
      rows: [
        {
          cols: [
            {
              fields: [
                {
                  id: "name-field",
                  name: "name",
                  label: "الاسم",
                  type: "text",
                  placeholder: "ادخل الاسم المرشح",
                  colSize: 12,
                },
                {
                  id: "gender-field",
                  name: "gender",
                  label: "النوع",
                  type: "select",
                  placeholder: "اختر النوع",
                  colSize: 12,
                  options: GenderOptions.map(gender => ({
                    id: gender.id,
                    label: gender.name,
                    value: gender.id
                  })),
                },
              ],
              colSize: 8,
            },
            {
              fields: [
                {
                  id: "image-field",
                  name: "image",
                  type: "image",
                  placeholder: "صورة المرشح",
                  colSize: 12,
                },
              ],
              colSize: 4,
            },
          ],
        },
      ],
    },
    {
      fieldGroupTitle: "الإدارة",
      rows: [
        {
          cols: [
            {
              fields: [
                {
                  id: "status-field",
                  name: "status",
                  label: "الحالة",
                  type: "select",
                  colSize: 6,
                  options: StatusOptions.map(status => ({
                    id: status.id,
                    label: status.name,
                    value: status.id
                  })),
                },
                {
                  id: "priority-field",
                  name: "priority",
                  label: "الأولية",
                  type: "select",
                  colSize: 6,
                  options: PriorityOptions.map(priority => ({
                    id: priority.id,
                    label: priority.name,
                    value: priority.id
                  })),
                },
              ],
              colSize: 12,
            },
          ],
        },
      ],
    },

  ];
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
        {!!isEdit ? "تحديث مرشح" : "إضافة مرشح"}
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
          {fieldGroup.map(group => (
            <div className="pb-3" key={group.fieldGroupTitle}>
              <h4><strong>{group.fieldGroupTitle}</strong></h4>
              {group.rows.map((row, rowIndex) => (
                <Row key={rowIndex}>
                  {row.cols.map((col, colIndex) => (
                    <Col md={col.colSize} key={colIndex}>
                      {col.fields.map(field => (
                        <FieldComponent field={field} validation={validation} key={field.id} />
                      ))}
                    </Col>
                  ))}
                </Row>
              ))}
            </div>
          ))}

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

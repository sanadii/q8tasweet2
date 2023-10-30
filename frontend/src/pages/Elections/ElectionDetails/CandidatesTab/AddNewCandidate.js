// React & Redux core imports
import React from "react";
import { useDispatch } from "react-redux";
import { addNewCandidate, updateCandidate } from "store/actions";

// Custom Components & ConstantsImports
import { GenderOptions, PriorityOptions, StatusOptions } from "Common/Constants";
import { FieldComponent } from "Common/Components";

// UI & Utilities Components
import { Col, Row } from "reactstrap";


// Form and Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

const AddNewCandidate = ({ election }) => {
    const dispatch = useDispatch();

    const initialValues = {
        name: "",
        image: null,
        gender: 1,
        status: 1,
        priority: 1,
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
            formData.append('name', values.name);
            formData.append('gender', values.gender);
            formData.append('status', values.status);
            formData.append('priority', values.priority);

            if (values.image instanceof File) {
                formData.append("image", values.image);
            }

            dispatch(addNewCandidate(formData));

            // Reset form and selected image after dispatch
            validation.resetForm();
            // toggle();
        },
    });

    const fieldGroup = [
        {
            fieldGroupTitle: "المرشح",
            fields: [
                {
                    id: "image-field",
                    name: "image",
                    type: "image",
                    placeholder: "صورة المرشح",
                    colSize: 12,
                },
                {
                    id: "name-field",
                    name: "name",
                    label: "الاسم",
                    type: "text",
                    placeholder: "ادخل الاسم المرشح",
                },
                {
                    id: "gender-field",
                    name: "gender",
                    label: "النوع",
                    type: "select",
                    placeholder: "اختر النوع",
                    options: GenderOptions.map(gender => ({
                        id: gender.id,
                        label: gender.name,
                        value: gender.id
                    })),
                },
            ],


        },
        {
            fieldGroupTitle: "الإدارة",
            fields: [
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
                },
            ],
        },
    ];

    return (
        <>
            {fieldGroup.map((group, groupIndex) => (
                <div className="pb-3" key={group.fieldGroupTitle + groupIndex}>
                    <h4><strong>{group.fieldGroupTitle}</strong></h4>
                    <Row>
                        {group.fields.map((field, fieldIndex) => (
                            <Col md={field.colSize} key={field.id + fieldIndex}>
                                <FieldComponent field={field} validation={validation} />
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </>
    );
};

export default AddNewCandidate;

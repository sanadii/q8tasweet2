// React & Redux core imports
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addParty, updateParty } from "store/actions";
import { electionSelector } from 'Selectors';

// Custom Components & ConstantsImports
import { GenderOptions, PriorityOptions, StatusOptions } from "constants";
import { FieldComponent } from "components";

// UI & Utilities Components
import { Col, Row, Form } from "reactstrap";


// Form and Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

const AddNewParty = () => {
    const dispatch = useDispatch();

    const { electionId } = useSelector(electionSelector);

    const initialValues = {
        name: "",
        image: null,
        status: 1,
        priority: 1,
    };

    const validation = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            name: Yup.string().required("Please Enter Party Name"),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append('election', electionId);
            formData.append('name', values.name);
            formData.append('status', values.status);
            formData.append('priority', values.priority);

            if (values.image instanceof File) {
                formData.append("image", values.image);
            }

            dispatch(addParty(formData));

            // Reset form and selected image after dispatch
            validation.resetForm();
            // toggle();
        },
    });

    const fields = [
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
    ];

    return (
        <Form
            onSubmit={e => {
                e.preventDefault();
                validation.handleSubmit();
            }}
        >
            <Row>
                {fields.map((field, fieldIndex) => (
                    <Col md={field.colSize} key={field.id + fieldIndex}>
                        <FieldComponent field={field} validation={validation} />
                    </Col>
                ))}
            </Row>
            <button type="submit" className="btn btn-success" id="add-btn">
                إضافة جديد
            </button>
        </Form>
    );
};

export default AddNewParty;

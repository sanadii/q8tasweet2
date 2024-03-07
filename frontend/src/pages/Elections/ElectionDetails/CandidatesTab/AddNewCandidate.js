// React & Redux core imports
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNewCandidate, updateCandidate } from "store/actions";
import { electionSelector } from 'Selectors';

// Custom Components & ConstantsImports
import { GenderOptions } from "shared/constants";
import { FieldComponent } from "shared/components";

// UI & Utilities Components
import { Col, Row, Form } from "reactstrap";

// Form and Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

const AddNewCandidate = () => {
    const dispatch = useDispatch();

    const { election, electionId, electionParties } = useSelector(electionSelector);

    const initialValues = {
        name: "",
        image: null,
        gender: 1,
        status: 1,
        priority: 1,
    };
    console.log("electionMethod: ", election.electionMethod)

    const validation = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            name: Yup.string().required("Please Enter Candidate Name"),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            if (election.electionMethod !== "candidateOnly") {
                formData.append('electionParty', values.electionParty);
            } else {
                formData.append('election', electionId);
            }

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
        {
            id: "party-field",
            name: "electionParty",
            type: "select",
            placeholder: "اختر القائمة الإنتخابية",
            options: [
                { id: "default", label: "-- اختر القائمة الانتخابية --", value: null },
                ...(Array.isArray(electionParties) ? electionParties
                    .filter(item => item && item.id) // Ensure that the item is defined and has an id property
                    .map((item) => ({
                        id: item.id,
                        label: item.name,
                        value: item.id,
                    }))
                    : [])
            ],
            colSize: 12,
        }

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

export default AddNewCandidate;

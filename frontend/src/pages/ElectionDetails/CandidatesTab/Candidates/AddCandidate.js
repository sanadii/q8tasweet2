// React & Redux core imports
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCandidate, updateCandidate } from "store/actions";
import { electionSelector } from 'selectors';

// Custom Components & ConstantsImports
import { FormFields } from "shared/components";
import { getFieldStaticOptions, getFieldDynamicOptions } from "shared/hooks";

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
    };

    const validation = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            name: Yup.string().required("Please Enter Candidate Name"),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('gender', values.gender);

            if (values.image instanceof File) {
                formData.append("image", values.image);
            }
            if (election.electionMethod !== "candidateOnly") {
                formData.append('election', electionId);

                // Conditionally append electionParty
                if (values.electionParty) {
                    formData.append('electionParty', values.electionParty);
                }
            }
            dispatch(addCandidate(formData));

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
            options: getFieldDynamicOptions(electionParties, "القوائم الانتخابية"),
            colSize: 12,
        },
        {
            id: "gender-field",
            name: "gender",
            label: "النوع",
            type: "select",
            placeholder: "اختر النوع",
            options: getFieldStaticOptions("GenderOptions"),
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
                        <FormFields field={field} validation={validation} />
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

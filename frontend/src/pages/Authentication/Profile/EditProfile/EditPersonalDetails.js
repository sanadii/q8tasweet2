// React & Redux imports
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { updateUser } from "store/actions";
import { userSelector } from 'Selectors';

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

// Reactstrap (UI) imports
import { Button, Row, Form } from "reactstrap";
import { FieldComponent } from "Common/Components";

const EditPersonalDetails = () => {
    const dispatch = useDispatch();
    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    // State Management
    const { user } = useSelector(userSelector);

    // Form validation and submission
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: (user && user.firstName) || "",
            lastName: (user && user.lastName) || "",
            email: (user && user.email) || "",
            phone: (user && user.phone) || "",
            description: (user && user.description) || "",
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
        }),

        onSubmit: (values) => {
            const updatedUserProfile = {
                id: user.id,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                description: values.description,
            };
            dispatch(updateUser(updatedUserProfile));
            // validation.resetForm();
        },
    });

    const userFormFields = [
        {
            id: "first-name-field",
            name: "firstName",
            label: "الاسم الأول",
            type: "text",
            placeholder: "ادخل الاسم الأول",
            colSize: 6,
        },
        {
            id: "last-name-field",
            name: "lastName",
            label: "اسم العائلة",
            type: "text",
            placeholder: "ادخل اسم العائلة",
            colSize: 6,
        },
        {
            id: "phone-field",
            name: "phone",
            label: "الهاتف",
            type: "tel",
            placeholder: "ادخل رقم الهاتف",
            colSize: 6,
        },
        {
            id: "email-field",
            name: "email",
            label: "البريد الالكتروني",
            type: "email",
            placeholder: "ادخل البريد الالكتروني",
            colSize: 6,
        },
        {
            id: "description-field",
            name: "description",
            label: "الوصف",
            type: "textarea",
            placeholder: "ادخل الوصف هنا",
            colSize: 12,
        },
    ];

    return (
        <React.Fragment>
            <Form
                className="tablelist-form"
                onSubmit={e => {
                    e.preventDefault();
                    validation.handleSubmit();
                }}
            >
                <Row>
                    {userFormFields.map(field => (
                        <FieldComponent
                            key={field.id}
                            field={field}
                            validation={validation}
                        />
                    ))}
                </Row>
                <Button type="submit">تحديث</Button>
            </Form>

        </React.Fragment>

    );
};



export default EditPersonalDetails;

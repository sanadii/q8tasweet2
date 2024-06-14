// React & Redux imports
import React, { useEffect } from "react";


// Shared
import { FormFields } from "shared/components";
import { GenderOptions } from "shared/constants"

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

// Reactstrap (UI) imports
import { Button, Row, Form } from "reactstrap";


const EditPersonalDetails = ({ validation }) => {
    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    // State Management

    const fieldGroup = [
        {
            fieldGroupTitle: "معلومات رئيسية",
            fields: [
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
            ]
        },
        {
            fieldGroupTitle: "معلومات إضافية",
            fields: [
                {
                    id: "civil-field",
                    name: "civil",
                    label: "الرقم المدني",
                    type: "text",
                    placeholder: "ادخل الرقم المدني",
                    colSize: 6,
                },
                {
                    id: "gender-field",
                    name: "gender",
                    label: "النوع",
                    type: "select",
                    placeholder: "اختر النوع",
                    colSize: 6,
                    options: GenderOptions.map(gender => ({
                        id: gender.id,
                        label: gender.name,
                        value: gender.id
                    })),

                },
                {
                    id: "date-of-birth-field",
                    name: "dateOfBirth",
                    label: "تاريخ الميلاد",
                    type: "date",
                    placeholder: "ادخل تاريخ الميلاد",
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
            ],
        },
    ];

    return (
        <React.Fragment >

            <Row>
                {fieldGroup.map(group => (
                    <div className="pb-3" key={group.fieldGroupTitle}>
                        <h4>
                            <strong>
                                {group.fieldGroupTitle}
                            </strong>
                        </h4>
                        <Row>
                            {group.fields.map(field => (
                                <FormFields
                                    key={field.id}
                                    field={field}
                                    validation={validation}
                                />
                            ))}
                        </Row>
                    </div>
                ))}
            </Row>
            <button type="submit" className="btn btn-primary">تحديث</button>
        </React.Fragment >

    );
};



export default EditPersonalDetails;

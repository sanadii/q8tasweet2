import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Button, Col, Form, Row } from 'reactstrap';
import { userSelector } from 'selectors';
import { FieldComponent } from "shared/components";
import { changeUserPassword } from "store/actions";
import { useFormik } from "formik";
import * as Yup from "yup";

const EditChangePassword = () => {
    const { user, error } = useSelector(userSelector);
    const dispatch = useDispatch();

    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('مطلوب'),
            newPassword: Yup.string().required('مطلوب').min(8, 'كلمة المرور قصيرة. يجب أن تتكون من 8 أحرف.'),
            confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'كلمة المرور غير مطابقة').required('مطلوب'),
        }),

        onSubmit: (values) => {
            const updatedUserPassword = {
                id: user.id,
                old_password: values.oldPassword,
                new_password: values.newPassword,
            };
            dispatch(changeUserPassword(updatedUserPassword));
        },
    });

    const passwordFields = [
        {
            id: "oldpasswordInput",
            name: "oldPassword",
            label: "كلمة المرور السابقة*",
            type: "password",
            placeholder: "ادخل كلمة المرور السابقة",
            colSize: 4,
        },
        {
            id: "newpasswordInput",
            name: "newPassword",
            label: "كلمة المرور الجديدة*",
            type: "password",
            placeholder: "ادخل كلمة المرور الجديدة",
            colSize: 4,
        },
        {
            id: "confirmpasswordInput",
            name: "confirmPassword",
            label: "تأكيد كلمة المرور*",
            type: "password",
            placeholder: "تأكيد كلمة المرور",
            colSize: 4,
        },
    ];
    return (
        <React.Fragment>
            <Form
                onSubmit={e => {
                    e.preventDefault();
                    validation.handleSubmit();
                }}
            >
                <Row className="mb-3">
                    {passwordFields.map(field => (
                        <FieldComponent
                            key={field.id}
                            field={field}
                            validation={validation}
                        />
                    ))}
                </Row>
                {error && <p className="text-danger">{error}</p>}

                <Button type="submit">Save Changes</Button>
            </Form>
        </React.Fragment>
    );
};

export default EditChangePassword;

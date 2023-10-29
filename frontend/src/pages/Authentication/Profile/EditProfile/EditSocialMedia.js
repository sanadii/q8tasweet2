import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Form, Row, Button } from 'reactstrap';
import { userSelector } from 'Selectors';
import { updateUser } from "store/actions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FieldComponent } from "Common/Components";

const EditSocialMedia = () => {
    const { user } = useSelector(userSelector);
    const dispatch = useDispatch();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            twitter: user.twitter || "",
            instagram: user.instagram || "",
        },
        onSubmit: (values) => {
            const updatedUser = {
                id: user.id,

                twitter: values.twitter,
                instagram: values.instagram,
            };
            dispatch(updateUser(updatedUser));
        },
    });

    const socialMediaFields = [
        {
            id: "twitter-field",
            name: "twitter",
            label: "تويتر",
            type: "social",
            colSize: 12,
            icon: "ri-twitter-fill",
            iconBg: "bg-info text-light",
        },
        {
            id: "instagram-field",
            name: "instagram",
            label: "انستقرام",
            type: "text",
            colSize: 12,
            icon: "ri-instagram-fill",
            iconBg: "bg-danger",
        },
    ];

    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h5 className="card-title mb-4">التواصل الاجتماعي</h5>
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            validation.handleSubmit();
                        }}
                    >
                        <div className="mb-3">
                            {socialMediaFields.map(field => (
                                <FieldComponent
                                    key={field.id}
                                    field={field}
                                    validation={validation}
                                />
                            ))}
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </Form>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default EditSocialMedia;

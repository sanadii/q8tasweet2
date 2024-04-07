import React from 'react';
import { Card, CardBody, Form } from 'reactstrap';

// Form and Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";
import { FieldComponent } from "shared/components";

const EditProfileImage = ({ user, validation }) => {

    const fields = [
        {
            id: "image-field",
            name: "image",
            type: "image",
            placeholder: "صورة المرشح",
            colSize: 12,
        },
    ]

    return (
        <React.Fragment>
            <Card>
                <CardBody className="p-4">
                    <div className="text-center">
                        <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                            <Form
                                className="tablelist-form"
                            >
                                {fields.map(field => (
                                    <FieldComponent field={field} validation={validation} key={field.id} />
                                ))}
                            </Form>
                        </div>
                        <h5 className="fs-16 mb-1">{user.fullName}</h5>
                        <p className="text-muted mb-0">{user.email}</p>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default EditProfileImage;

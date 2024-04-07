import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Form, Row, Button } from 'reactstrap';
import { FieldComponent } from "shared/components";

const EditSocialMedia = ({ validation }) => {

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
            type: "social",
            colSize: 12,
            icon: "ri-instagram-fill",
            iconBg: "bg-danger",
        },
    ];


    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h5 className="card-title mb-4">التواصل الاجتماعي</h5>
                    <div className="mb-3">
                        {socialMediaFields.map(field => (
                            <FieldComponent
                                key={field.id}
                                field={field}
                                validation={validation}
                            />
                        ))}
                    </div>
                    <button type="submit" className="btn btn-primary">تحديث</button>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default EditSocialMedia;

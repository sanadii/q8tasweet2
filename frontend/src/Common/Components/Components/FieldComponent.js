import React from "react";
import { Col, Label, Input, FormFeedback } from "reactstrap";

const FieldComponent = ({ field, validation }) => {
    const { id, label, name, type, colSize, icon, iconBg } = field;

    const renderInput = () => {
        switch (type) {
            case 'text':
            case 'tel':
            case 'email':
            case 'social':
                return (
                    <div className="d-flex">
                        {icon && (
                            <div className="avatar-xs d-block flex-shrink-0 me-3">
                                <span className={`avatar-title rounded-circle fs-16 ${iconBg}`}>
                                    <i className={icon}></i>
                                </span>
                            </div>
                        )}
                        <Input
                            type={type !== 'social' ? type : 'text'}
                            name={name}
                            id={id}
                            placeholder={`ادخل ${label}`}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values[name] || ""}
                            invalid={validation.touched[name] && validation.errors[name]}
                        />
                    </div>
                );
            case 'textarea':
                return (
                    <Input
                        type="textarea"
                        name={name}
                        id={id}
                        placeholder={`اكتب ${label}`}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values[name] || ""}
                        invalid={validation.touched[name] && validation.errors[name]}
                    />
                );
            case 'password':
                return (
                    <Input
                        type="password"
                        name={name}
                        id={id}
                        placeholder={`ادخل ${label}`}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values[name] || ""}
                        invalid={validation.touched[name] && validation.errors[name]}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Col lg={colSize} className="mb-3">
            {!icon &&
                <Label htmlFor={id} className="form-label">{label}</Label>
            }
            {renderInput()}
            {validation.touched[name] && validation.errors[name] && (
                <FormFeedback type="invalid">
                    {validation.errors[name]}
                </FormFeedback>
            )}
        </Col>
    );
};

export default FieldComponent;

import React from "react";
import { Col, Label, Input, FormFeedback } from "reactstrap";
import Flatpickr from "react-flatpickr";

const FieldComponent = ({ field, validation }) => {
    const { id, label, name, type, colSize, icon, iconBg, placeholder } = field;

    const dateformate = (e) => {
        const selectedDate = new Date(e);
        const formattedDate = `${selectedDate.getFullYear()}-${(
            "0" +
            (selectedDate.getMonth() + 1)
        ).slice(-2)}-${("0" + selectedDate.getDate()).slice(-2)}`;

        // Update the form field value directly with the formatted date
        validation.setFieldValue(name, formattedDate);
    };
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
            case 'select':
                return (
                    <Input
                        type="select"
                        className="form-select"
                        name={name}
                        id={id}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values[name] || ""}
                        invalid={validation.touched[name] && validation.errors[name]}
                    >
                        <option value="">-- اختر --</option>
                        {field.options &&
                            field.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                    </Input>
                );
            case 'date':
                return (
                    <Flatpickr
                        type="date"
                        name={name}
                        id={id}
                        className="form-control"
                        placeholder={placeholder}
                        options={{
                            altInput: true,
                            altFormat: "Y-m-d",
                            dateFormat: "Y-m-d",
                        }}
                        onChange={(e) => dateformate(e)}
                        // onChange={validation.handleChange}
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

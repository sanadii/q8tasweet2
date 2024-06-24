import React from "react";
import { Input } from "reactstrap";

const FormTextField = ({ field, validation }) => {
    const { id, label, name, type, icon, iconBg } = field;

    const renderTextFieldInput = () => (
        <Input
            type={type !== 'social' ? type : 'text'}
            name={name}
            id={id}
            placeholder={label}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values[name] || ""}
            invalid={validation.touched[name] && validation.errors[name]}
        />
    );

    return icon ? (
        <div className="d-flex align-items-center">
            <div className="avatar-xs d-block flex-shrink-0 me-3">
                <span className={`avatar-title rounded-circle fs-16 ${iconBg}`}>
                    <i className={icon}></i>
                </span>
            </div>
            {renderTextFieldInput()}
        </div>
    ) : (
        renderTextFieldInput()
    );
};

export { FormTextField };

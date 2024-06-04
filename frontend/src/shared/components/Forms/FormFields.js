import React, { useState, useEffect } from "react";
import { Col, Label, Input, FormFeedback } from "reactstrap";
import Flatpickr from "react-flatpickr";
import defaultAvatar from 'assets/images/users/default.jpg';
import { api } from "config";

import SearchDropDown from "./SearchDropDown";
import SelectField from "./SelectField";

import FormStructureRenderer from "./FormStructureRenderer";
import { FormTextField } from "./FormTextField"

const mediaUrl = api?.MEDIA_URL?.endsWith('/') ? api.MEDIA_URL : `${api.MEDIA_URL}`; // Ensure mediaUrl ends with '/'

const FormFields = ({ field, validation, formStructure, formStyle }) => {
    const { id, label, name, type, colSize, icon, iconBg, onChange, prefix, suffix } = field;
    const imageValue = validation.values.image;
    const [imageSrc, setImageSrc] = useState(defaultAvatar);


    const onChangeHandler = (onChange && onChange) || validation.handleChange;


    useEffect(() => {
        if (imageValue) {
            if (typeof imageValue === 'string') {
                if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
                    // If the URL is absolute, use it as is
                    setImageSrc(imageValue);
                } else {
                    // If the URL is relative, prepend the media URL
                    setImageSrc(`${mediaUrl}${imageValue}`);
                }
            } else if (imageValue instanceof File) {
                // If imageValue is a File object
                const objectUrl = URL.createObjectURL(imageValue);
                setImageSrc(objectUrl);
            }
        } else {
            setImageSrc(defaultAvatar);
        }
    }, [imageValue]);

    const handleImageSelect = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            validation.setFieldValue("image", selectedImage);
        }
    };

    const dateformate = (e) => {
        const selectedDate = new Date(e);
        const formattedDate = `${selectedDate.getFullYear()}-${(
            "0" +
            (selectedDate.getMonth() + 1)
        ).slice(-2)}-${("0" + selectedDate.getDate()).slice(-2)}`;

        // Update the form field value directly with the formatted date
        validation.setFieldValue(name, formattedDate);
    };


    const renderInputFields = () => {
        switch (type) {
            case 'text':
            case 'tel':
            case 'email':
            case 'social':
                return (<FormTextField field={field} validation={validation} />);
            case 'number':
                return (
                    <Input
                        type="number"
                        id={id}
                        name={name}
                        placeholder={label}
                        value={validation.values[name] || 0}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={validation.touched[name] && validation.errors[name]}
                    ></Input>
                )
            case 'checkBox':
                return (
                    <div className="form-check form-check-success mb-3">
                        <Input
                            className="form-check-input"
                            type="checkbox"
                            id={id}
                            name={name}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            checked={validation.values[name] || false}
                            invalid={validation.touched[name] && validation.errors[name]}
                        />
                        <Label className="form-check-label" for={id}>
                            {label}
                        </Label>
                    </div>
                );

            case 'textarea':
                return (
                    <Input
                        type="textarea"
                        name={name}
                        id={id}
                        placeholder={label}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values[name] || ""}
                        invalid={validation.touched[name] && validation.errors[name]}
                    />
                );
            case "image":
                return (
                    <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                        <img
                            src={imageSrc}
                            className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                            alt="user-profile"
                        />
                        <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                            <Input
                                id={id}
                                name={name}
                                type="file"
                                className="profile-img-file-input"
                                accept="image/png, image/gif, image/jpeg"
                                onChange={handleImageSelect}
                                onBlur={validation.handleBlur}
                                invalid={validation.touched[name] && validation.errors[name] ? true : undefined}
                            />
                            <Label htmlFor={id} className="profile-photo-edit avatar-xs">
                                <span className="avatar-title rounded-circle bg-light text-body">
                                    <i className="ri-camera-fill"></i>
                                </span>
                            </Label>
                        </div>
                        {validation.touched[name] && validation.errors[name] && (
                            <FormFeedback type="invalid">
                                {validation.errors[name]}
                            </FormFeedback>
                        )}
                    </div>
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
                        {/* <option value="">-- اختر --</option> */}
                        {field.options &&
                            field.options.map((option) => (
                                <option
                                    key={option.id}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                    </Input>
                );

            case 'selectSingle':
            case 'selectMulti':
                return <SelectField validation={validation} field={field} onChangeHandler={onChangeHandler} />

            case "searchDropdown":
                return <SearchDropDown validation={validation} field={field} onChangeHandler={onChangeHandler} />;

            default:
                return null;
        }
    };



    return (
        <React.Fragment>
            {/* <Col lg={colSize} className="input-group input-group-sm"> */}
            <Col lg={colSize} >
                {generatePrefixSuffix(prefix)}

                <FormStructureRenderer
                    formStructure={formStructure} // Pass the formStructure prop
                    renderInputFields={renderInputFields} // Pass the renderInputFields function
                    validation={validation} // Pass the validation prop
                    // colSize={colSize} // Pass any other props you need
                    type={type}
                    icon={icon}
                    id={id}
                    label={label}
                    name={name}
                // formStyle={formStyle}
                />
                {suffix && <span className="input-group-text">{suffix.text}</span>}
            </Col>
        </React.Fragment>


        // <Col lg={colSize} className="mb-3">
        //     {!icon &&
        //         <Label htmlFor={id} className="form-label">{label}</Label>
        //     }
        //     {renderInputFields()}
        //     {validation.touched[name] && validation.errors[name] && (
        //         <FormFeedback type="invalid">
        //             {validation.errors[name]}
        //         </FormFeedback>
        //     )}
        // </Col>
    );
};

const generatePrefixSuffix = (prefix) => {
    if (!prefix) return null;

    if (prefix.type === "icon") {
        return (
            <div className="avatar-xs d-block flex-shrink-0 me-3">
                <span className={`avatar-title rounded-circle fs-16 ${prefix.iconBg}`}>
                    <i className={prefix.icon}></i>
                </span>
            </div>
        );
    } else if (prefix.type === "text") {
        return <span className="input-group-text">{prefix.text}</span>;
    }

    return null;
};

export default FormFields;

import React, { useState, useEffect } from "react";
import { Col, Label, Input, FormFeedback } from "reactstrap";
import Flatpickr from "react-flatpickr";
import defaultAvatar from 'assets/images/users/default.jpg';
import { api } from "config";
const mediaUrl = api.MEDIA_URL.endsWith('/') ? api.MEDIA_URL : `${api.MEDIA_URL}`; // Ensure mediaUrl ends with '/'



const FieldComponent = ({ field, validation }) => {
    const { id, label, name, type, colSize, icon, iconBg } = field;
    const imageValue = validation.values.image;

    const [imageSrc, setImageSrc] = useState(defaultAvatar);

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
                        {/* <option value="">-- اختر --</option> */}
                        {field.options &&
                            field.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                    </Input>
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
            // ... other cases
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

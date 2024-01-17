import React, { useState, useEffect } from "react";
import { Row, Col, Label, Input, FormFeedback } from "reactstrap";
import Flatpickr from "react-flatpickr";
import defaultAvatar from 'assets/images/users/default.jpg';
import { api } from "config";
const mediaUrl = api.MEDIA_URL.endsWith('/') ? api.MEDIA_URL : `${api.MEDIA_URL}`; // Ensure mediaUrl ends with '/'



const FormFields = ({ field, validation, inLineStyle }) => {
    const { id, label, name, type, colSize, icon, iconBg } = field;
    const imageValue = validation.values.image;
    const [imageSrc, setImageSrc] = useState(defaultAvatar);
    const [passwordShow, setPasswordShow] = useState(false);

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

    //Dropzone file upload
    const [selectedFiles, setselectedFiles] = useState([]);
    const [files, setFiles] = useState([]);

    const handleAcceptedFiles = (files) => {
        files.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        );
        setselectedFiles(files);
    };

    // Formats the size
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };


    const renderInput = () => {
        switch (type) {
            case 'seperator':
                return <hr />;
            case 'title':
                return <h4>{label}</h4>;

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
                            className="form-control"
                            placeholder={`ادخل ${label}`}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values[name] || ""}
                            invalid={validation.touched[name] && validation.errors[name]}
                        />
                    </div>
                );
            case 'number':
                return (
                    <Input
                        type="number"
                        id={id}
                        name={name}
                        placeholder={`اكتب ${label}`}
                        value={validation.values[name] || 0}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                    ></Input>
                )
            case 'textarea':
                return (
                    <Input
                        type="textarea"
                        id={id}
                        name={name}
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
                        className="form-control"
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
            case 'password':
                return (
                    <div className="position-relative auth-pass-inputgroup mb-3">

                        <Input
                            type={passwordShow ? "text" : "password"}
                            name={name}
                            className="form-control pe-5"

                            id={id}
                            placeholder={`ادخل ${label}`}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values[name] || ""}
                            invalid={validation.touched[name] && validation.errors[name]}
                        />
                        <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                            type="button"
                            id="password-addon"
                            onClick={() => setPasswordShow(!passwordShow)}
                        >
                            {" "}
                            <i className="ri-eye-fill align-middle"></i>{" "}
                        </button>

                    </div>
                );
            case 'date':
                return (
                    <Flatpickr
                        name={name}
                        id={id}
                        className="form-control"
                        placeholder={`اختر ${label}`}
                        options={{
                            altInput: true,
                            altFormat: "Y-m-d",
                            dateFormat: "Y-m-d",
                        }}
                        onChange={(e) => dateformate(e)}
                        value={validation.values.dueDate || ""}
                    />
                );
            // ... other cases
            default:
                return null;
        }
    };
    return (
        <FormFieldLayout inLineStyle={inLineStyle} label={label} id={id} colSize={colSize} type={type}>
            {renderInput()}
            {type !== 'separator' && type !== 'title' && validation.touched[name] && validation.errors[name] && (
                <FormFeedback type="invalid">
                    {validation.errors[name]}
                </FormFeedback>
            )}
        </FormFieldLayout>
    );

};

const FormFieldLayout = ({ inLineStyle, label, id, children, colSize, type }) => {
    if (type === 'separator' || type === 'title') {
        return <>{children}</>;
    }

    return inLineStyle ? (
        <Row key={id} className="mb-3">
            <Col lg={3} className="align-self-center">
                <Label htmlFor={id} className="form-label">{label}</Label>
            </Col>
            <Col lg={9}>
                {children}
            </Col>
        </Row>
    ) : (
        <Col lg={colSize} className="mb-3">
            <Label htmlFor={id} className="form-label">{label}</Label>
            {children}
        </Col>
    );
};


export default FormFields;

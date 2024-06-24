// React, Redux & Store imports
import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getElectorsBySearch } from "store/actions";

// Reactstrap (UI) imports
import { Col, Row, Button, ButtonGroup, Form } from "reactstrap";

// Form
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormFields } from "shared/components";

const ElectorSearchForm = ({ electionSchema }) => {
    const dispatch = useDispatch();
    const [searchType, setSearchType] = useState("searchById");

    const validationSchema = Yup.object().shape({
        id: Yup.string().when('searchType', {
            is: "searchById",
            then: Yup.string().required("Please Enter ID"),
            otherwise: Yup.string().notRequired(),
        }),
        fullName: Yup.string().when('searchType', {
            is: "searchByName",
            then: Yup.string().required("Please Enter Name"),
            otherwise: Yup.string().notRequired(),
        }),
    });

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: null,
            fullName: "",
        },
        validationSchema: Yup.object({
            // firstName: Yup.string().required("Please Enter First Name"),
        }),
        onSubmit: (values) => {
            const searchParameters = {
                schema: electionSchema,
                searchType: searchType,
                ...((searchType === "searchById") ? {
                    id: values.id || null,
                } : {
                    fullName: values.fullName || "",

                })
            };

            dispatch(getElectorsBySearch(searchParameters));
        },
    });

    const idField = [
        {
            id: "id-field",
            name: "id",
            // label: "الرقم",
            type: "text",
            placeholder: "ادخل الرقم",
            colSize: "12",
        },
    ];

    const nameField = [
        {
            id: "full-name-field",
            name: "fullName",
            // label: "الاسم الكامل",
            type: "text",
            placeholder: "ادخل الاسم",
            colSize: "12",
        },
    ];

    const fieldsToDisplay = searchType === "searchById" ? idField : nameField;

    const searchButtons = useMemo(() => [
        {
            icon: "mdi mdi-account-search",
            text: "بحث بالرقم",
            isActive: searchType === "searchById",
            onClick: () => setSearchType("searchById"),
        },
        {
            icon: "mdi mdi-account-search",
            text: "بحث بالاسم",
            isActive: searchType === "searchByName",
            onClick: () => setSearchType("searchByName"),
        },
    ], [searchType]);

    const renderButtonGroup = (buttonConfigs, color) => (
        <ButtonGroup className="pb-1 pe-2">
            {buttonConfigs.map((btn, index) => (
                <Button
                    key={index}
                    className={`btn-label btn-sm material-shadow-none ${btn.isActive ? `bg-${color}` : `bg-light text-${color}`}`}
                    onClick={btn.onClick}
                    active={btn.isActive}
                >
                    <i className={`${btn.icon} label-icon align-middle fs-16 me-2`}></i>
                    {btn.text}
                </Button>
            ))}
        </ButtonGroup>
    );

    return (
        <React.Fragment>
            <Form
                className="tablelist-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                }}
            >
                <Row className="mb-2 bg-light p-2">
                <Col lg={12}>
                        {renderButtonGroup(searchButtons, 'danger')}
                    </Col>
                    <Col lg={4}>
                        <div>
                            <Row>
                                {fieldsToDisplay.map((field) => (
                                    <FormFields
                                        key={field.id}
                                        field={field}
                                        validation={validation}
                                    />
                                ))}
                            </Row>
                        </div>
                    </Col>
                    <Col lg={2}>
                        <button type="submit" className="btn btn-primary w-100">
                            إبحث
                        </button>
                    </Col>   
                </Row>
            </Form>
        </React.Fragment>
    );
};

export default ElectorSearchForm;

// React, Redux & Store imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getElectorsBySearch } from "store/actions";
import { Loader, TableContainer } from "shared/components";
import { electionSelector, campaignSelector, electorSelector } from 'selectors';
import { getGenderOptions, } from "shared/constants";
import { getAreaOptions, getCommitteeSitesOptions } from "shared/constants";

// Component imports
import ElectorsModal from "./ElectorsModal";

// Reactstrap (UI) imports
import { Col, Row, Button, ButtonGroup, Form } from "reactstrap";

// Form
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormFields } from "shared/components";
import { getSelectionOptions } from "shared/hooks";

const ElectorSearchForm = ({ electionSchema }) => {
    const dispatch = useDispatch();

    const { electionAreas, electionCommitteeSites } = useSelector(electionSelector)

    const [searchElectorInput, setSearchElectorInput] = useState("");
    const [searchType, setSearchType] = useState("simple");
    const [isAdvancedCommitteeSearch, setIsAdvancedCommitteeSearch] = useState(false);

    const handleSearch = (event) => {
        event.preventDefault();
        const searchParameters = {
            searchInput: searchElectorInput,
        };
        dispatch(getElectorsBySearch(searchParameters));
    };


    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {

            // Simple Search
            // (searchType)
            firstName: "",
            lastName: "",
            phone: "",

            // Advance Search
        },
        validationSchema: Yup.object({
            // firstName: Yup.string().required("Please Enter First Name"),
        }),
        onSubmit: (values) => {
            const newElectorSearch = {
                // id: user ? user.id : 0,  // Uncommented, adjust based on necessity
                schema: electionSchema,
                searchType: searchType,
                ...((searchType === "advanced") ? {
                    firstName: values.firstName || "",
                    secondName: values.secondName || "",
                    thirdName: values.thirdName || "",
                    lastName: values.lastName || "",
                    branch: values.branch || "",
                    family: values.family || "",
                    area: values.area || "",
                    block: values.block || "",
                    street: values.street || "",
                    house: values.house || "",
                    age: values.age || "",
                    votted22: values.votted22 || "",
                    votted23: values.votted23 || "",
                    votted24: values.votted24 || "",
                } : {
                    fullName: values.name || "",
                    family: values.family || "",
                    area: values.area || "",  // Convert area to string
                })
            };

            // Dispatch the search action with the updated user info
            dispatch(getElectorsBySearch(newElectorSearch));
        },
    });

    const fields = [
        {
            id: "name-field",
            name: "name",
            label: "الاسم ",
            type: "text",
            placeholder: "ادخل الاسم",
            colSize: "4",
        },
        {
            id: "family-field",
            name: "family",
            label: "العائلة ",
            type: "text",
            placeholder: "العائلة",
            colSize: "4",
        },
        {
            id: "area-field",
            name: "area",
            label: "المنطقة",
            type: "select",
            options: getSelectionOptions(electionAreas),
            colSize: "4",
        },
    ];

    const advancedFields = [
        {
            id: "first-name-field",
            name: "firstName",
            label: "الاسم الأول",
            type: "text",
            placeholder: "الاسم الأول",
            colSize: "2",
        },
        {
            id: "second-name-field",
            name: "secondName",
            label: "الاسم الثاني",
            type: "text",
            placeholder: "الاسم الثاني",
            colSize: "2",
        },
        {
            id: "third-name-field",
            name: "thirdName",
            label: "الاسم الثالث",
            type: "text",
            placeholder: "الاسم الثالث",
            colSize: "2",
        },
        {
            id: "branch-name-field",
            name: "lastName",
            label: "الفخذ",
            type: "text",
            placeholder: "اسم العائلة",
            colSize: "3",
        },
        {
            id: "family-name-field",
            name: "lastName",
            label: "العائلة / القبيلة",
            type: "text",
            placeholder: "اسم العائلة",
            colSize: "3",
        },
        {
            id: "area-field",
            name: "area",
            label: "المنطقة",
            type: "select",
            options: getSelectionOptions(electionAreas),
            colSize: "2",
        },
        {
            id: "block-field",
            name: "block",
            label: "القطعة",
            type: "text",
            placeholder: "القطعة",
            colSize: "2",
        },
        {
            id: "street-field",
            name: "street",
            label: "الشارع",
            type: "text",
            placeholder: "الشارع",
            colSize: "2",
        },
        {
            id: "house-field",
            name: "house",
            label: "المنزل",
            type: "text",
            placeholder: "المنزل",
            colSize: "2",
        },
        {
            id: "age-field",
            name: "age",
            label: "العمر",
            type: "number",
            placeholder: "العمر",
            colSize: "2",
        },
    ];


    const vottingStatusFields = [
        {
            id: "voted22-field",
            name: "voted22",
            label: "صوت 2023؟",
            type: "checkBox",
            colSize: "2",
        },
        {
            id: "voted23-field",
            name: "voted23",
            label: "صوت 2023؟",
            type: "checkBox",
            colSize: "2",
        },
        {
            id: "voted24-field",
            name: "voted24",
            label: "صوت 2024؟",
            type: "checkBox",
            colSize: "2",
        },
    ];


    const renderButtonGroup = (buttonConfigs, color) => (
        <ButtonGroup className="pb-1 pe-2">
            {buttonConfigs.map((btn, index) => (
                <Button
                    key={index}
                    className={`${btn.text ? "btn-label" : "btn-icon"} btn-sm material-shadow-none ${btn.isActive ? `bg-${color} ` : `bg-light text-${color}`}`}
                    onClick={btn.onClick}
                    active={btn.isActive}
                >
                    {btn.text ?
                        <>
                            <i className={`${btn.icon} label-icon align-middle fs-16 me-2`}></i>
                            {btn.text}
                        </>
                        :
                        <i className={`${btn.icon} label-icon align-middle fs-16`}></i>

                    }
                </Button>
            ))}
        </ButtonGroup>
    );

    const advancedSearchButtons = useMemo(() => [
        {
            icon: "mdi mdi-account-search",
            color: "soft-danger",
            text: "بحث سريع",
            isActive: searchType === "simple",
            onClick: () => setSearchType("simple"), // Change to a function that sets the state
        },
        {
            icon: "mdi mdi-account-search",
            color: "soft-secondary",
            text: "بحث متقدم",
            isActive: searchType === "advanced",
            onClick: () => setSearchType("advanced") // Change to a function that sets the state
        },
    ], [searchType]);

    const advancedCommitteeSearchButtons = useMemo(() => [
        {
            icon: "mdi mdi-home-group",
            color: "soft-danger",
            text: "مناطق",
            isActive: !isAdvancedCommitteeSearch,
            onClick: () => setIsAdvancedCommitteeSearch(false), // Change to a function that sets the state
        },
        {
            icon: "mdi mdi-office-building-marker",
            color: "soft-secondary",
            text: "لجان",
            isActive: isAdvancedCommitteeSearch,
            onClick: () => setIsAdvancedCommitteeSearch(true) // Change to a function that sets the state
        },
    ], [isAdvancedCommitteeSearch]);


    const fieldsToDisplay = (searchType === "advanced" ? advancedFields : fields)
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
                    <Col lg={10}>
                        <div >
                            <Row>
                                {fieldsToDisplay.map((field) => (
                                    // Render all fields except the password field

                                    <FormFields
                                        key={field.id}
                                        field={field}
                                        validation={validation}
                                    />
                                ))}
                            </Row>
                            <Row>
                                {vottingStatusFields.map((field) => (
                                    <FormFields
                                        key={field.id}
                                        field={field}
                                        validation={validation}
                                        formStructure="inline"
                                    />
                                ))}
                            </Row>
                        </div>
                    </Col>
                    <Col lg={2}>
                        {renderButtonGroup(advancedSearchButtons, 'danger')}
                        {searchType && renderButtonGroup(advancedCommitteeSearchButtons, 'info')}
                        <button type="submit" className="btn btn-primary w-100">
                            إبحث
                        </button>
                    </Col>
                </Row>
            </Form>
            <div className="mb-2">



                {/* <Row className="mb-3">
                    <div className="d-flex align-items-center ">
                        <div className="col d-flex g-2 row">
                            <Col xxl={3} md={6}>
                                <Input
                                    type="text"
                                    value={searchElectorInput}
                                    onChange={(e) =>
                                        setSearchElectorInput(e.target.value)
                                    }
                                    placeholder="Search by Civil ID or Name..."
                                />
                            </Col>
                            <Col xxl={3} md={6}>
                                <button type="submit" className="btn btn-primary">
                                    إبحث
                                </button>
                            </Col>
                        </div>
                    </div>
                </Row> */}


            </div>

        </React.Fragment>
    )

};

export default ElectorSearchForm
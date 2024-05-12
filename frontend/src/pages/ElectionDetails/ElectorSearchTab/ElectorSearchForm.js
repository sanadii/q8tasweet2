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
import { Id, Name, Actions } from "./ElectorsCol";

// Reactstrap (UI) imports
import { Col, Row, Button, ButtonGroup, Form } from "reactstrap";

// Form
import * as Yup from "yup";
import { useFormik } from "formik";
import { FieldComponent } from "shared/components";
import { getSelectionOptions } from "shared/hooks";

const ElectorSearchForm = () => {
    const dispatch = useDispatch();

    const { electionSlug, electionAreas, electionCommitteeSites } = useSelector(electionSelector)
    const [searchElectorInput, setSearchElectorInput] = useState("");
    const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
    const [isAdvancedCommitteeSearch, setIsAdvancedCommitteeSearch] = useState(false);

    console.log("isAdvancedSearch: ", isAdvancedSearch)
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
            // (isAdvancedSearch)
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
                schema: electionSlug,
                simpleSearch: {  // Corrected typo
                    name: values.name || "",
                    area: values.area || "",
                }
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
        // {
        //     id: "gender-field",
        //     name: "gender",
        //     label: "النوع",
        //     type: "select",
        //     options: getGenderOptions(),
        //     colSize: "4",
        // },
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
            placeholder: "رقم المنزل",
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
        {
            id: "previously-voted-field",
            name: "previouslyVoted",
            label: "صوت من قبل؟",
            type: "select",
            options: [{ value: "yes", label: "نعم" }, { value: "no", label: "لا" }],
            colSize: "2",
        },
        {
            id: "currently-voted-field",
            name: "currentlyVoted",
            label: "صوت حاليًا؟",
            type: "select",
            options: [{ value: "yes", label: "نعم" }, { value: "no", label: "لا" }],
            colSize: "2",
        },
    ];

    const renderButtonGroup = (buttonConfigs, color) => (
        <ButtonGroup className="w-100 pb-1">
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
            isActive: !isAdvancedSearch,
            onClick: () => setIsAdvancedSearch(false), // Change to a function that sets the state
        },
        {
            icon: "mdi mdi-account-search",
            color: "soft-secondary",
            text: "بحث متقدم",
            isActive: isAdvancedSearch,
            onClick: () => setIsAdvancedSearch(true) // Change to a function that sets the state
        },
    ], [isAdvancedSearch]);

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


    const fieldsToDisplay = (isAdvancedSearch ? advancedFields : fields)
    return (
        <React.Fragment>
            <Row className="mb-2 d-flex g-2">
                <Col lg={6}>
                    {renderButtonGroup(advancedSearchButtons, 'danger')}

                </Col>
                <Col lg={6}>
                    {isAdvancedSearch &&
                        renderButtonGroup(advancedCommitteeSearchButtons, 'info')
                    }
                </Col>
            </Row>
            <div className="mb-2">
                <Form
                    className="tablelist-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}
                >
                    <div className="mb-2">
                        <Row>
                            {fieldsToDisplay.map((field) => (
                                // Render all fields except the password field

                                <FieldComponent
                                    key={field.id}
                                    field={field}
                                    validation={validation}
                                />

                            ))}
                        </Row>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        إبحث
                    </button>
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
                </Form>

            </div>

        </React.Fragment>
    )

};

export default ElectorSearchForm
import React, { useEffect, useState, useRef } from 'react';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from 'selectors';
import { updateUser, uploadNewImage, getCurrentUser } from "store/actions";

// Form and Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

// Component
import EditProfileImage from "./EditProfileImage"
import EditCompleteProfile from "./EditCompleteProfile"
import EditSocialMedia from "./EditSocialMedia"

// Reactstrap & Styles
import { Card, CardBody, CardHeader, Form, Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from 'reactstrap';
import classnames from "classnames";

// Tabs
import EditPersonalDetails from "./EditPersonalDetails"
import EditChangePassword from "./EditChangePassword"
import EditExperience from "./EditExperience"
import EditPrivacyPolicy from "./EditPrivacyPolicy"

const ProfileEdit = () => {
    document.title = "Profile | Q8Tasweet - React Admin & Dashboard Template";
    const dispatch = useDispatch();
    const { user } = useSelector(userSelector);
    const [activeTab, setActiveTab] = useState("1");


    useEffect(() => {
        if (!user || user?.length === 0) {
            dispatch(getCurrentUser());
        }
    }, [dispatch, user]);

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            image: user?.image || null,
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phone: user?.phone || "",
            email: user?.email || "",
            description: user?.description || "",
            civil: user?.civil || null,
            gender: user?.gender || null,
            dateOfBirth: user?.dateOfBirth || null,

            // Social Media
            instagram: user?.instagram || "",
            twitter: user?.twitter || "",

        },
        validationSchema: Yup.object({
            // Basic Info
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            civil: Yup.string().matches(/^[0-9]+$/, "Must be only digits").min(12, 'Must be exactly 12 digits').max(12, 'Must be exactly 12 digits').required('Required'),
            phone: Yup.string().matches(/^[0-9]+$/, "Must be only digits").min(8, 'Must be exactly 8 digits').required('Required'),

            image: Yup.mixed().required("Image is required"),
        }),
        onSubmit: (values) => {
            const formData = new FormData();

            // Basics
            formData.append('firstName', values.firstName);
            formData.append('lastName', values.lastName);
            formData.append('phone', values.phone);
            formData.append('email', values.email);
            formData.append('description', values.description);
            formData.append('civil', values.civil);
            formData.append('gender', values.gender);
            formData.append('dateOfBirth', values.dateOfBirth);

            // Social Media
            formData.append('instagram', values.instagram);
            formData.append('twitter', values.twitter);

            if (values.image instanceof File) {
                formData.append("image", values.image);
            }
            dispatch(updateUser(formData));
            validation.resetForm();
        },
    });


    const editProfileTabs = [
        {
            id: "1",
            title: "الملف الشخصي",
            icon: "fas fa-home",
            Component: EditPersonalDetails,
            props: { validation: validation },
        },
        {
            id: "2",
            title: "تغيير كلمة المرور",
            icon: "far fa-user",
            Component: EditChangePassword,
            // props: { user: user, updatedUserProfile: updatedUserProfile },
        },
        // { id: "3", title: "Experience", icon: "far fa-envelope", Component: EditExperience },
        // { id: "4", title: "Privacy Policy", icon: "far fa-envelope", Component: EditPrivacyPolicy },
    ];
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

                <Row>
                    <Col xxl={3}>
                        <EditProfileImage
                            user={user}
                            validation={validation}
                        />
                        {/* <EditCompleteProfile /> */}
                        <EditSocialMedia validation={validation} />
                    </Col>
                    <Col xxl={9}>
                        <Card>
                            <CardHeader>
                                <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                                    {editProfileTabs.map((tab) => (
                                        <NavItem key={tab.id}>
                                            <NavLink
                                                className={classnames({ active: activeTab === tab.id })}
                                                onClick={() => tabChange(tab.id)}
                                                type="button"
                                            >
                                                <i className={tab.icon}></i>
                                                {tab.title}
                                            </NavLink>
                                        </NavItem>
                                    ))}
                                </Nav>
                            </CardHeader>
                            <CardBody className="p-4">
                                <TabContent activeTab={activeTab}>
                                    {editProfileTabs.map((tab) => (
                                        <TabPane tabId={tab.id} key={tab.id}>
                                            <tab.Component {...tab.props} />
                                        </TabPane>
                                    ))}
                                </TabContent>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                            <button type="submit" className="btn btn-primary">تحديث</button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </React.Fragment >
    );
};

export default ProfileEdit;
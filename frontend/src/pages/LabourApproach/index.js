// React & Redux core
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// Store & Selectors
import { registerUser, apiError, resetRegisterFlag } from "store/actions";

// Assets & components 
import logoLight from "assets/images/logo-light.png";
import { FormFields } from "components";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";


// UI, Styles & Notifications
import { Row, Col, CardBody, Card, Alert, Container, Form } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";


const LabourApproach = () => {
    const history = useNavigate();
    const dispatch = useDispatch();

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            kocNumber: '',
            mobile: '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .required('الرجاء إدخال رقم العضوية'),

                mobile: Yup.string()
                .required('الرجاء إدخال رقم الهاتف'),

        }),
        onSubmit: (values) => {
            // dispatch(registerUser(values));
        }
    });

    const { error, registrationError, success } = useSelector(state => ({
        registrationError: state.Account.registrationError,
        success: state.Account.success,
        error: state.Account.error
    }));

    useEffect(() => {
        dispatch(apiError(""));
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setTimeout(() => history("/login"), 3000);
        }

        setTimeout(() => {
            dispatch(resetRegisterFlag());
        }, 3000);

    }, [dispatch, success, error, history]);


    const fields = [
        {
            id: "koc-number-field",
            name: "kocNumber",
            label: "رقم العضوية",
            type: "number",
        },
        {
            id: "mobile-field",
            name: "mobile",
            label: "رقم الهاتف",
            type: "number",
        },
    ]

    document.title = "حضور الجمعية العمومية الغير عادية لنقابة شركة النفط";

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="20" />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-15 fw-medium">النهج العمالي - حضور الجمعية العمومية الغير عادية لنقابة شركة النفط</p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">

                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">تأكيد الحضور</h5>
                                            <p className="text-muted">حضور الجمعية العمومية الغير عادية لنقابة شركة النفط</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                className="needs-validation" action="#">

                                                {success && success ? (
                                                    <>
                                                        {toast("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                                                        <ToastContainer autoClose={2000} limit={1} />
                                                        <Alert color="success">
                                                            تم تسجيل المستخدم بنجاح وسيتم توجيهك إلى صفحة تسجيل الدخول...
                                                        </Alert>
                                                    </>
                                                ) : null}

                                                {error && error ? (
                                                    <Alert color="danger">
                                                        <div>
                                                            تم تسجيل هذا البريد الإلكتروني مسبقًا، يرجى استخدام عنوان بريد إلكتروني آخر...
                                                        </div>
                                                    </Alert>
                                                ) : null}

                                                {
                                                    fields.map(field => {
                                                        return (field.condition === undefined || field.condition) && (
                                                            <FormFields
                                                                key={field.id}
                                                                field={field}
                                                                validation={validation}
                                                                inLineStyle={true}
                                                            />
                                                        );
                                                    })
                                                }

                                                <div className="mt-4">
                                                    <button className="btn btn-success w-100" type="submit">متابعة</button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center ">
                                    <p className="mb-0">Already have an account ? <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default LabourApproach;


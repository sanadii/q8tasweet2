// React & Redux core
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// Store & Selectors
import { registerUser, apiError, resetRegisterFlag } from "store/actions";

// Assets & components 
import logoLight from "assets/images/logo-light.png";
import { FormFields } from "shared/components";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";


// UI, Styles & Notifications
import { Row, Col, CardBody, Card, Alert, Container, Form, Spinner } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { useProfile } from "shared/hooks";


const Register = () => {
    document.title = "إنشاء حساب جديد | كويت تصويت";// Title of page

    const history = useNavigate();
    const dispatch = useDispatch();
    const { token } = useProfile();
    const navigate = useNavigate();

    const { loading = false, error = false, registrationError = null, success = false } = useSelector(state => state.Account);

    const fields = [
        { id: "first-name-field", name: "firstName", label: "الاسم الأول", type: "text" },
        { id: "last-name-field", name: "lastName", label: "الاسم الأخير", type: "text", },
        { id: "email-field", name: "email", label: "الإيميل", type: "email" },
        { id: "password-field", name: "password", label: "كلمة المرور", type: "password" },
        { id: "confirm-password-field", name: "confirmPassword", label: "تأكيد كلمة المرور", type: "password" },
    ]

    useEffect(() => { dispatch(apiError("")); }, [dispatch]);

    useEffect(() => {
        if (success) { setTimeout(() => history("/login"), 3000); }
        setTimeout(() => {
            dispatch(resetRegisterFlag());
        }, 3000);
    }, [dispatch, success, error, history]);

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: { email: '', firstName: '', lastName: '', password: '', confirmPassword: '' },
        validationSchema: Yup.object().shape({
            email: Yup.string().email('الرجاء إدخال عنوان بريد إلكتروني صالح').required('الرجاء إدخال بريدك الإلكتروني'),
            firstName: Yup.string().required('الرجاء إدخال اسم المستخدم الخاص بك'),
            lastName: Yup.string().required('الرجاء إدخال اسم المستخدم الخاص بك'),
            password: Yup.string().min(6, 'يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل').required('كلمة المرور مطلوبة'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'يجب أن تتطابق كلمات المرور').required('تأكيد كلمة المرور مطلوب')
        }),
        onSubmit: (values) => { dispatch(registerUser(values)); }
    });

    if (token) {
        navigate('/dashboard')
    }
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
                                    <p className="mt-3 fs-15 fw-medium">Q8Tasweet - Premium Election Dashboard</p>
                                </div>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">تسجيل حساب جديد</h5>
                                            <p className="text-muted">سجل حسابك الجديد مع كويت تصويت</p>
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
                                                                formStyle="inLineStyle"
                                                            />
                                                        );
                                                    })
                                                }
                                                <div className="p-2">
                                                    <p className="mb-0 fs-12 text-muted fst-italic">
                                                        بالتسجيل، فإنك توافق على شروط الاستخدام الخاصة بـ<strong> كويت تصويت</strong>
                                                        {/* <Link to="#" className="text-primary text-decoration-underline fst-normal fw-medium">شروط الإستخدام</Link>*/}
                                                    </p>
                                                </div>

                                                <div className="mt-4">
                                                    <button className="btn btn-success w-100" type="submit">
                                                        {loading ? <Spinner size="sm" className="me-2" /> : 'إنشاء حساب'}
                                                    </button>
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

export default Register;

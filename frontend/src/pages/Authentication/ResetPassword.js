import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Card, CardBody, Col, Container, Row, Form, Label, Input, FormFeedback, Spinner } from 'reactstrap';
import logoLight from "assets/images/logo-light.png";

//formik
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormFields } from 'shared/components';
import { useDispatch, useSelector } from 'react-redux';

import { userResetPassword } from "../../store/actions";

const ResetPasswordScreen = () => {
    document.title = "Reset Password | Q8Tasweet - React Admin & Dashboard Template";

    const dispatch = useDispatch();
    const { token = null } = useParams();

    const { loading = false, resetPasswordError = null, resetPasswordSuccessMsg = null } = useSelector(state => state.ResetPassword);

    const fields = [
        { id: "password-field1", name: "password", label: "كلمة المرور", type: "password", },
        { id: "confirm-password-field2", name: "confirmPassword", label: "تأكيد كلمة المرور", type: "password", },
    ]

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: { token: token ?? '', password: '', confirmPassword: '' },
        validationSchema: Yup.object({
            token: Yup.string().required("Please check token"),
            password: Yup.string().min(6, 'يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل').required('كلمة المرور مطلوبة'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'يجب أن تتطابق كلمات المرور').required('تأكيد كلمة المرور مطلوب')
        }),
        onSubmit: (values) => { dispatch(userResetPassword(values)); }
    });

    return (
        <div className="auth-page-content">
            <Container>
                <Row>
                    <Col lg={12}>
                        <div className="text-center mt-sm-5  text-white-50">
                            <div>
                                <Link to="/#" className="d-inline-block auth-logo">
                                    <img src={logoLight} alt="" height="10" />
                                </Link>
                            </div>
                            <p className="mt-3 fs-16 fw-semibold">Q8Tasweet - Premium Election Dashboard</p>
                        </div>
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        <Card className="mt-4">
                            <CardBody className="p-4">
                                <div className="text-center mt-2">
                                    <h5 className="text-primary">Password Reset</h5>
                                    <p className="text-muted">Reset password with velzon</p>

                                    <lord-icon
                                        src="https://cdn.lordicon.com/rhvddzym.json"
                                        trigger="loop"
                                        colors="primary:#0ab39c"
                                        className="avatar-xl"
                                        style={{ width: "120px", height: "120px" }}>
                                    </lord-icon>
                                </div>

                                <div className="p-2 mt-4">
                                    {resetPasswordError && resetPasswordError ? (
                                        <Alert color="danger" style={{ marginTop: "13px" }}>
                                            {resetPasswordError}
                                        </Alert>
                                    ) : null}
                                    {resetPasswordSuccessMsg ? (
                                        <Alert color="success" style={{ marginTop: "13px" }}>
                                            {resetPasswordSuccessMsg}
                                        </Alert>
                                    ) : null}
                                    <Form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validation.handleSubmit();
                                            return false;
                                        }}
                                        className="needs-validation" action="#">
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
                                        <button className="btn btn-success w-100" type="submit">
                                            {
                                                loading ?
                                                    <Spinner size="sm" color="me-2" /> :
                                                    'Reset'
                                            }
                                        </button>
                                    </Form>
                                </div>
                            </CardBody>
                        </Card>
                        <div className="mt-4 text-center">
                            <p className="mb-0">Wait, I remember my password... <Link to="/auth-signin-basic" className="fw-bold text-primary text-decoration-underline"> Click here </Link> </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ResetPasswordScreen;
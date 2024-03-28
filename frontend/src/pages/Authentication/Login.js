// React & Redux core
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Store & Selectors
import { loginUser, socialLogin, resetLoginFlag } from "store/actions";

// UI, Styles & Notifications
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from 'reselect';

// Assets & Components
import logoLight from "assets/images/logo-light.png";
import { withRouter, FormFields } from "shared/components";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

const Login = (props) => {
  const dispatch = useDispatch();

  document.title = "تسجيل الدخول | كويت تصويت";

  const selectLayoutState = (state) => state.Account;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      user: layout.user,
      errorMsg: layout.errorMsg,
      loading: layout.loading,
      error: layout.error,
    })
  );
  // Inside your component
  const { user, errorMsg, loading, error } = useSelector(selectLayoutProperties);
  const [userLogin, setUserLogin] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);
  useEffect(() => {
    if (user && user) {
      const updatedUserData =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? user?.multiFactor?.user?.email
          : user?.user?.email;
      setUserLogin({
        email: updatedUserData,
        password: user?.user?.confirm_password ? user?.user?.confirm_password : "",
      });
    }
  }, [user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userLogin.email || "",
      password: userLogin.password || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),

    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
    },
  });

  const signIn = (type) => {
    dispatch(socialLogin(type, props.router.navigate));
  };

  //for facebook and google authentication
  const socialResponse = (type) => {
    signIn(type);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
      }, 3000);
    }
  }, [dispatch, error]);


  const fields = [
    // Existing fields
    {
      id: "email-field",
      name: "email",
      label: "الإيميل",
      type: "email",
    },
    {
      id: "password-field",
      name: "password",
      label: "كلمة المرور",
      type: "password",
    },
  ]


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
                  <p className="mt-3 fs-15 fw-medium">
                    كويت تصويت - مساعدك لإنتخابات موثوقة
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">أهلا بك من جديد !</h5>
                      <p className="text-muted">
                        سجل دخولك للمتابعة في كويت تصويت.
                      </p>
                    </div>
                    {errorMsg && errorMsg ? (
                      <Alert color="danger"> {errorMsg} </Alert>
                    ) : null}
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action="#"
                      >
                        {
                          fields.map(field => {
                            return (field.condition === undefined || field.condition) && (
                              <FormFields
                                key={field.id}
                                field={field}
                                validation={validation}
                              />
                            );
                          })
                        }
                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              نسيت كلمة السر
                            </Link>
                          </div>
                        </div>

                        <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="auth-remember-check"
                          >
                            تذكرني
                          </Label>
                        </div>

                        <div className="mt-4">
                          <Button
                            disabled={error ? null : loading ? true : false}
                            color="success"
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            {error ? null : loading ? (
                              <Spinner size="sm" className="me-2">
                                {" "}
                                تحميل...{" "}
                              </Spinner>
                            ) : null}
                            تسجيل دخول
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0 text-white">ليس لديك حساب؟
                    <Link to="/register" className="fw-semibold text-white text-decoration-underline"> سجل الآن </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);

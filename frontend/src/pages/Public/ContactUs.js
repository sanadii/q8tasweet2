import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, Col, Container, Form, Row } from "reactstrap";
import BreadCrumb from "../../components/Components/BreadCrumb";
import { changeLayout } from 'store/actions'; // Import the action you need

// Assuming you have imported the required layoutTypes and leftSidebarTypes

const Public = () => {
    const dispatch = useDispatch();

    // Use useSelector to access the Redux store
    const layoutType = useSelector((state) => state.Layout.layoutType);
    const leftSidebarType = useSelector((state) => state.Layout.leftSidebarType);
    dispatch(changeLayout('horizontal'));

    // Now you can use layoutType and leftSidebarType in your component
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="الإنتخابات" pageTitle="الإنتخابات" />
                    <Row>
                        <Col lg={3}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title mb-0">تواصل معنا</h5>
                                </CardHeader>
                                <CardBody>
                                    <div>
                                        <div className="mt-4">
                                            <h5 className="fs-13 text-muted text-uppercase">عنوان المكتب 1:</h5>
                                            <div className="ff-secondary fw-semibold">4461 Cedar Street Moro, <br />AR 72368</div>
                                        </div>
                                        <div className="mt-4">
                                            <h5 className="fs-13 text-muted text-uppercase">عنوان المكتب 2:</h5>
                                            <div className="ff-secondary fw-semibold">2467 Swick Hill Street <br />New Orleans, LA</div>
                                        </div>
                                        <div className="mt-4">
                                            <h5 className="fs-13 text-muted text-uppercase">ساعات العمل:</h5>
                                            <div className="ff-secondary fw-semibold">9:00 صباحًا حتى 6:00 مساءً</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={9}>
                            <Card>
                                <CardBody>
                                    <div className="text-center mb-5">
                                        <h3 className="mb-3 fw-semibold">تواصل معنا</h3>
                                        <p className="text-muted mb-4 ff-secondary">نزدهر عندما نأتي بأفكار مبتكرة ولكننا نفهم أيضًا أن الفكرة الذكية يجب أن تدعمها نتائج قابلة للقياس.</p>
                                    </div>
                                    <div>
                                        <Form>
                                            <Row>
                                                <Col lg={6}>
                                                    <div className="mb-4">
                                                        <label htmlFor="name" className="form-label fs-13">الاسم</label>
                                                        <input name="name" id="name" type="text"
                                                            className="form-control bg-light border-light" placeholder="اسمك*" />
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="mb-4">
                                                        <label htmlFor="email" className="form-label fs-13">البريد الإلكتروني</label>
                                                        <input name="email" id="email" type="email"
                                                            className="form-control bg-light border-light" placeholder="بريدك الإلكتروني*" />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={12}>
                                                    <div className="mb-4">
                                                        <label htmlFor="subject" className="form-label fs-13">الموضوع</label>
                                                        <input type="text" className="form-control bg-light border-light" id="subject"
                                                            name="subject" placeholder="موضوعك.." />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={12}>
                                                    <div className="mb-3">
                                                        <label htmlFor="comments" className="form-label fs-13">الرسالة</label>
                                                        <textarea name="comments" id="comments" rows="3"
                                                            className="form-control bg-light border-light"
                                                            placeholder="رسالتك..."></textarea>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={12} className="text-end">
                                                    <input type="submit" id="submit" name="send" className="submitBnt btn btn-primary"
                                                        value="إرسال الرسالة" />
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div >
        </React.Fragment >
    );
};

export default Public;

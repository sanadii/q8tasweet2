import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Col, Form, Input, Label, Row } from 'reactstrap';
import { userSelector } from 'Selectors';

const EditPersonalDetails = () => {
    const { user } = useSelector(userSelector);
    const [activeTab, setActiveTab] = useState("1");

    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <Form>
                <Row>
                    <Col lg={6}>
                        <div className="mb-3">
                            <Label htmlFor="firstnameInput" className="form-label">الاسم الأول</Label>
                            <Input type="text" className="form-control" id="firstnameInput"
                                placeholder="ادخل الاسم الأول" />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-3">
                            <Label htmlFor="lastnameInput" className="form-label">اسم العائلة</Label>
                            <Input type="text" className="form-control" id="lastnameInput"
                                placeholder="ادخل اسم العائلة" />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-3">
                            <Label htmlFor="phonenumberInput" className="form-label">الهاتف</Label>
                            <Input type="text" className="form-control"
                                id="phonenumberInput"
                                placeholder="ادخل رقم الهاتف" />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-3">
                            <Label htmlFor="emailInput" className="form-label">البريد الالكتروني</Label>
                            <Input type="email" className="form-control" id="emailInput"
                                placeholder="ادخل البريد الالكتروني" />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className="mb-3 pb-2">
                            <Label
                                htmlFor="exampleFormControlTextarea"
                                className="form-label">الوصف</Label>
                            <textarea
                                className="form-control"
                                id="exampleFormControlTextarea"
                                rows="3"
                                placeholder="ادخل الوصف هنا"
                            >
                            </textarea>
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                            <button type="button"
                                className="btn btn-primary">تحديث</button>
                            <button type="button"
                                className="btn btn-soft-success">إلغاء</button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </React.Fragment>
    );
};

export default EditPersonalDetails;
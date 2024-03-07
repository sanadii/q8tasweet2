// React & Redux imports
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignAttendee } from "store/actions";
import { campaignSelector } from 'Selectors';

// Component & Constants imports
import { AttendeeStatusOptions, GenderOptions } from "shared/constants";

// Form & Validation imports
import * as Yup from "yup";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";

// Reactstrap (UI) imports
import { Col, Row, Table, Label, Input, Form, FormFeedback } from "reactstrap";


const AttendeeViewModal = ({
    campaignAttendee,
    setOnModalSubmit,
    campaignMembers,
}) => {
    const dispatch = useDispatch();


    const { campaignId, campaignElectionCommittees } = useSelector(campaignSelector); // Directly use without redundant useState

    const GurantorOptions = campaignMembers.filter(
        (member) => member.role === 2 || member.role === 3 || member.role === 4
    );
    const sortedGurantorOptions = GurantorOptions.sort((a, b) => a.role - b.role);

    // Initial Values
    const initialValues = {
        id: campaignAttendee?.id || "",
        campaign: campaignId,
        member: campaignAttendee?.member || "",
        phone: campaignAttendee?.phone || "",
        status: campaignAttendee?.status || 1,
        notes: campaignAttendee?.notes || "",
    };

    // Validation

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: Yup.object({
            status: Yup.number().integer().required("Status is required"),
        }),
        onSubmit: (values) => {
            const updatedCampaignAttendee = {
                id: campaignAttendee ? campaignAttendee.id : 0,
                member_id: values.guarantor,
                phone: values.phone,
                civil: values.civil,
                status: parseInt(values.status, 10),
                notes: values.notes,
            };
            dispatch(updateCampaignAttendee(updatedCampaignAttendee));
            validation.resetForm();
        },
    });

    const handleUpdateButton = useCallback(() => {
        validation.submitForm();
    }, [validation]);

    useEffect(() => {
        setOnModalSubmit(() => handleUpdateButton);
        return () => setOnModalSubmit(null);
    }, [setOnModalSubmit]);

    return (
        <React.Fragment>
            <Row>
                <Col lg={6} className="mb-3 mb-lg-0"> {/* Added margin-bottom for small screens */}
                    <Table size="sm"> {/* Using reactstrap's Table */}
                        <thead className="bg-primary text-white">
                            <tr>
                                <th colSpan="2" className="text-center">معلومات الناخب</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="fw-medium">الاسم</td>{" "}
                                <td>
                                    {campaignAttendee.fullName}
                                </td>
                            </tr>
                            <tr>
                                <td className="fw-medium">النوع</td>{" "}
                                <td>
                                    {
                                        (GenderOptions.find(g => g.id === campaignAttendee.gender) || {}).name || "غير محدد"
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="fw-medium">الرقم المدني</td>
                                <td>{campaignAttendee.civil}</td>
                            </tr>
                            <tr>
                                <td className="fw-medium">رقم الصندوق</td>
                                <td>{campaignAttendee.boxNo}</td>
                            </tr>
                            <tr>
                                <td className="fw-medium">رقم العضوية</td>
                                <td>{campaignAttendee.membershipNo}</td>
                            </tr>
                            <tr>
                                <td className="fw-medium">تاريخ العضوية</td>
                                <td>{campaignAttendee.enrollmentDate}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col lg={6}>
                    <Form
                        className="tablelist-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                        }}
                    >
                        <Table size="sm">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th colSpan="2" className="text-center">معلومات التحضير</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="fw-medium">المحضر</td>
                                    <td>
                                        <td>-</td>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">اللجنة</td>
                                    <td>
                                        <td>-</td>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">ملاحضات</td>
                                    <td>
                                        <Input
                                            name="notes"
                                            id="guarantee-id-field"
                                            className="form-control"
                                            placeholder="ادخل ملاحظات"
                                            type="textarea"
                                            validate={{
                                                required: { value: true },
                                            }}
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.notes || ""}
                                            invalid={
                                                validation.touched.notes && validation.errors.notes
                                                    ? true
                                                    : false
                                            }
                                        />
                                        {validation.touched.notes && validation.errors.notes ? (
                                            <FormFeedback type="invalid">
                                                {validation.errors.notes}
                                            </FormFeedback>
                                        ) : null}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Form>
                </Col>
            </Row>
        </React.Fragment>
    );
};
export default AttendeeViewModal;

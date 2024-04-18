import React from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { addElectionSchema, updateElection } from "store/actions";
import { electionSchemaSelector } from 'selectors';

// Form
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormFields } from "shared/components";

// UX
import { Button, Table, Card, CardHeader, CardBody } from "reactstrap";

const ElectionDataBase = ({ election }) => {
    const dispatch = useDispatch();
    const { electionSchemaName, electionSchemaTables } = useSelector(electionSchemaSelector);

    const electionHasSchema = election?.hasSchema;

    const handleAddElectionSchema = () => {
        dispatch(addElectionSchema(election.slug));
    };

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            fileUpload: election?.fileUpload || "",
        },
        validationSchema: Yup.object().shape({
            // Add validation schema if needed
        }),
        onSubmit: (values) => {
            const updatedElection = {
                fileUpload: values.fileUpload,
            };
            dispatch(updateElection(updatedElection));
            validation.resetForm();
        },
    });

    const fields = [
        {
            id: "file-upload",
            name: "fileUpload",
            label: "DropzoneJS is an open source library that provides drag’n’drop file uploads with image previews.",
            type: "file",
            dropzoneOptions: {
                // Add dropzone options if needed
            },
            colSize: 12,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <h4>قاعدة البيانات</h4>
            </CardHeader>
            <CardBody>
                {electionHasSchema ? (
                    <>
                        <Table>
                            <tbody>
                                <tr>
                                    <th>قاعدة البيانات</th>
                                    <td>{electionSchemaName}</td>
                                </tr>
                                <tr>
                                    <th>الانتخابات</th>
                                    <td>
                                        <ul>
                                            {electionSchemaTables && electionSchemaTables.map((table, index) => (
                                                <li key={index}>{table}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <th>الحملات</th>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>

                        <h5>تحميل الملفات</h5>
                        {fields.map((field) => (
                            (field.condition === undefined || field.condition) && (
                                <FormFields
                                    key={field.id}
                                    field={field}
                                    validation={validation}
                                />
                            )
                        ))}
                        <Button onClick={handleAddElectionSchema}>إضافة قاعدة بيانات للإنتخابات</Button>

                    </>
                ) : (
                    <Button onClick={handleAddElectionSchema}>إضافة قاعدة بيانات للإنتخابات</Button>
                )}
            </CardBody>
        </Card>
    );
};

export default ElectionDataBase;

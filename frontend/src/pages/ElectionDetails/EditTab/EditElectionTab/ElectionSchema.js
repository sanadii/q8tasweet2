import React from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { addElectionSchema, addSchemaTables, updateElection } from "store/actions";
import { electionSelector } from 'selectors';

// Form
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormFields } from "shared/components";

// UX
import { Button, Table, Card, CardHeader, CardBody } from "reactstrap";

const ElectionSchema = ({ election }) => {
    const dispatch = useDispatch();
    const { schemaDetails } = useSelector(electionSelector);
    const electionHasSchema = election?.schemaDetails;

    const handleAddElectionSchema = () => {
        dispatch(addSchemaTables(election.slug));
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
                <h4 className="card-title mb-0 flex-grow-1">قاعدة البيانات</h4>
                <h4 className="card-title mb-0 flex-grow-1">{schemaDetails ? schemaDetails?.schemaName : "No DataBase"}</h4>

            </CardHeader>
            <CardBody>
                {schemaDetails ? (
                    <ul className="list-group list-group-flush border-dashed mb-0">
                        {schemaDetails?.schemaTables && schemaDetails?.schemaTables.map((table, index) => (
                            <li className="list-group-item px-0" key={index}>
                                <div className="d-flex">
                                    <div className="d-flex flex-grow-1 ms-2">
                                        <i className="mdi mdi-database fs-16 align-middle text-primary me-1"></i>
                                        {table.name}
                                    </div>
                                    <div className="flex-shrink-0 text-end">
                                        <Button color="primary" className="btn-icon btn-sm material-shadow-none"> <i className="mdi mdi-database" /> </Button>
                                    </div>
                                </div>
                            </li>
                        ))}



                        {/* <Table>
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
                        </Table> */}

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

                    </ul>

                ) : (
                    <Button onClick={handleAddElectionSchema}>إضافة قاعدة بيانات للإنتخابات</Button>
                )}
            </CardBody>
        </Card>
    );
};

export default ElectionSchema;

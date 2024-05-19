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
                    <div className="schema">
                        <div className="mt-3 pt-2">
                            {schemaDetails.schemaTables && schemaDetails.schemaTables.map((table, index) => (
                                <li className="list-group-item px-0" key={index}>
                                    <div className="d-flex mb-2">
                                        <div className="flex-grow-1">
                                            <p className="text-truncate text-muted fs-14 mb-0">
                                                <i className="mdi mdi-database align-middle text-info me-2"></i>
                                                {table.name}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Button color="primary" className="btn-icon btn-sm material-shadow-none">
                                                <i className="mdi mdi-database" />
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
                        <div>
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
                        </div>
                    </div>
                ) : (
                    <Button onClick={handleAddElectionSchema}>إضافة قاعدة بيانات للإنتخابات</Button>
                )}
            </CardBody>

        </Card >
    );
};

export default ElectionSchema;

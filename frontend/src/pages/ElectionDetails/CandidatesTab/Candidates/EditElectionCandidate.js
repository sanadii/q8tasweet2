import React from "react";
import { Col, ModalBody, Label, Input, Form, FormFeedback } from "reactstrap";

const EditElectionCandidate = ({ validation, electionCandidate }) => {
  console.log("electionCandidate: ", electionCandidate)
  const candidateInfo = [
    { label: "رمز مرشح الإنتخابات", value: electionCandidate?.id },
    { label: "اسم المرشح", value: electionCandidate?.name || "" },
    { label: "رمز المرشح", value: electionCandidate?.candidate },
    { label: "القائمة", value: electionCandidate?.party },
  ];

  return (
    <Form
      className="tablelist-form"
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      <ModalBody>
        <input type="hidden" id="id-field" />
        <h4>المرشح</h4>
        <ul>
          {candidateInfo.map((item, index) => (
            <li key={index}>
              {item.label}: <b>{item.value}</b>
            </li>
          ))}
        </ul>
        <div className="row g-3">
          <Col lg={12}>
            <div>
              <Label htmlFor="notes-field" className="form-label">
                ملاحظات
              </Label>
              <Input
                id="notes-field"
                name="notes"
                className="form-control"
                placeholder="أدخل الملاحظات"
                type="text"
                validate={{
                  required: { value: true },
                }}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.notes || ""}
                invalid={validation.touched.notes && validation.errors.notes ? true : false}
              />
              {validation.touched.notes && validation.errors.notes ? (
                <FormFeedback type="invalid">
                  {validation.errors.notes}
                </FormFeedback>
              ) : null}
            </div>
          </Col>
        </div>
      </ModalBody>
    </Form>
  );
};

export default EditElectionCandidate;

// React & Redux core imports
import React from "react";

// UI Components & styling imports
import { Col, ModalBody, Label, Input, Form, FormFeedback } from "reactstrap";

const EditElectionCandidate = ({ validation, electionCandidate }) => {
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
            <li>
              رمز مرشح الإنتخابات: <b>{validation.values.id}</b>
            </li>
            <li>
              اسم المرشح: <b>{validation.values.name || ""}</b>
            </li>
            <li>
              رمز المرشح: <b>{validation.values.candidate}</b>
            </li>
          </ul>
          <div className="row g-3">
            <Col lg={12}>
              <div>
                <Label htmlFor="candidate-id-field" className="form-label">
                  الأصوات
                </Label>
                <Input
                  name="votes"
                  id="candidate-id-field"
                  className="form-control"
                  placeholder= "أدخل عدد الأصوات للمرشح"
                  type="text"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.votes || ""}
                  invalid={
                    validation.touched.votes && validation.errors.votes
                      ? true
                      : false
                  }
                />
                {validation.touched.votes && validation.errors.votes ? (
                  <FormFeedback type="invalid">
                    {validation.errors.votes}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
            <Col lg={12}>
              <div>
                <Label htmlFor="notes-field" className="form-label">
                  ملاحظات
                </Label>
                <Input
                  id="notes-field"
                  name="notes"
                  className="form-control"
                  placeholder= "أدخل الملاحضات"
                  type="text"
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
              </div>
            </Col>
          </div>
        </ModalBody>
      </Form>
    );
  };
  
  export default EditElectionCandidate;
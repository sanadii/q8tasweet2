import React from "react";
import { Col, Label, FormFeedback } from "reactstrap";


const FormStructureRenderer = ({
  formStructure,
  renderInputFields,
  validation,
  colSize,
  type,
  icon,
  id,
  label,
  name,
}) => {
  switch (formStructure) {
    case "table":
      return (
        <React.Fragment>
          {renderInputFields()}
          {validation.touched[name] && validation.errors[name] && (
            <FormFeedback type="invalid">{validation.errors[name]}</FormFeedback>
          )}
        </React.Fragment>
      );
    default:
      return (
        <Col lg={colSize} className="mb-3">
          {(!icon  && (type !== "checkBox")) &&(
            <Label htmlFor={id} className="form-label">
              {label}
            </Label>
          )}
          {renderInputFields()}
          {validation.touched[name] && validation.errors[name] && (
            <FormFeedback type="invalid">{validation.errors[name]}</FormFeedback>
          )}
        </Col>
      );
  }
};

export default FormStructureRenderer;

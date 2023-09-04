// --------------- React & Redux imports ---------------
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// --------------- Reactstrap (UI) imports ---------------
import {
  Col,
  Row,
  ModalBody,
  Label,
  Input,
  Form,
  FormFeedback,
  Card, CardHeader, CardBody, ModalFooter,
} from "reactstrap";



const SortingTab = () => {
  const dispatch = useDispatch();

  document.title = "Starter | Q8Tasweet - React Admin & Dashboard Template";

  

  return (
    <React.Fragment>

      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <Row className="mb-2">
                <h4>
                  <b>Sorting</b>
                </h4>
              </Row>
            </CardHeader>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SortingTab;

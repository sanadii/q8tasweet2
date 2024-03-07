import React, { useState } from "react";
import { electionSelector, categorySelector } from 'Selectors';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { updateElection } from "store/actions";
import { useCategoryManager } from "shared/hooks";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Input, Label, Row, FormFeedback, Form } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";


const EditSortingMembers = () => {
  const dispatch = useDispatch();

  const {
    electionCommittees,
    // electionSortingMember
  } = useSelector(electionSelector);
  const { categories, subCategories } = useSelector(categorySelector);


  return (
    <React.Fragment>
      <Card>
        <p>hello</p>
      </Card>

    </React.Fragment >
  );
};

export default EditSortingMembers;

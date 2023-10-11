import React, { useState, useEffect, useCallback } from "react";
import { Col, Container, Form, FormFeedback, Input, Modal, ModalBody, ModalHeader, Row, Label } from "reactstrap";
import SimpleBar from "simplebar-react";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "Components/Common/DeleteModal";
import BreadCrumb from "Components/Common/BreadCrumb";
import { electionsSelector } from 'Selectors/electionsSelector';
import useGroupManager from "Components/Hooks/CategoryHooks";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Store actions
import {
  getGroups as onGetGroups,
  updateGroup as onUpdateGroup,
  deleteGroup as onDeleteGroup,
  addNewGroup as onAddNewGroup,
} from "../../../../store/actions";

const Groups = () => {
  document.title = "التصنيف | Q8Tasweet - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetGroups());
  }, [dispatch]);



  return (
    <React.Fragment>
    </React.Fragment>
  );
};

export default Groups;

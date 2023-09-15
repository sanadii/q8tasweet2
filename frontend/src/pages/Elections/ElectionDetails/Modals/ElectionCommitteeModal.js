import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

// Redux and actions imports
import { useSelector, useDispatch } from "react-redux";
import { getElectionCommittees, addNewElectionCommittee, updateElectionCommittee } from "../../../../store/actions";

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

import "react-toastify/dist/ReactToastify.css";

// Reactstrap (UI) imports
import { Col, Row, ModalBody, Label, Input, Modal, ModalHeader, Form, ModalFooter, Button, FormFeedback } from "reactstrap";

// Additional package imports
import SimpleBar from "simplebar-react";

export const ElectionCommitteeModal = ({
  modal,
  toggle,
  setModal,
  isEdit,
  electionCommittee,
}) => {
  const dispatch = useDispatch();

  const { election_id } = useSelector((state) => ({
    election_id: state.Elections.electionDetails.id,
  }));

  const openModal = () => setModal(!modal);
  const toggleModal = () => {
    setModal(!modal);
  };
  // Dispatch getCommittee TODO: MOVE TO ELECTION DETAILS

  const handleButtonClick = () => {
    validation.submitForm(); // validation is the Formik instance from the child component
  };

  const {
    id = "",
    committee_id = "",
    name = "",
    gender = 0,
  } = electionCommittee || {};

  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: id,
      election_id: election_id,
      committee_id: committee_id,
      name: name,
      gender: gender,
    },

    validationSchema: Yup.object({
      // committee_id: Yup.string().required("Please Enter Committee ID"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedElectionCommittee = {
          // Basic Information
          id: electionCommittee ? electionCommittee.id : 0,
          election_id: election_id,
          committee_id: values.committee_id,
          name: values.name,
          gender: values.gender,
        };
        dispatch(updateElectionCommittee(updatedElectionCommittee));
        console.log("updatedElectionCommittee ", updatedElectionCommittee);
      } else {
        const newElectionCommittee = {
          id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
          election_id: election_id,
          committee_id: values["committee_id"],
          name: values.name,
          gender: values.gender,
        };
        dispatch(addNewElectionCommittee(newElectionCommittee));
      }
      validation.resetForm();
      toggle();
    },
  });
  return (
    <Modal isOpen={modal} toggle={openModal} centered className="border-0">
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {!!isEdit ? "Update Election Committee" : "Add New Election Committee"}
      </ModalHeader>
      <ModalBody className="p-4">
        {!!isEdit ? (
          <EditElectionCommittee
            validation={validation}
            formikInstance={validation} // Pass the Formik instance here
          />
        ) : (
          <AddElectionCommittee
            toggleModal={toggleModal}
            election_id={election_id}
            setModal={setModal}
            dispatch={dispatch}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button
            color="light"
            onClick={() => {
              setModal(false);
            }}
          >
            Close
          </Button>
          {!!isEdit ? (
            <Button color="success" id="add-btn" onClick={handleButtonClick}>
              Update Election Committee
            </Button>
          ) : null}
        </div>
      </ModalFooter>
    </Modal>
  );
};

const AddElectionCommittee = ({ election_id, dispatch }) => {
  const { committees, electionCommitteeList } = useSelector((state) => ({
    committees: state.Committees.committees,
    electionCommitteeList: state.Elections.electionCommittees,
  }));

  // Dispatch getCommittee TODO: MOVE TO ELECTION DETAILS
  useEffect(() => {
    if (committees && !committees.length) {
      dispatch(getElectionCommittees());
    }
  }, [dispatch, committees]);

  // Add New ElectionCommittee Search & Filter
  const [searchCommitteeInput, setSearchCommitteeInput] = useState("");
  const [committeeList, setCommitteeList] = useState(committees);

  useEffect(() => {
    setCommitteeList(
      committees.filter((committee) =>
        committee.name
          .toLowerCase()
          .includes(searchCommitteeInput.toLowerCase())
      )
    );
  }, [committees, searchCommitteeInput]);

  return (
    <>
      <div className="search-box mb-3">
        <Input
          type="text"
          className="form-control bg-light border-light"
          placeholder="Search here..."
          value={searchCommitteeInput}
          onChange={(e) => setSearchCommitteeInput(e.target.value)}
        />
        <i className="ri-search-line search-icon"></i>
      </div>

      <SimpleBar
        className="mx-n4 px-4"
        data-simplebar="init"
        style={{ maxHeight: "225px" }}
      >
        <div className="vstack gap-3">
          {committeeList.map((committee) => (
            <Form
              key={committee.id}
              className="tablelist-form"
              onSubmit={(e) => {
                e.preventDefault();
                const newElectionCommittee = {
                  id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
                  election_id: election_id,
                  committee_id: committee.id,
                };
                dispatch(addNewElectionCommittee(newElectionCommittee));
              }}
            >
              <div className="d-flex align-items-center">
                <input
                  type="hidden"
                  id="id-field"
                  name="id"
                  value={committee.id}
                />
                <div className="avatar-xs flex-shrink-0 me-3">
                  <img
                    src={committee.image}
                    alt=""
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div className="flex-grow-1">
                  <h5 className="fs-13 mb-0">
                    <Link to="#" className="text-body d-block">
                      {committee.name}
                    </Link>
                  </h5>
                </div>
                <div className="flex-shrink-0">
                  {electionCommitteeList.some(
                    (item) => item.committee_id === committee.id
                  ) ? (
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      disabled
                    >
                      Add Campaign
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-light btn-sm"
                      id="add-btn"
                    >
                      Add To Election
                    </button>
                  )}
                </div>
              </div>
            </Form>
          ))}
        </div>
      </SimpleBar>
    </>
  );
};

const EditElectionCommittee = ({ validation }) => {
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
        <div className="row g-3">
          <Col lg={12}>
            <div>
              <Label htmlFor="name-field" className="form-label">
                Name
              </Label>
              <Input
                name="name"
                id="name-field"
                className="form-control"
                placeholder="Enter Name"
                type="text"
                validate={{
                  required: { value: true },
                }}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.name || ""}
                invalid={
                  validation.touched.name && validation.errors.name
                    ? true
                    : false
                }
              />
              {validation.touched.name && validation.errors.name ? (
                <FormFeedback type="invalid">
                  {validation.errors.name}
                </FormFeedback>
              ) : null}
            </div>

            <div>
              <Label htmlFor="gender-field" className="form-label">
                Gender
              </Label>
              <Input
                type="select"
                name="gender"
                id="gender-field"
                className="form-control"
                validate={{
                  required: { value: true },
                }}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.gender || ""}
                invalid={
                  validation.touched.gender && validation.errors.gender
                    ? true
                    : false
                }
              >
                <option value="" disabled>Select Gender</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
              </Input>
              {validation.touched.gender && validation.errors.gender ? (
                <FormFeedback type="invalid">
                  {validation.errors.gender}
                </FormFeedback>
              ) : null}
            </div>
          </Col>
        </div>
      </ModalBody>
    </Form>

  );
};

export default ElectionCommitteeModal;

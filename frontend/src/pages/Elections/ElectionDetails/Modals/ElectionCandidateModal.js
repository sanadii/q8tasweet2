import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

// Redux and actions imports
import { useSelector, useDispatch } from "react-redux";
import { getCandidates, addNewElectionCandidate, updateElectionCandidate } from "../../../../store/actions";
import { electionsSelector } from '../../../../Selectors/electionsSelector';

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

import "react-toastify/dist/ReactToastify.css";

// Reactstrap (UI) imports
import { Col, Row, ModalBody, Label, Input, Modal, ModalHeader, Form, ModalFooter, Button, FormFeedback } from "reactstrap";

// Additional package imports
import SimpleBar from "simplebar-react";

export const ElectionCandidateModal = ({ modal, toggle, setModal, isEdit, electionCandidate }) => {
  const dispatch = useDispatch();

  const { electionDetails } = useSelector(electionsSelector);
  const electionId = electionDetails.id;
console.log("electionId", electionId)
  const openModal = () => setModal(!modal);
  const toggleModal = () => {
    setModal(!modal);
  };
  // Dispatch getCandidate TODO: MOVE TO ELECTION DETAILS

  const handleButtonClick = () => {
    validation.submitForm(); // validation is the Formik instance from the child component
  };

  const {
    id = "",
    candidateId = "",
    name = "",
    votes = null,
    remarks = "",
  } = electionCandidate || {};

  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: id,
      electionId: electionId,
      candidateId: candidateId,
      name: name,
      votes: votes,
      remarks: remarks,
    },

    validationSchema: Yup.object({
      // candidateId: Yup.string().required("Please Enter Candidate ID"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedElectionCandidate = {
          // Basic Information
          id: electionCandidate ? electionCandidate.id : 0,
          electionId: electionId,
          candidateId: values.candidateId,
          name: values.name,
          // Election Data
          votes: values.votes,
          remarks: values.remarks,
        };
        dispatch(updateElectionCandidate(updatedElectionCandidate));
        console.log("updatedElectionCandidate ", updatedElectionCandidate);
      } else {
        const newElectionCandidate = {
          id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
          electionId: electionId,
          candidateId: values["candidateId"],
        };
        dispatch(addNewElectionCandidate(newElectionCandidate));
      }
      validation.resetForm();
      toggle();
    },
  });
  return (
    <Modal isOpen={modal} toggle={openModal} centered className="border-0">
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {!!isEdit ? "Update Election Candidate" : "Add New Election Candidate"}
      </ModalHeader>
      <ModalBody className="p-4">
        {!!isEdit ? (
          <EditElectionCandidate
            validation={validation}
            formikInstance={validation} // Pass the Formik instance here
          />
        ) : (
          <AddElectionCandidate
            toggleModal={toggleModal}
            electionId={electionId}
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
              Update Election Candidate
            </Button>
          ) : null}
        </div>
      </ModalFooter>
    </Modal>
  );
};

const AddElectionCandidate = ({ electionId, dispatch }) => {
  const { candidates, electionCandidates } = useSelector(electionsSelector);
  const electionCandidateList = electionCandidates;

  // Dispatch getCandidate TODO: MOVE TO ELECTION DETAILS
  useEffect(() => {
    if (candidates && !candidates.length) {
      dispatch(getCandidates());
    }
  }, [dispatch, candidates]);

  // Add New ElectionCandidate Search & Filter
  const [searchCandidateInput, setSearchCandidateInput] = useState("");
  const [candidateList, setCandidateList] = useState(candidates);

  useEffect(() => {
    setCandidateList(
      candidates.filter((candidate) =>
        candidate.name ? candidate.name
          .toLowerCase().includes(searchCandidateInput
            .toLowerCase()) : false
      )
    );
  }, [candidates, searchCandidateInput]);

  return (
    <>
      <div className="search-box mb-3">
        <Input
          type="text"
          className="form-control bg-light border-light"
          placeholder="Search here..."
          value={searchCandidateInput}
          onChange={(e) => setSearchCandidateInput(e.target.value)}
        />
        <i className="ri-search-line search-icon"></i>
      </div>

      <SimpleBar
        className="mx-n4 px-4"
        data-simplebar="init"
        style={{ maxHeight: "225px" }}
      >
        <div className="vstack gap-3">
          {candidateList.map((candidate) => (
            <Form
              key={candidate.id}
              className="tablelist-form"
              onSubmit={(e) => {
                e.preventDefault();
                const newElectionCandidate = {
                  electionId: electionId,
                  
                  candidateId: candidate.id,
                };
                console.log("electionID:", electionId);
                dispatch(addNewElectionCandidate(newElectionCandidate));
              }}
            >
              <div className="d-flex align-items-center">
                <input
                  type="hidden"
                  id="id-field"
                  name="id"
                  value={candidate.id}
                />
                <div className="avatar-xs flex-shrink-0 me-3">
                  <img
                    src={candidate.image}
                    alt=""
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div className="flex-grow-1">
                  <h5 className="fs-13 mb-0">
                    <Link to="#" className="text-body d-block">
                      {candidate.name}
                    </Link>
                  </h5>
                </div>
                <div className="flex-shrink-0">
                  {electionCandidateList.some(
                    (item) => item.candidateId === candidate.id
                  ) ? (
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      disabled
                    >
                      تمت الإضافة
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-light btn-sm"
                      id="add-btn"
                    >
                      أضف
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

const EditElectionCandidate = ({ validation }) => {
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
        <h4>Candidate</h4>
        <ul>
          <li>
            ElectionCandidate ID: <b>{validation.values.id}</b>
          </li>
          <li>
            Candidate Name: <b>{validation.values.name}</b>
          </li>
          <li>
            Candidate ID: <b>({validation.values.candidateId})</b>
          </li>
        </ul>
        <div className="row g-3">
          <Col lg={12}>
            <div>
              <Label htmlFor="candidate-id-field" className="form-label">
                Votes
              </Label>
              <Input
                name="votes"
                id="candidate-id-field"
                className="form-control"
                placeholder="Enter Candidate ID"
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
              <Label htmlFor="candidate-id-field" className="form-label">
                Remarks
              </Label>
              <Input
                name="remarks"
                id="candidate-id-field"
                className="form-control"
                placeholder="Enter Candidate ID"
                type="text"
                validate={{
                  required: { value: true },
                }}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.remarks || ""}
                invalid={
                  validation.touched.remarks && validation.errors.remarks
                    ? true
                    : false
                }
              />
              {validation.touched.remarks && validation.errors.remarks ? (
                <FormFeedback type="invalid">
                  {validation.errors.remarks}
                </FormFeedback>
              ) : null}
            </div>
          </Col>
        </div>
      </ModalBody>
    </Form>
  );
};

export default ElectionCandidateModal;

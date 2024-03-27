import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

// Redux and actions imports
import { useSelector, useDispatch } from "react-redux";
import {
  getCandidates,
  addNewCandidate,
  updateCandidate,
} from "../../../../store/actions";

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

import "react-toastify/dist/ReactToastify.css";

// Reactstrap (UI) imports
import {
  Col,
  Row,
  ModalBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  Form,
  ModalFooter,
  Button,
  FormFeedback,
} from "reactstrap";

// Additional package imports
import SimpleBar from "simplebar-react";

export const CandidateModal = ({
  modal,
  toggle,
  setModal,
  isEdit,
  Candidate,
}) => {
  const dispatch = useDispatch();

  const { election_id } = useSelector((state) => ({
    election_id: state.Elections.electionDetails.id,
  }));

  const openModal = () => setModal(!modal);
  const toggleModal = () => {
    setModal(!modal);
  };
  // Dispatch getCandidate TODO: MOVE TO CANDIDATE DETAILS

  const handleButtonClick = () => {
    validation.submitForm(); // validation is the Formik instance from the child component
  };

  const {
    id = "",
    candidate_id = "",
    name = "",
    votes = null,
    remarks = "",
  } = Candidate || {};

  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: id,
      election_id: election_id,
      candidate_id: candidate_id,
      name: name,
      votes: votes,
      remarks: remarks,
    },

    validationSchema: Yup.object({
      // candidate_id: Yup.string().required("Please Enter Candidate ID"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedCandidate = {
          // Basic Information
          id: Candidate ? Candidate.id : 0,
          election_id: election_id,
          candidate_id: values.candidate_id,
          name: values.name,
          // Candidate Data
          votes: values.votes,
          remarks: values.remarks,
        };
        dispatch(updateCandidate(updatedCandidate));
        console.log("updatedCandidate ", updatedCandidate);
      } else {
        const newCandidate = {
          id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
          election_id: election_id,
          candidate_id: values["candidate_id"],
        };
        dispatch(addNewCandidate(newCandidate));
      }
      validation.resetForm();
      toggle();
    },
  });
  return (
    <Modal isOpen={modal} toggle={openModal} centered className="border-0">
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {!!isEdit ? "Update Candidate Candidate" : "Add New Candidate Candidate"}
      </ModalHeader>
      <ModalBody className="p-4">
        {!!isEdit ? (
          <EditCandidate
            validation={validation}
            formikInstance={validation} // Pass the Formik instance here
          />
        ) : (
          <AddCandidate
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
              Update Candidate Candidate
            </Button>
          ) : null}
        </div>
      </ModalFooter>
    </Modal>
  );
};

const AddCandidate = ({ election_id, dispatch }) => {
  const { candidates, CandidateList } = useSelector((state) => ({
    candidates: state.Candidates.candidates,
    CandidateList: state.Elections.Candidates,
  }));

  // Dispatch getCandidate TODO: MOVE TO CANDIDATE DETAILS
  useEffect(() => {
    if (candidates && !candidates.length) {
      dispatch(getCandidates());
    }
  }, [dispatch, candidates]);

  // Add New Candidate Search & Filter
  const [searchCandidateInput, setSearchCandidateInput] = useState("");
  const [candidateList, setCandidateList] = useState(candidates);

  useEffect(() => {
    setCandidateList(
      candidates.filter((candidate) =>
        candidate.name
          .toLowerCase()
          .includes(searchCandidateInput.toLowerCase())
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
                const newCandidate = {
                  id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
                  election_id: election_id,
                  candidate_id: candidate.id,
                };
                dispatch(addNewCandidate(newCandidate));
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
                  {CandidateList.some(
                    (item) => item.candidate_id === candidate.id
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
                      Add To Candidate
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

const EditCandidate = ({ validation }) => {
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
            Candidate ID: <b>{validation.values.id}</b>
          </li>
          <li>
            Candidate Name: <b>{validation.values.name}</b>
          </li>
          <li>
            Candidate ID: <b>({validation.values.candidate_id})</b>
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

export default CandidateModal;

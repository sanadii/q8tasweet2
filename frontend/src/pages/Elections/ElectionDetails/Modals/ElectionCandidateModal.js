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
  console.log("ElectionCandidate:::", electionCandidate);

  const { electionDetails } = useSelector(electionsSelector);
  const election = electionDetails.id;
  console.log("election", election)
  const openModal = () => setModal(!modal);
  const toggleModal = () => {
    setModal(!modal);
  };
  // Dispatch getCandidate TODO: MOVE TO ELECTION DETAILS

  const handleButtonClick = () => {
    validation.submitForm();
  };

  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: (electionCandidate && electionCandidate.id) || "",
      election: (electionCandidate && electionCandidate.election) || "",
      candidate: (electionCandidate && electionCandidate.candidate) || "",
      votes: (electionCandidate && electionCandidate.votes) || "",
      notes: (electionCandidate && electionCandidate.notes) || "",
      name: (electionCandidate && electionCandidate.name) || "",
    },

    validationSchema: Yup.object({
      // candidate: Yup.string().required("Please Enter Candidate ID"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedElectionCandidate = {
          // Basic Information
          id: electionCandidate ? electionCandidate.id : 0,
          election: election,
          candidate: electionCandidate.candidate,
          name: electionCandidate.name,
          votes: values.votes,
          notes: values.notes,
        };
        dispatch(updateElectionCandidate(updatedElectionCandidate));
      } else {
        const newElectionCandidate = {
          id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
          election: election,
          candidate: values["candidate"],
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
        {!!isEdit ? "تعديل مرشح الإنتخابات" : "إضافة مرشح جديد"}
      </ModalHeader>
      <ModalBody className="p-4">
        {!!isEdit ? (
          <EditElectionCandidate
            validation={validation}
            formikInstance={validation}
            electionCandidate={electionCandidate}
          />
        ) : (
          <AddElectionCandidate
            toggleModal={toggleModal}
            election={election}
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
            إغلاق
          </Button>
          {!!isEdit ? (
            <Button color="success" id="add-btn" onClick={handleButtonClick}>
              تعديل
            </Button>
          ) : null}
        </div>
      </ModalFooter>
    </Modal>
  );
};

const AddElectionCandidate = ({ election, dispatch }) => {
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
                  election: election,

                  candidate: candidate.id,
                };
                console.log("election:", election);
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
                    (item) => item.candidate === candidate.id
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
            اسم المرشح: <b>{electionCandidate.name || ""}</b>
          </li>
          <li>
            رمز المرشح: <b>{electionCandidate.candidate}</b>
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
              <Label htmlFor="notes-field" className="form-label">
                ملاحظات
              </Label>
              <Input
                id="notes-field"
                name="notes"
                className="form-control"
                placeholder="Enter Candidate ID"
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

export default ElectionCandidateModal;

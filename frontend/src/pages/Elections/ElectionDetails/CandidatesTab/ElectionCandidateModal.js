// React & Redux core imports
import React from "react";
import { useSelector, useDispatch } from "react-redux";

// Action & Selector imports
import { addNewElectionCandidate, updateElectionCandidate } from "store/actions";
import { electionSelector } from 'Selectors';

// Constants & Component imports
import AddElectionCandidate from "./AddElectionCandidate";
import EditElectionCandidate from "./EditElectionCandidate";

// Form & validation imports
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";

// UI Components & styling imports
import { ModalBody, Modal, ModalHeader, ModalFooter, Button } from "reactstrap";

export const ElectionCandidateModal = ({ modal, toggle, setModal, isEdit, electionCandidate }) => {
  const dispatch = useDispatch();

  const { electionDetails } = useSelector(electionSelector);
  const election = electionDetails.id;

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
      <ModalBody className="p-2">
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

export default ElectionCandidateModal;

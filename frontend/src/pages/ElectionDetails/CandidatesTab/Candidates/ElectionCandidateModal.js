// React & Redux core imports
import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Action & Selector imports
import { updateElectionCandidate, updateElectionParty, updateElectionPartyCandidate } from "store/actions";
import { electionSelector } from 'selectors';

// Constants & Component imports
import AddElectionCandidate from "./AddElectionCandidate";
import AddNewCandidate from "./AddCandidate";
import EditElectionCandidate from "./EditElectionCandidate";

// Form & validation imports
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";

// UI Components & styling imports
import { ModalBody, Modal, ModalHeader, ModalFooter, Button } from "reactstrap";

export const ElectionCandidateModal = ({
  modal,
  toggle,
  setModal,
  isEdit,
  electionCandidate,
}) => {
  const dispatch = useDispatch();
  const { electionMethod, electionDetails } = useSelector(electionSelector);
  const election = electionDetails.id;

  const openModal = () => {
    setModal(!modal);
    setIsAddNewCandidate(false);
  };

  const toggleModal = () => { setModal(!modal); };

  // Adding New Candidate From Scratch
  const [isAddNewCandidate, setIsAddNewCandidate] = useState(false);

  const handleAddNewCandidate = useCallback(() => {
    setIsAddNewCandidate((prev) => !prev);
    if (!modal) {
      setModal(true);
    }
  }, [modal]);

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
      notes: (electionCandidate && electionCandidate.notes) || "",
    },

    validationSchema: Yup.object({
      // candidate: Yup.string().required("Please Enter Candidate ID"),
    }),
    onSubmit: (values) => {
      const updatedElectionCandidate = {
        // Basic Information
        id: electionCandidate ? electionCandidate.id : 0,
        notes: values.notes,
      };
      dispatch(updateElectionCandidate(updatedElectionCandidate));

      validation.resetForm();
      toggle();
    },
  });
  return (
    <Modal isOpen={modal} toggle={openModal} centered>
      <ModalHeader className="p-3 ps-3 bg-primary">
        <span className="text-white">
          {!!isEdit ? "تعديل مرشح الإنتخابات" : "إضافة مرشح"}
        </span>
      </ModalHeader>
      <ModalBody>
        {isEdit ? (
          <EditElectionCandidate
            validation={validation}
            formikInstance={validation}
            electionCandidate={electionCandidate}
          />
        ) : !!isAddNewCandidate ?
          (
            <AddNewCandidate
              toggleModal={toggleModal}
              election={election}
              setModal={setIsAddNewCandidate}
              dispatch={dispatch}
            />
          ) : (
            <AddElectionCandidate
              toggleModal={toggleModal}
              election={election}
              setModal={setIsAddNewCandidate}
              dispatch={dispatch}
            />
          )}
      </ModalBody>
      <ModalFooter>
        <div class="card-title mb-0 flex-grow-1">
          <Button color="light" onClick={() => { setModal(false); }}>
            أغلق
          </Button>
        </div>
        <div class="d-flex gap-1">
          {isEdit ? (
            <Button color="success" id="add-btn" onClick={handleButtonClick}>
              تعديل
            </Button>
          ) : (
            <Button color="success" onClick={handleAddNewCandidate}>
              {isAddNewCandidate ? "قائمة المرشحين" : "إضافة مرشح جديد"}
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ElectionCandidateModal;

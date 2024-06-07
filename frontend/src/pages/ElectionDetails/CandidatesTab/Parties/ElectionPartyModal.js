// React & Redux core imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Action & Selector imports
import { updateElectionParty } from "store/actions";
import { electionSelector } from 'selectors';

// Constants & Component imports
import AddElectionParty from "./AddElectionParty";
import AddNewParty from "./AddNewParty";
import EditElectionParty from "./EditElectionParty";

// Form & validation imports
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";

// UI Components & styling imports
import { ModalBody, Modal, ModalHeader, ModalFooter, Button } from "reactstrap";

export const ElectionPartyModal = ({
  modal,
  toggle,
  setModal,
  isEdit,
  electionParty,
}) => {
  const dispatch = useDispatch();
  const { electionDetails } = useSelector(electionSelector);
  const election = electionDetails.id;
  const [isAddParty, setIsAddParty] = useState(false);


  const openModal = () => {
    setModal(!modal);
    setIsAddParty(false);
  };

  const toggleModal = () => { setModal(!modal); };

  // Adding New Party From Scratch

  const handleAddPartyToggle = useCallback(() => {
    setIsAddParty((prev) => !prev);
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
      id: (electionParty && electionParty.id) || "",
      election: (electionParty && electionParty.election) || "",
      party: (electionParty && electionParty.party) || "",
      notes: (electionParty && electionParty.notes) || "",
    },

    validationSchema: Yup.object({
      // party: Yup.string().required("Please Enter Party ID"),
    }),
    onSubmit: (values) => {

      const updatedElectionParty = {
        // Basic Information
        id: electionParty ? electionParty.id : 0,
        notes: values.notes,
      };
      dispatch(updateElectionParty(updatedElectionParty));
      validation.resetForm();
      toggle();
    },
  });
  return (
    <Modal isOpen={modal} toggle={openModal} centered>
      <ModalHeader className="p-4 ps-4 bg-danger">
        <span className="text-white">
          {!!isEdit ? "تعديل القائمة" : "إضافة قائمة"}
        </span>
      </ModalHeader>
      <ModalBody>
        {isEdit ? (
          <EditElectionParty
            validation={validation}
            formikInstance={validation}
            electionParty={electionParty}
          />
        ) : !!isAddParty ?
          (
            <AddNewParty
              toggleModal={toggleModal}
              election={election}
              setModal={setIsAddParty}
              dispatch={dispatch}
            />
          ) : (
            <AddElectionParty
              toggleModal={toggleModal}
              election={election}
              setModal={setIsAddParty}
              dispatch={dispatch}
            />
          )}
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button color="light" onClick={() => { setModal(false); }}>
            أغلق
          </Button>
          {isEdit ? (
            <Button color="success" id="add-btn" onClick={handleButtonClick}>
              تعديل
            </Button>
          ) : (
            <Button color="success" onClick={handleAddPartyToggle}>
              {isAddParty ? "القوائم الإنتخابية" : "إضافة قائمة جديدة"}
            </Button>
          )}
        </div>
      </ModalFooter>

    </Modal>
  );
};

export default ElectionPartyModal;

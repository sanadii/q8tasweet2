// React & Redux core imports
import React from "react";
import { useSelector, useDispatch } from "react-redux";

// Action & Selector imports
import { addNewElectionCommittee, updateElectionCommittee } from "../../../../store/actions";
import { electionsSelector } from '../../../../Selectors/electionsSelector';

// Constants & Component imports
import { GenderOptions } from "../../../../Components/constants";

// Form & validation imports
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";

// UI Components & styling imports
import { Col, ModalBody, Label, Input, Modal, ModalHeader, Form, ModalFooter, Button, FormFeedback } from "reactstrap";


export const ElectionCommitteeModal = ({ modal, toggle, setModal, isEdit, electionCommittee }) => {
  const dispatch = useDispatch();

  const { electionDetails } = useSelector(electionsSelector);
  const election = electionDetails.id

  const openModal = () => setModal(!modal);
  const toggleModal = () => {
    setModal(!modal);
  };

  const handleButtonClick = () => {
    validation.submitForm(); // validation is the Formik instance from the child component
  };

  // validation ---------------
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      election: election || "",
      name: (electionCommittee && electionCommittee.name) || "",
      gender: (electionCommittee && electionCommittee.gender) || 0,
    },

    validationSchema: Yup.object({
      // committee_id: Yup.string().required("Please Enter Committee ID"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedElectionCommittee = {
          id: electionCommittee ? electionCommittee.id : 0,
          election: election || "",
          name: values.name,
          gender: parseInt(values.gender, 10),
        };
        dispatch(updateElectionCommittee(updatedElectionCommittee));
        console.log("updatedElectionCommittee ", updatedElectionCommittee);
      } else {
        const newElectionCommittee = {
          election: election || "",
          name: values.name,
          gender: parseInt(values.gender, 10),
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
                    اسم اللجنة
                  </Label>
                  <Input
                    name="name"
                    id="name-field"
                    className="form-control"
                    placeholder="اسم اللجنة"
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
                    النوع
                  </Label>
                  <Input
                    name="gender"
                    type="select"
                    className="form-select"
                    id="gender-field"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.gender || 0}
                  >
                    <option key={0} value={0}>
                      - اختر النوع -
                    </option>
                    {GenderOptions.map((gender) => (
                      <option key={gender.id} value={gender.id}>
                        {gender.pleural}
                      </option>
                    ))}
                  </Input>
                  {validation.touched.gender && validation.errors.gender ? (
                    <FormFeedback type="invalid">
                      {validation.errors.gender}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            </div>
          </ModalBody >
        </Form >

      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button
            type="button"
            onClick={() => {
              setModal(false);
            }}
            className="btn-light"
          >
            أغلق
          </Button>
          <button type="submit" className="btn btn-success" id="add-btn" onClick={handleButtonClick}>
            {!!isEdit ? "Update Committee" : "Add Committee"}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ElectionCommitteeModal;

// React & Redux core imports
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Action & Selector imports
import { addNewElectionCommittee, updateElectionCommittee, getCampaignSorters } from "store/actions";
import { electionSelector } from 'Selectors';
import { FormFields } from "components";

// Constants & Component imports
import { GenderOptions } from "constants";

// Form & validation imports
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";

// UI Components & styling imports
import { Col, ModalBody, Modal, ModalHeader, Form, ModalFooter, Button } from "reactstrap";


export const CommitteeModal = ({ modal, toggle, setModal, isEdit, electionCommittee }) => {
  const dispatch = useDispatch();

  const { electionDetails, electionSorters } = useSelector(electionSelector);
  const election = electionDetails.id
  console.log("electionCommittee: ", electionCommittee)

  const filteredElectionSorters = electionSorters.filter((sorter) => {
    return sorter.committee === electionCommittee?.id
    // || sorter.committee === null;

  });

  console.log("electionSorters: ", electionSorters)
  const openModal = () => setModal(!modal);
  const toggleModal = () => {
    setModal(!modal);
  };

  const handleButtonClick = () => {
    validation.submitForm(); // validation is the Formik instance from the child component
  };

  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      election: election || "",
      name: (electionCommittee && electionCommittee.name) || "",
      gender: (electionCommittee && electionCommittee.gender) || 1,
      sorter: (electionCommittee && electionCommittee.sorter) || null,
    },

    validationSchema: Yup.object({
      // name: Yup.required("Please Enter Committee ID"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedElectionCommittee = {
          id: electionCommittee ? electionCommittee.id : 0,
          election: election || "",
          name: values.name,
          gender: parseInt(values.gender, 10),
          sorter: parseInt(values.sorter, 10),
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

  const fields = [
    // Existing fields
    {
      id: "name-field",
      name: "name",
      label: "اسم اللجنة",
      type: "text",
    },
    {
      id: "gender-field",
      name: "gender",
      label: "النوع",
      type: "select",
      options: GenderOptions.map(gender => ({
        id: gender.id,
        label: gender.pleural,
        value: gender.id
      })),
    },

    // Condition To show when isEdit is true
    {
      id: "sorter-field",
      name: "sorter",
      label: "الفارز",
      type: "select",
      options: [
        { id: 'none', label: '- اختر الفارز -', value: null },
        ...filteredElectionSorters.map(item => ({
          id: item.user,
          label: item.name,
          value: item.user
        }))
      ],
      condition: isEdit, // Condition for rendering

    },
  ];

  return (
    <Modal isOpen={modal} toggle={openModal} centered className="border-0">
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {!!isEdit ? "تعديل اللجنة الإنتخابية" : "إضافة لجنة إنتخابية"}
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
                {
                  fields.map(field => {
                    return (field.condition === undefined || field.condition) && (
                      <FormFields
                        key={field.id}
                        field={field}
                        validation={validation}
                      />
                    );
                  })
                }
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

export default CommitteeModal;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getCandidates,
  addNewElectionCampaign,
  updateCandidateCampaign,
} from "../../../../store/actions";

import { ImageCircle } from "../../../../Components/Common";
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
import Flatpickr from "react-flatpickr";

export const CandidateCampaignModal = ({
  modal,
  toggle,
  setModal,
  isEdit,
  electionCampaign,
}) => {
  const dispatch = useDispatch();

  //   const { campaign_id } = useSelector((state) => ({
  //     campaign_id: state.Elections.Campaigns.id,
  //   }));

  //   const openModal = () => setCampaignModal(!campaignModal);
  //   const toggleModal = () => {
  //     setCampaignModal(!campaignModal);
  //   };

  const openModal = () => setModal(!modal);
  const toggleModal = () => {
    setModal(!modal);
  };

  //   const handleButtonClick = () => {
  //     validation.submitForm(); // validation is the Formik instance from the child component
  //   };

  //   const {
  //     id = "",
  //     // candidate_id = "",
  //     // name = "",
  //     // votes = null,
  //     // remarks = "",
  //   } = electionCampaign || {};

  //   // validation
  //   const validation = useFormik({
  //     enableReinitialize: true,

  //     initialValues: {
  //       id: id,
  //       //   candidate_id: candidate_id,
  //       //   name: name,
  //       //   votes: votes,
  //       //   remarks: remarks,
  //     },

  //     validationSchema: Yup.object({
  //       // candidate_id: Yup.string().required("Please Enter Candidate ID"),
  //     }),
  //     onSubmit: (values) => {
  //       if (isEdit) {
  //         const updatedElectionCampaign = {
  //           // Basic Information
  //           id: electionCampaign ? electionCampaign.id : 0,
  //           candidate_id: values.candidate_id,
  //           name: values.name,
  //           // Candidate Data
  //           //   votes: values.votes,
  //           //   remarks: values.remarks,
  //         };
  //         dispatch(updateCandidateCampaign(updatedElectionCampaign));
  //         console.log("updatedElectionCampaign ", updatedElectionCampaign);
  //       } else {
  //         const newElectionCampaign = {
  //           id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
  //           candidate_id: values["candidate_id"],
  //         };
  //         dispatch(addNewElectionCampaign(newElectionCampaign));
  //       }
  //       validation.resetForm();
  //       toggle();
  //     },
  //   });
  return (
    <Modal isOpen={modal} toggle={openModal} centered className="border-0">
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {!!isEdit ? "Update Candidate Campaign" : "Add New Candidate Campaign"}
      </ModalHeader>
      <ModalBody className="p-4">
        {!!isEdit ? (
          <EditCandidateCampaignModal
          // validation={validation}
          // formikInstance={validation} // Pass the Formik instance here
          />
        ) : (
          <AddCandidateCampaignModal
            toggleModal={toggleModal}
            // election_id={election_id}
            // setCampaignModal={setCampaignModal}
            dispatch={dispatch}
          />
        )}
      </ModalBody>
      {/* <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button
            color="light"
            onClick={() => {
              setCampaignModal(false);
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
      </ModalFooter> */}
    </Modal>
  );
};

const AddCandidateCampaignModal = ({ election_id, dispatch }) => {
  const { candidateElections, electionCampaigns } = useSelector((state) => ({
    candidateElections: state.Elections.candidateElections,
    electionCampaigns: state.Elections.electionCampaigns,
  }));

  const [candidateElectionList, setCandidateList] =
    useState(candidateElections);
  const [electionCampaignList, setElectionCampaignList] =
    useState(electionCampaigns);

  //   Add New ElectionCampaign Search & Filter
  const [searchCandidateElectionInput, setSearchCandidateElectionInput] =
    useState("");
  const [campaignList, setCandidateElectionList] = useState(electionCampaigns);

  useEffect(() => {
    setCandidateList(
      candidateElectionList.filter((candidateElection) =>
        candidateElection.name
          .toLowerCase()
          .includes(searchCandidateElectionInput.toLowerCase())
      )
    );
  }, [candidateElections, searchCandidateElectionInput]);

  return (
    <>
      <div className="search-box mb-3">
        <Input
          type="text"
          className="form-control bg-light border-light"
          placeholder="Search here..."
          value={searchCandidateElectionInput}
          onChange={(e) => setSearchCandidateElectionInput(e.target.value)}
        />
        <i className="ri-search-line search-icon"></i>
      </div>

      <SimpleBar
        className="mx-n4 px-4"
        data-simplebar="init"
        style={{ maxHeight: "225px" }}
      >
        <div className="vstack gap-3">
          {candidateElectionList.map((candidateElection) => (
            <Form
              key={candidateElection.id}
              className="tablelist-form"
              onSubmit={(e) => {
                e.preventDefault();
                const newElectionCampaign = {
                  id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
                  election_candidate: candidateElection.id,
                };
                dispatch(addNewElectionCampaign(newElectionCampaign));
              }}
            >
              <div className="d-flex align-items-center">
                <input
                  type="hidden"
                  id="id-field"
                  name="id"
                  value={candidateElection.id}
                />
                <ImageCircle imagePath={candidateElection.image} />

                <div className="flex-grow-1">
                  <h5 className="fs-13 mb-0">
                    <Link to="#" className="text-body d-block">
                      {candidateElection.name} - {candidateElection.id}
                    </Link>
                  </h5>
                </div>
                <div className="flex-shrink-0">
                  {electionCampaignList.some(
                    (item) => item.election_candidate === candidateElection.id
                  ) ? (
                    <p className="success mb-0 text-success">Added</p>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-light btn-sm"
                      id="add-btn"
                    >
                      Add A Campaign
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

const EditCandidateCampaignModal = ({ validation }) => {
  return (
    <p>EditCandidateCampaignModal</p>
    // <Form
    //     className="tablelist-form"
    //     onSubmit={(e) => {
    //         e.preventDefault();
    //         validation.handleSubmit();
    //         return false;
    //     }}
    // >
    //     <ModalBody>
    //         <input type="hidden" id="id-field" />
    //         <h4>Candidate</h4>
    //         <ul>
    //             <li>
    //                 ElectionCampaign ID: <b>{validation.values.id}</b>
    //             </li>
    //             <li>
    //                 Candidate Name: <b>{validation.values.name}</b>
    //             </li>
    //             <li>
    //                 Candidate ID: <b>({validation.values.candidate_id})</b>
    //             </li>
    //         </ul>
    //         <div className="row g-3">
    //             <Col lg={12}>
    //                 <div>
    //                     <Label htmlFor="candidate-id-field" className="form-label">
    //                         Votes
    //                     </Label>
    //                     <Input
    //                         name="votes"
    //                         id="candidate-id-field"
    //                         className="form-control"
    //                         placeholder="Enter Candidate ID"
    //                         type="text"
    //                         validate={{
    //                             required: { value: true },
    //                         }}
    //                         onChange={validation.handleChange}
    //                         onBlur={validation.handleBlur}
    //                         value={validation.values.votes || ""}
    //                         invalid={
    //                             validation.touched.votes && validation.errors.votes
    //                                 ? true
    //                                 : false
    //                         }
    //                     />
    //                     {validation.touched.votes && validation.errors.votes ? (
    //                         <FormFeedback type="invalid">
    //                             {validation.errors.votes}
    //                         </FormFeedback>
    //                     ) : null}
    //                 </div>
    //             </Col>
    //             <Col lg={12}>
    //                 <div>
    //                     <Label htmlFor="candidate-id-field" className="form-label">
    //                         Remarks
    //                     </Label>
    //                     <Input
    //                         name="remarks"
    //                         id="candidate-id-field"
    //                         className="form-control"
    //                         placeholder="Enter Candidate ID"
    //                         type="text"
    //                         validate={{
    //                             required: { value: true },
    //                         }}
    //                         onChange={validation.handleChange}
    //                         onBlur={validation.handleBlur}
    //                         value={validation.values.remarks || ""}
    //                         invalid={
    //                             validation.touched.remarks && validation.errors.remarks
    //                                 ? true
    //                                 : false
    //                         }
    //                     />
    //                     {validation.touched.remarks && validation.errors.remarks ? (
    //                         <FormFeedback type="invalid">
    //                             {validation.errors.remarks}
    //                         </FormFeedback>
    //                     ) : null}
    //                 </div>
    //             </Col>
    //         </div>
    //     </ModalBody>
    // </Form>
  );
};

export default CandidateCampaignModal;

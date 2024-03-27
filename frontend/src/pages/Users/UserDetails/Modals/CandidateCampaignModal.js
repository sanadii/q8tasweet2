import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  addNewElectionCampaign,
  updateUserCampaign,
} from "../../../../store/actions";

import { ImageCircle } from "../../../../shared/components";
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

export const UserCampaignModal = ({
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
  //     // user_id = "",
  //     // name = "",
  //     // votes = null,
  //     // remarks = "",
  //   } = electionCampaign || {};

  //   // validation
  //   const validation = useFormik({
  //     enableReinitialize: true,

  //     initialValues: {
  //       id: id,
  //       //   user_id: user_id,
  //       //   name: name,
  //       //   votes: votes,
  //       //   remarks: remarks,
  //     },

  //     validationSchema: Yup.object({
  //       // user_id: Yup.string().required("Please Enter User ID"),
  //     }),
  //     onSubmit: (values) => {
  //       if (isEdit) {
  //         const updatedElectionCampaign = {
  //           // Basic Information
  //           id: electionCampaign ? electionCampaign.id : 0,
  //           user_id: values.user_id,
  //           name: values.name,
  //           // User Data
  //           //   votes: values.votes,
  //           //   remarks: values.remarks,
  //         };
  //         dispatch(updateUserCampaign(updatedElectionCampaign));
  //         console.log("updatedElectionCampaign ", updatedElectionCampaign);
  //       } else {
  //         const newElectionCampaign = {
  //           id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
  //           user_id: values["user_id"],
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
        {!!isEdit ? "Update User Campaign" : "Add New User Campaign"}
      </ModalHeader>
      <ModalBody className="p-4">
        {!!isEdit ? (
          <EditUserCampaignModal
          // validation={validation}
          // formikInstance={validation} // Pass the Formik instance here
          />
        ) : (
          <AddNewUserCampaignModal
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
              Update User User
            </Button>
          ) : null}
        </div>
      </ModalFooter> */}
    </Modal>
  );
};

const AddNewUserCampaignModal = ({ election_id, dispatch }) => {
  const { userElections, electionCampaigns } = useSelector((state) => ({
    userElections: state.Elections.userElections,
    electionCampaigns: state.Elections.electionCampaigns,
  }));

  const [userElectionList, setUserList] =
    useState(userElections);
  const [electionCampaignList, setElectionCampaignList] =
    useState(electionCampaigns);

  //   Add New ElectionCampaign Search & Filter
  const [searchUserElectionInput, setSearchUserElectionInput] =
    useState("");
  const [campaignList, setUserElectionList] = useState(electionCampaigns);

  useEffect(() => {
    setUserList(
      userElectionList.filter((userElection) =>
        userElection.name
          .toLowerCase()
          .includes(searchUserElectionInput.toLowerCase())
      )
    );
  }, [userElections, searchUserElectionInput]);

  return (
    <>
      <div className="search-box mb-3">
        <Input
          type="text"
          className="form-control bg-light border-light"
          placeholder="Search here..."
          value={searchUserElectionInput}
          onChange={(e) => setSearchUserElectionInput(e.target.value)}
        />
        <i className="ri-search-line search-icon"></i>
      </div>

      <SimpleBar
        className="mx-n4 px-4"
        data-simplebar="init"
        style={{ maxHeight: "225px" }}
      >
        <div className="vstack gap-3">
          {userElectionList.map((userElection) => (
            <Form
              key={userElection.id}
              className="tablelist-form"
              onSubmit={(e) => {
                e.preventDefault();
                const newElectionCampaign = {
                  id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
                  election_user: userElection.id,
                };
                dispatch(addNewElectionCampaign(newElectionCampaign));
              }}
            >
              <div className="d-flex align-items-center">
                <input
                  type="hidden"
                  id="id-field"
                  name="id"
                  value={userElection.id}
                />
                <ImageCircle imagePath={userElection.image} />

                <div className="flex-grow-1">
                  <h5 className="fs-13 mb-0">
                    <Link to="#" className="text-body d-block">
                      {userElection.name} - {userElection.id}
                    </Link>
                  </h5>
                </div>
                <div className="flex-shrink-0">
                  {electionCampaignList.some(
                    (item) => item.election_user === userElection.id
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

const EditUserCampaignModal = ({ validation }) => {
  return (
    <p>EditUserCampaignModal</p>
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
    //         <h4>User</h4>
    //         <ul>
    //             <li>
    //                 ElectionCampaign ID: <b>{validation.values.id}</b>
    //             </li>
    //             <li>
    //                 User Name: <b>{validation.values.name}</b>
    //             </li>
    //             <li>
    //                 User ID: <b>({validation.values.user_id})</b>
    //             </li>
    //         </ul>
    //         <div className="row g-3">
    //             <Col lg={12}>
    //                 <div>
    //                     <Label htmlFor="user-id-field" className="form-label">
    //                         Votes
    //                     </Label>
    //                     <Input
    //                         name="votes"
    //                         id="user-id-field"
    //                         className="form-control"
    //                         placeholder="Enter User ID"
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
    //                     <Label htmlFor="user-id-field" className="form-label">
    //                         Remarks
    //                     </Label>
    //                     <Input
    //                         name="remarks"
    //                         id="user-id-field"
    //                         className="form-control"
    //                         placeholder="Enter User ID"
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

export default UserCampaignModal;

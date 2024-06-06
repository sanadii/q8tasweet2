import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

// Redux and actions imports
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  addUserElection,
  updateUserElection,
} from "store/actions";

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

export const UserElectionModal = ({
  modal,
  toggle,
  setModal,
  isEdit,
  userElection,
}) => {
  const dispatch = useDispatch();

  const { election_id } = useSelector((state) => ({
    election_id: state.Elections.electionDetails.id,
  }));

  const openModal = () => setModal(!modal);
  const toggleModal = () => {
    setModal(!modal);
  };
  // Dispatch getUser TODO: MOVE TO CANDIDATE DETAILS

  const handleButtonClick = () => {
    validation.submitForm(); // validation is the Formik instance from the child component
  };

  const {
    id = "",
    user_id = "",
    name = "",
    votes = null,
    remarks = "",
  } = userElection || {};

  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: id,
      election_id: election_id,
      user_id: user_id,
      name: name,
      votes: votes,
      remarks: remarks,
    },

    validationSchema: Yup.object({
      // user_id: Yup.string().required("Please Enter User ID"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedUserElection = {
          // Basic Information
          id: userElection ? userElection.id : 0,
          election_id: election_id,
          user_id: values.user_id,
          name: values.name,
          // User Data
          votes: values.votes,
          remarks: values.remarks,
        };
        dispatch(updateUserElection(updatedUserElection));
        console.log("updatedUserElection ", updatedUserElection);
      } else {
        const newUserElection = {
          id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
          election_id: election_id,
          user_id: values["user_id"],
        };
        dispatch(addUserElection(newUserElection));
      }
      validation.resetForm();
      toggle();
    },
  });
  return (
    <Modal isOpen={modal} toggle={openModal} centered className="border-0">
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        {!!isEdit ? "Update User User" : "Add New User User"}
      </ModalHeader>
      <ModalBody className="p-4">
        {!!isEdit ? (
          <EditUserElection
            validation={validation}
            formikInstance={validation} // Pass the Formik instance here
          />
        ) : (
          <AddNewUserElection
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
              Update User User
            </Button>
          ) : null}
        </div>
      </ModalFooter>
    </Modal>
  );
};

const AddNewUserElection = ({ election_id, dispatch }) => {
  const { users, userElectionList } = useSelector((state) => ({
    users: state.Users.users,
    userElectionList: state.Elections.userElections,
  }));

  // Dispatch getUser TODO: MOVE TO CANDIDATE DETAILS
  useEffect(() => {
    if (users && !users.length) {
      dispatch(getUsers());
    }
  }, [dispatch, users]);

  // Add New UserElection Search & Filter
  const [searchUserInput, setSearchUserInput] = useState("");
  const [userList, setUserList] = useState(users);

  useEffect(() => {
    setUserList(
      users.filter((user) =>
        user.name
          .toLowerCase()
          .includes(searchUserInput.toLowerCase())
      )
    );
  }, [users, searchUserInput]);

  return (
    <>
      <div className="search-box mb-3">
        <Input
          type="text"
          className="form-control bg-light border-light"
          placeholder="Search here..."
          value={searchUserInput}
          onChange={(e) => setSearchUserInput(e.target.value)}
        />
        <i className="ri-search-line search-icon"></i>
      </div>

      <SimpleBar
        className="mx-n4 px-4"
        data-simplebar="init"
        style={{ maxHeight: "225px" }}
      >
        <div className="vstack gap-3">
          {userList.map((user) => (
            <Form
              key={user.id}
              className="tablelist-form"
              onSubmit={(e) => {
                e.preventDefault();
                const newUserElection = {
                  id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
                  election_id: election_id,
                  user_id: user.id,
                };
                dispatch(addUserElection(newUserElection));
              }}
            >
              <div className="d-flex align-items-center">
                <input
                  type="hidden"
                  id="id-field"
                  name="id"
                  value={user.id}
                />
                <div className="avatar-xs flex-shrink-0 me-3">
                  <img
                    src={user.image}
                    alt=""
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div className="flex-grow-1">
                  <h5 className="fs-13 mb-0">
                    <Link to="#" className="text-body d-block">
                      {user.name}
                    </Link>
                  </h5>
                </div>
                <div className="flex-shrink-0">
                  {userElectionList.some(
                    (item) => item.user_id === user.id
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
                      Add To User
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

const EditUserElection = ({ validation }) => {
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
        <h4>User</h4>
        <ul>
          <li>
            UserElection ID: <b>{validation.values.id}</b>
          </li>
          <li>
            User Name: <b>{validation.values.name}</b>
          </li>
          <li>
            User ID: <b>({validation.values.user_id})</b>
          </li>
        </ul>
        <div className="row g-3">
          <Col lg={12}>
            <div>
              <Label htmlFor="user-id-field" className="form-label">
                Votes
              </Label>
              <Input
                name="votes"
                id="user-id-field"
                className="form-control"
                placeholder="Enter User ID"
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
              <Label htmlFor="user-id-field" className="form-label">
                Remarks
              </Label>
              <Input
                name="remarks"
                id="user-id-field"
                className="form-control"
                placeholder="Enter User ID"
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

export default UserElectionModal;

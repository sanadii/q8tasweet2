// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useParams } from "react-router-dom";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import {
  getCandidates,
  addNewElectionCandidate,
  updateElectionCandidate,
  deleteElectionCandidate,
} from "../../../store/actions";

// Formik imports
import * as Yup from "yup";
import { useFormik } from "formik";

// Utility imports
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom component imports
import { GenderCircle, ImageCircle, ImageGenderCircle, Loader, DeleteModal, TableContainer } from "../../../Components/Common";


// Image imports
import multiUser from "../../../assets/images/users/multi-user.jpg";

// Reactstrap imports
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  ModalBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  Form,
  ModalFooter,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback,
} from "reactstrap";

// Additional package imports
import SimpleBar from "simplebar-react";
import Flatpickr from "react-flatpickr";

const CandidatesTab = ({ electionCandidateList }) => {
  const dispatch = useDispatch();

  const { isElectionCandidateSuccess, candidateList, isElectionSuccess, error } = useSelector((state) => ({
    isElectionCandidateSuccess: state.Elections.isElectionCandidateSuccess,
    candidateList: state.Candidates.candidateList,
    isCandidatesSuccess: state.Candidates.isCandidatesSuccess,
    error: state.Candidates.error,
  }));
  const [ElectionList, setCandidateList] = useState([]);
  const [candidate, setCandidate] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [electionCandidateInfo, setElectionCandidateInfo] = useState([]);

  // Search Candidates Constanses 
  const [searchCandidateInput, setSearchCandidateInput] = useState("");
  const filteredCandidates = candidateList.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchCandidateInput.toLowerCase())
  );


  // Dispatch getCandidate List
  useEffect(() => {
    if (candidateList && !candidateList.length) {
      dispatch(getCandidates());
    }
  }, [dispatch, candidateList]);

  useEffect(() => {
    setCandidateList(candidateList);
  }, [candidateList]);


  const openModal = () => setModal(!modal);

  const election_id = useSelector(
    (state) => state.Elections.electionDetails.id
  );





  const [isEdit, setIsEdit] = useState(false);
  const [electionCandidate, setElectionCandidate] = useState([]);

  //Delete Election Candidate
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);

  // Toggle
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElectionCandidate(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteElectionCandidate = () => {
    if (electionCandidate) {
      dispatch(deleteElectionCandidate(electionCandidate.id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (electionCandidate) => {
    setElectionCandidate(electionCandidate);
    setDeleteModal(true);
  };

  // Add Dataa
  // handleElectionCandidateClicks Function
  const handleElectionCandidateClicks = () => {
    setElectionCandidate(""); // Changed from empty string to null
    setIsEdit(false);
    toggle();
  };

  // Update Data
  const handleElectionCandidateClick = useCallback(
    (arg) => {
      const electionCandidate = arg;

      setElectionCandidate({
        id: electionCandidate.id,
        election_id: electionCandidate.election_id,
        candidate_id: electionCandidate.candidate_id,
        name: electionCandidate.name,
        image: electionCandidate.image,
        position: electionCandidate.position,
        votes: electionCandidate.votes,
        status: electionCandidate.status,
        remarks: electionCandidate.remarks,
        is_winner: electionCandidate.is_winner,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );



  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: "",
      election_id: (electionCandidate && electionCandidate.election_id) || "",
      candidate_id: (electionCandidate && electionCandidate.candidate_id) || "",
      position: (electionCandidate && electionCandidate.position) || "",
      votes: (electionCandidate && electionCandidate.votes) || null, // Set to null instead of ""
      status: (electionCandidate && electionCandidate.status) || "",
      remarks: (electionCandidate && electionCandidate.remarks) || "",
    },
    validationSchema: Yup.object({
      // candidate_id: Yup.string().required("Please Enter Candidate ID"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedElectionCandidate = {
          id: electionCandidate ? electionCandidate.id : 0,
          election_id: values.election_id,
          candidate_id: values.candidate_id,
          position: values.position,
          votes: values.votes,
          status: values.status,
          remarks: values.remarks,
        };
        dispatch(updateElectionCandidate(updatedElectionCandidate));
      } else {
        const newElectionCandidate = {
          id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
          election_id: election_id,
          candidate_id: values["candidate_id"],
          // position: values["position"],
          // votes: values["votes"],
          // status: values["status"],
          // remarks: values["remarks"],
        };
        // dispatch(addNewElectionCandidate(newElectionCandidate));
      }
      validation.resetForm();
      toggle();
    },
  });

  // Node API
  // useEffect(() => {
  //   if (isElectionCandidatesCreated) {
  //     setElectionCandidate(null);
  //     dispatch(onGetElectionCandidateList());
  //   }
  // }, [
  //   dispatch,
  //   isElectionCandidatesCreated,
  // ]);

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".electionCandidateCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(deleteElectionCandidate(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".electionCandidateCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="electionCandidateCheckBox form-check-input"
              value={cellProps.row.original.id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "id",
      },
      {
        Header: "ID",
        accessor: "candidate_id",
        filterable: true,
        enableGlobalFilter: false
      },
      {
        Header: "Candidate",
        filterable: true,
        Cell: (electionCandidate) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                {electionCandidate.row.original.candidate_details.image ? (
                  // Use the ImageCircle component here
                  <ImageCircle
                    imagePath={
                      electionCandidate.row.original.candidate_details.image
                    }
                  />
                ) : (
                  <div className="flex-shrink-0 avatar-xs me-2">
                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                      {electionCandidate.row.original.candidate_details.name.charAt(
                        0
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-grow-1 ms-2 name">
                {electionCandidate.row.original.candidate_details.name}
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Position",
        accessor: "position",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <p>--</p>
          );
        },
      },

      {
        Header: "Votes",
        accessor: "votes",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <p>--</p>
          );
        },
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-phone-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit" title="Message">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-question-answer-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="View">
                <Link
                  to="#"
                  onClick={() => {
                    // console.log("Click event triggered");
                    const electionCandidateInfo = cellProps.row.original;
                    setElectionCandidateInfo(electionCandidateInfo);
                    // console.log("electionCandidateInfo", electionCandidateInfo);
                  }}
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link
                  className="edit-item-btn"
                  to="#"
                  onClick={() => {
                    const electionCandidateInfo = cellProps.row.original;
                    handleElectionCandidateClick(electionCandidateInfo);
                  }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="remove-item-btn"
                  onClick={() => {
                    const electionCandidateInfo = cellProps.row.original;
                    onClickDelete(electionCandidateInfo);
                  }}
                  to="#"
                >
                  <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleElectionCandidateClick, checkedAll]
  );

  // Export Modal
  // const [isExportCSV, setIsExportCSV] = useState(false);
  // if (electionCandidateList) {
  //   console.log("Election Candidates exist:", electionCandidateList);
  // } else {
  //   console.log("No Election Candidates");
  // }

  // console.log("isElectionCandidateSuccess:", isElectionCandidateSuccess);
  // console.log("electionCandidateList.length:", electionCandidateList.length);

  return (
    <React.Fragment>
      {/* <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={ElectionCandidates}
          /> */}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteElectionCandidate}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />

      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <div className="d-flex align-items-center flex-wrap gap-2">
                <div className="flex-grow-1">
                  <button
                    className="btn btn-info add-btn"
                    onClick={() => {
                      setIsEdit(false);
                      toggle();
                    }}
                  >
                    <i className="ri-add-fill me-1 align-bottom"></i> Add
                    Candidate
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <div className="hstack text-nowrap gap-2">
                    {isMultiDeleteButton && (
                      <button
                        className="btn btn-soft-danger"
                        onClick={() => setDeleteModalMulti(true)}
                      >
                        <i className="ri-delete-bin-2-line"></i>
                      </button>
                    )}
                    <button className="btn btn-danger">
                      <i className="ri-filter-2-line me-1 align-bottom"></i>{" "}
                      Filters
                    </button>
                    {/* <button className="btn btn-soft-success" onClick={() => setIsExportCSV(true)}>Export</button> */}
                    <UncontrolledDropdown>
                      <DropdownToggle
                        href="#"
                        className="btn btn-soft-info btn-icon"
                        tag="button"
                      >
                        <i className="ri-more-2-fill"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem className="dropdown-item" href="#">
                          All
                        </DropdownItem>
                        <DropdownItem className="dropdown-item" href="#">
                          Last Week
                        </DropdownItem>
                        <DropdownItem className="dropdown-item" href="#">
                          Last Month
                        </DropdownItem>
                        <DropdownItem className="dropdown-item" href="#">
                          Last Year
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Col>
        <Col xxl={9}>
          <Card id="electionCandidateList">
            <CardBody className="pt-0">
              <div>
                {isElectionCandidateSuccess && electionCandidateList.length ? (
                  <TableContainer
                    columns={columns}
                    data={electionCandidateList || []}
                    isGlobalFilter={true}
                    isAddNewUserList={false}
                    isElectionCandidateFilter={true}
                    SearchPlaceholder="Search for electionCandidate..."
                    customPageSize={50}
                    className="custom-header-css"
                    divClass="table-responsive table-card mb-2"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light"
                    handleElectionCandidateClick={handleElectionCandidateClicks}
                  />
                ) : (
                  <Loader error={error} />
                )}
              </div>
              <Modal isOpen={modal} toggle={openModal} centered className="border-0">
                <ModalHeader toggle={openModal} className="p-3 ps-4 bg-soft-success">
                  Members
                </ModalHeader>

                {/* Wrap the content with the Form component */}
                <ModalBody className="p-4">
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

                  <SimpleBar className="mx-n4 px-4" data-simplebar="init" style={{ maxHeight: "225px" }}>
                    <div className="vstack gap-3">
                      {filteredCandidates.map((candidate) => (
                        <Form
                          key={candidate.id} // Add key prop here to resolve the react/jsx-key error
                          className="tablelist-form"
                          onSubmit={(e) => {
                            e.preventDefault(); // Prevent page refresh
                            const newElectionCandidate = {
                              id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
                              election_id: election_id,
                              candidate_id: candidate.id, // Use the candidate.id directly from the map function
                            };
                            dispatch(addNewElectionCandidate(newElectionCandidate));
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <input type="hidden" id="id-field" />
                            <div className="avatar-xs flex-shrink-0 me-3">
                              <img src={candidate.avatar} alt="" className="img-fluid rounded-circle" />
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="fs-13 mb-0">
                                <Link to="#" className="text-body d-block">{candidate.name}</Link>
                              </h5>
                            </div>
                            <div className="flex-shrink-0">
                              {electionCandidateList.some((item) => item.candidate_id === candidate.id) ? (
                                <button type="button" className="btn btn-success btn-sm" disabled>
                                  ADDED
                                </button>
                              ) : (
                                <button type="submit" className="btn btn-light btn-sm" id="add-btn">
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        </Form>
                      ))}
                    </div>
                  </SimpleBar>
                </ModalBody>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light w-xs" data-bs-dismiss="modal">
                    Cancel
                  </button>
                </div>
              </Modal>

              {/* <Modal
                id="showModal"
                isOpen={modal}
                toggle={toggle}
                centered
                size="lg"
              >
                <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
                  {!!isEdit
                    ? "Edit ElectionCandidate"
                    : "Add ElectionCandidate"}
                </ModalHeader>
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
                    <Row className="g-3">
                      <Col lg={12}></Col>
                      <Col lg={6}>
                        <div>
                          <Label
                            htmlFor="candidate-id-field"
                            className="form-label"
                          >
                            Candidate ID
                          </Label>
                          <Input
                            name="candidate_id"
                            id="candidate-id-field"
                            className="form-control"
                            placeholder="Enter Candidate ID"
                            type="text"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.candidate_id || ""}
                            invalid={
                              validation.touched.candidate_id &&
                                validation.errors.candidate_id
                                ? true
                                : false
                            }
                          />
                          {validation.touched.candidate_id &&
                            validation.errors.candidate_id ? (
                            <FormFeedback type="invalid">
                              {validation.errors.candidate_id}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        color="light"
                        onClick={() => {
                          setModal(false);
                        }}
                      >
                        {" "}
                        Close{" "}
                      </Button>
                      <Button type="submit" color="success" id="add-btn">
                        {" "}
                        {!!isEdit ? "Update" : "Add ElectionCandidate"}{" "}
                      </Button>
                    </div>
                  </ModalFooter>
                </Form>
              </Modal> */}
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
        <Col xxl={3}>
          <Card id="company-view-detail">
            <CardBody className="text-center">
              <div className="position-relative d-inline-block">
                <div className="avatar-md">
                  <div className="avatar-title bg-light rounded-circle">
                    {/* <img src={process.env.REACT_APP_API_URL + "/images/" + (info.image_src || "brands/mail_chimp.png")} alt="" className="avatar-sm rounded-circle object-cover" /> */}
                  </div>
                </div>
              </div>
              <h5 className="mt-3 mb-1">
                {electionCandidateInfo.candidate_details?.name ||
                  "Syntyce Solution"}
              </h5>
              <p className="text-muted">
                {electionCandidateInfo.candidate_details?.name ||
                  "Michael Morris"}
              </p>

              <ul className="list-inline mb-0">
                <li className="list-inline-item avatar-xs">
                  <Link
                    to="#"
                    className="avatar-title bg-soft-success text-success fs-15 rounded"
                  >
                    <i className="ri-global-line"></i>
                  </Link>
                </li>
                <li className="list-inline-item avatar-xs">
                  <Link
                    to="#"
                    className="avatar-title bg-soft-danger text-danger fs-15 rounded"
                  >
                    <i className="ri-mail-line"></i>
                  </Link>
                </li>
                <li className="list-inline-item avatar-xs">
                  <Link
                    to="#"
                    className="avatar-title bg-soft-warning text-warning fs-15 rounded"
                  >
                    <i className="ri-question-answer-line"></i>
                  </Link>
                </li>
              </ul>
            </CardBody>
            <div className="card-body">
              <h6 className="text-muted text-uppercase fw-semibold mb-3">
                Information
              </h6>
              <p className="text-muted mb-4">
                {electionCandidateInfo.candidate_details?.description ||
                  "A company incurs fixed and variable costs such as the purchase of raw materials, salaries and overhead, as explained by AccountingTools, Inc. Business owners have the discretion to determine the actions."}
              </p>
              <div className="table-responsive table-card">
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td className="fw-medium">Industry Type</td>
                      <td>
                        {electionCandidateInfo.candidate_details?.name ||
                          "Chemical Industries"}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-medium">Location</td>
                      <td>
                        {electionCandidateInfo.candidate_details?.name ||
                          "Damascus, Syria"}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-medium">Employee</td>
                      <td>
                        {electionCandidateInfo.candidate_details?.name ||
                          "10-50"}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-medium">Rating</td>
                      {/* <td>
                              {info.star_value || "4.0"}{" "}
                              <i className="ri-star-fill text-warning align-bottom"></i>
                            </td> */}
                    </tr>
                    <tr>
                      <td className="fw-medium">Website</td>
                      <td>
                        <Link
                          to="#"
                          className="link-primary text-decoration-underline"
                        >
                          {electionCandidateInfo.candidate_details?.name ||
                            "www.syntycesolution.com"}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-medium">Contact Email</td>
                      <td>
                        {electionCandidateInfo.candidate_details?.name ||
                          "info@syntycesolution.com"}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-medium">Since</td>
                      <td>
                        {electionCandidateInfo.candidate_details?.name ||
                          "1995"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CandidatesTab;

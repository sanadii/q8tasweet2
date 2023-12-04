import React, { useState, useEffect, useCallback } from "react";
import { Col, Container, Form, FormFeedback, Input, Modal, ModalBody, ModalHeader, Row, Label, } from "reactstrap";
import SimpleBar from "simplebar-react";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../components/Components/DeleteModal";
import BreadCrumb from "../../../components/Components/BreadCrumb";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Store actions
import {
  getTerms as onGetTerms,
  updateTerm as onupdateTerm,
  deleteTerm as onDeleteTerm,
  addNewTerm as onAddNewTerm
} from "../../../store/actions";

const Terms = () => {
  document.title = "To Do Lists | Velzon - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const { termList } = useSelector((state) => ({
    termList: state.Terms.termList,
  }));

  const [termsList, setTermsList] = useState([]);
  const [activeParentTermId, setActiveParentTermId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // Add / Edit / Modals
  const [term, setTerm] = useState(null);
  const [modalTerm, setModalTerm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const changeTermStatus = (e) => {
    const activeTermId = e.target.id.replace("terms", ""); // Remove "terms" from the ID to get the active term ID
    const filteredTermsList = termList.filter(
      (item) => item.parent === Number(activeTermId)
    );

    setActiveParentTermId(Number(activeTermId));
    setTermsList(filteredTermsList);
  };


  useEffect(() => {
    dispatch(onGetTerms());
  }, [dispatch]);

  useEffect(() => {
    setTerm(termList);
    setTermsList(termList);
  }, [termList]);

  const toggle = useCallback(() => {
    if (modalTerm) {
      setModalTerm(false);
      setTerm(null);
    } else {
      setModalTerm(true);
    }
  }, [modalTerm]);

  // Update To do
  const handleTermClick = useCallback(
    (arg) => {
      const term = arg;

      setTerm({
        id: term.id,
        name: term.name,
        parent: term.parent,
        isActive: term.isActive,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Add To do
  const handleTermClicks = () => {
    setTerm("");
    setModalTerm(!modalTerm);
    setIsEdit(false);
    toggle();
  };

  // Delete Terms
  const onClickTermDelete = (term) => {
    setTerm(term);
    setDeleteModal(true);
  };

  const handleDeleteTerm = () => {
    if (term) {
      dispatch(onDeleteTerm(term));
      setDeleteModal(false);
    }
  };

  const searchList = (e) => {
    let inputVal = e.toLowerCase();

    function filterItems(arr, query) {
      return arr.filter(function (el) {
        return el.term.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    }

    let filterData = filterItems(termsList, inputVal);
    setTermsList(filterData);
    if (filterData.length === 0) {
      document.getElementById("noresult").style.display = "block";
      document.getElementById("term-term").style.display = "none";
    } else {
      document.getElementById("noresult").style.display = "none";
      document.getElementById("term-term").style.display = "block";
    }
  };

  const [isMainTerm, setIsMainTerm] = useState(false);

  // State to store the "parent" value
  const [parentValue, setParentValue] = useState(null);

  // Function to handle the toggle change
  const handleToggleChange = () => {
    setIsMainTerm((prevValue) => !prevValue);
    // Set the "parent" value to 0 when the toggle is turned on
    setParentValue(isMainTerm ? 0 : null);
  };



  // Terms validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (term && term.name) || "",
      parent: (term && term.parent) || "",
      // status: (term && term.status) || '',
      // priority: (term && term.priority) || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Term"),
      parent: Yup.string().required("Please Enter Parent"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateTerm = {
          id: term ? term.id : 0,
          name: values.name,
          parent: values.parent,
        };
        // save edit Folder
        dispatch(onupdateTerm(updateTerm));
        validation.resetForm();
      } else {
        const newTerm = {
          id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          name: values.name,
          parent: values.parent,
        };
        // save new Folder
        dispatch(onAddNewTerm(newTerm));
        validation.resetForm();
      }
      toggle();
    },
  });

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteTerm()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Terms" pageTitle="Settings" />

          <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
            <div className="file-manager-sidebar">
              <div className="p-4 d-flex flex-column h-100">
                <div className="mb-3">
                  <button
                    className="btn btn-success w-100"
                    onClick={() => setModalTerm(true)}
                  >
                    <i className="ri-add-line align-bottom"></i> Add Term
                  </button>
                </div>

                <SimpleBar
                  className="px-4 mx-n4"
                  style={{ height: "calc(100vh - 468px)" }}
                >
                  <ul
                    className="to-do-menu list-unstyled"
                    id="termlist-data"
                  >
                    {(termList || []).map((item, index) => (
                      // Add a conditional check for parent === 0 and id !== 0
                      item.parent === 0 && item.id !== 0 && (
                        <li key={item.id}>
                          <Link to="#" className="nav-link fs-13" id={"terms" + item.id}>
                            {item.name}
                          </Link>
                          <div className="sub-menu list-unstyled ps-3 vstack gap-2 mb-2">
                            {(termList || []).map((nestedItem) =>
                              nestedItem.parent === item.id && (
                                <li key={nestedItem.id} onClick={changeTermStatus}>
                                  <Link to="#" className="nav-link fs-13" id={"terms" + nestedItem.id}>
                                    {nestedItem.name}
                                  </Link>
                                </li>
                              )
                            )}
                          </div>
                        </li>
                      )
                    ))}
                  </ul>
                </SimpleBar>

                <div className="mt-auto text-center">
                  {/* <img src={termImg} alt="Term" className="img-fluid" /> */}
                </div>
              </div>
            </div>

            <div className="file-manager-content w-100 p-4 pb-0">
              <div className="p-3 bg-light rounded mb-4">
                <Row className="g-2">
                  <Col className="col-lg">
                    <div className="search-box">
                      <input
                        type="text"
                        id="searchtermsList"
                        className="form-control search"
                        placeholder="Search term name"
                        onKeyUp={(e) => searchList(e.target.value)}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col className="col-lg-auto">
                    <button
                      className="btn btn-primary createTerm"
                      type="button"
                      onClick={() => handleTermClicks()}
                    >
                      <i className="ri-add-fill align-bottom" /> Add Terms
                    </button>
                  </Col>
                </Row>
              </div>

              <div
                className="term-content position-relative px-4 mx-n4"
                id="term-content"
              >
                {!termList && (
                  <div id="elmLoader">
                    <div
                      className="spinner-border text-primary avatar-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                <div className="term-term" id="term-term">
                  <div className="table-responsive">
                    <table className="table align-middle position-relative table-nowrap">
                      <thead className="table-active">
                        <tr>
                          <th scope="col">Term Name</th>
                          <th scope="col">Elections</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>

                      <tbody id="term-list">
                        {(termsList || []).map((item, key) => (
                          // Filter the child terms based on the active parent term ID
                          !activeParentTermId || item.parent === activeParentTermId && (
                            <tr key={key}>
                              <td>
                                <div className="d-flex align-items-start">
                                  <div className="flex-grow-1">
                                    <div className="form-check">
                                      <label
                                        className="form-check-label"
                                        htmlFor={"term" + item.id}
                                      >
                                        {item.name}{" "}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                Hello !
                              </td>
                              <td>
                                <div className="hstack gap-2">
                                  <button
                                    className="btn btn-sm btn-soft-danger remove-list"
                                    onClick={() => onClickTermDelete(item)}
                                  >
                                    <i className="ri-delete-bin-5-fill align-bottom" />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-soft-info edit-list"
                                    onClick={() => handleTermClick(item)}
                                  >
                                    <i className="ri-pencil-fill align-bottom" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="py-4 mt-4 text-center"
                  id="noresult"
                  style={{ display: "none" }}
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/msoeawqm.json"
                    trigger="loop"
                    colors="primary:#405189,secondary:#0ab39c"
                    style={{ width: "72px", height: "72px" }}
                  ></lord-icon>
                  <h5 className="mt-4">Sorry! No Result Found</h5>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Modal
        id="createTerm"
        isOpen={modalTerm}
        toggle={toggle}
        modalClassName="zoomIn"
        centered
        tabIndex="-1"
      >
        <ModalHeader toggle={toggle} className="p-3 bg-soft-success">
          {" "}
          {!!isEdit ? "Edit Term" : "Create Term"}{" "}
        </ModalHeader>
        <ModalBody>
          <Form
            id="creatterm-form"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <input type="hidden" id="termid-input" className="form-control" />
            <div className="mb-3">
              <label htmlFor="term-name-input" className="form-label">
                Term Title
              </label>
              <Input
                type="text"
                id="term-name-input"
                className="form-control"
                placeholder="Enter term name"
                name="name"
                validate={{ required: { value: true } }}
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
              <div className="form-check form-switch form-switch-success mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="SwitchCheck3"
                  checked={isMainTerm}
                  onChange={handleToggleChange}
                />
                <label className="form-check-label" htmlFor="SwitchCheck3">
                  is Main Term?
                </label>
              </div>

              {/* Show the "Parent Term" input field when the toggle is on */}
              {isMainTerm && (
                <div className="mb-3">
                  <label htmlFor="term-name-input" className="form-label">
                    Parent Term
                  </label>
                  <input
                    type="text"
                    id="term-name-input"
                    className="form-control"
                    placeholder="Enter term name"
                    name="name"
                    validate={{ required: { value: true } }}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={validation.touched.name && validation.errors.name}
                  />
                  {validation.touched.name && validation.errors.name && (
                    <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                  )}
                </div>
              )}
            </div>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-ghost-success"
                onClick={() => setModalTerm(false)}
              >
                <i className="ri-close-fill align-bottom"></i> Close
              </button>
              <button type="submit" className="btn btn-primary" id="addNewTerm">
                {!!isEdit ? "Save" : "Add Term"}
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Terms;

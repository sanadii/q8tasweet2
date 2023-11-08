// React & Redux core imports
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Store Actions & Selectors
import { getGroups, addNewGroup, updateGroup, deleteGroup } from "store/actions";
import { authSelector } from 'Selectors';

// Components & Hooks
import DeleteModal from "components/Components/DeleteModal";
import BreadCrumb from "components/Components/BreadCrumb";
import useGroupManager from "hooks/GroupHook"

// Formik & Validations
import { useFormik } from "formik";
import * as Yup from "yup";

// UI Components & styling imports
import { Col, Container, Form, FormFeedback, Input, Modal, ModalBody, ModalHeader, Row, Label } from "reactstrap";
import SimpleBar from "simplebar-react";
import { ToastContainer } from "react-toastify";


const Groups = () => {
  document.title = "المجموعات | Q8Tasweet - React Admin & Dashboard Template";
  const dispatch = useDispatch();

  // State Management
  const { groups, categories } = useSelector(authSelector);

  // State Hooks
  const [deleteModal, setDeleteModal] = useState(false);

  // State Hooks
  const [group, setGroup] = useState(null);
  const [modalGroup, setModalGroup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Dispatch to get Groups
  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  // Modal
  const toggle = useCallback(() => {
    if (modalGroup) {
      setModalGroup(false);
      setGroup(null);
    } else {
      setModalGroup(true);
    }
  }, [modalGroup]);


  // Update Group For Add/Edit/Delete
  const handleCategoryClick = useCallback(
    (arg) => {
      const group = arg;
      setGroup({
        id: group.id,
        name: group.name,
        category: group.category,
      });
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Add To do
  const handleCategoryClicks = () => {
    setGroup("");
    setModalGroup(!modalGroup);
    setIsEdit(false);
    toggle();
  };

  // Delete Categories
  const onClickCategoryDelete = (groups) => {
    setGroup(groups);
    setDeleteModal(true);
  };

  const handleDeleteCategory = () => {
    if (groups) {
      dispatch(deleteGroup(groups));
      setDeleteModal(false);
    }
  };


  // Handle Category Toggle
  const [isCategory, setIsMainGroup] = useState(false);

  // State to store the "category" value
  const [categoryValue, setCategoryValue] = useState(null);

  // Function to handle the toggle change
  const handleToggleChange = () => {
    setIsMainGroup((prevValue) => !prevValue);
    // Set the "category" value to 0 when the toggle is turned on
    setCategoryValue(isCategory ? 0 : null);
  };

  // Categories validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (groups && groups.name) || "",
      category: (groups && groups.category) || "",
    },
    validationSchema: Yup.object({
      // name: Yup.string().required("Please Enter Category"),
      // category: Yup.string().required("Please Enter Category"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedCategory = {
          id: groups ? groups.id : 0,
          name: values.name,
          category: values.category,
        };
        // save edit Folder
        dispatch(updateGroup(updatedCategory));
        validation.resetForm();
      } else {
        const newCategory = {
          name: values.name,
          category: values.category,
        };
        // save new Folder
        dispatch(addNewGroup(newCategory));
        validation.resetForm();
      }
      toggle();
    },
  });

  const {
    categoryOptions,
    groupOptions,
    changeGroupsOptions,
    activeCategoryCategoryId
  } = useGroupManager(categories, groups, validation);

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteCategory()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Categories" pageTitle="Settings" />

          <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
            <div className="file-manager-sidebar">
              <div className="p-4 d-flex flex-column h-100">
                <div className="mb-3">
                  <button
                    className="btn btn-success w-100"
                    onClick={() => setModalGroup(true)}
                  >
                    <i className="ri-add-line align-bottom"></i> إضافة مجموعة
                  </button>
                </div>

                <SimpleBar
                  className="px-4 mx-n4"
                  style={{ height: "calc(100vh - 468px)" }}
                >
                  <ul
                    className="to-do-menu list-unstyled"
                    id="CategoryList-data"
                  >
                    {(categoryOptions || []).map((item, index) => (
                      // Add a conditional check for category === 0 and id !== 0
                      <li key={item.id}>
                        <Link
                          to="#"
                          className="nav-link fs-13"
                          id={item.id}
                          onClick={(e) => changeGroupsOptions({ ...e, target: { ...e.target, value: item.id } })}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </SimpleBar>

                <div className="mt-auto text-center">
                  {/* <img src={categoryImg} alt="Category" className="img-fluid" /> */}
                </div>
              </div>
            </div>

            <div className="file-manager-content w-100 p-4 pb-0">
              <div className="p-3 bg-light rounded mb-4">
                <Row className="g-2">
                  <Col className="col-lg-auto">
                    <button
                      className="btn btn-primary createCategory"
                      type="button"
                      onClick={() => handleCategoryClicks()}
                    >
                      <i className="ri-add-fill align-bottom" /> إضافة مجموعة
                    </button>
                  </Col>
                </Row>
              </div>

              <div
                className="category-content position-relative px-4 mx-n4"
                id="category-content"
              >
                {!categoryOptions && (
                  <div id="elmLoader">
                    <div
                      className="spinner-border text-primary avatar-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                <div className="category-category" id="category-category">
                  <div className="table-responsive">
                    <table className="table align-middle position-relative table-nowrap">
                      <thead className="table-active">
                        <tr>
                          <th scope="col">المجموعة</th>
                          <th scope="col">التصنيف</th>
                          <th scope="col">إجراءات</th>
                        </tr>
                      </thead>

                      <tbody id="category-list">
                        {(groupOptions || []).map(
                          (item, key) => (
                            // Filter the child Categories based on the active category category ID
                            !activeCategoryCategoryId ||
                            (item.category === activeCategoryCategoryId && (
                              <tr key={key}>
                                <td>
                                  <div className="d-flex align-items-start">
                                    <div className="flex-grow-1">
                                      <div className="form-check">
                                        <label
                                          className="form-check-label"
                                          htmlFor={"category" + item.id}
                                        >
                                          {item.name}{" "}
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td>category</td>
                                <td>
                                  <div className="hstack gap-2">
                                    <button
                                      className="btn btn-sm btn-soft-danger remove-list"
                                      onClick={() => onClickCategoryDelete(item)}
                                    >
                                      <i className="ri-delete-bin-5-fill align-bottom" />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-soft-info edit-list"
                                      onClick={() => handleCategoryClick(item)}
                                    >
                                      <i className="ri-pencil-fill align-bottom" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                            ))
                        )}
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
        id="createCategory"
        isOpen={modalGroup}
        toggle={toggle}
        modalClassName="zoomIn"
        centered
        tabIndex="-1"
      >
        <ModalHeader toggle={toggle} className="p-3 bg-soft-success">
          {" "}
          {!!isEdit ? "Edit Category" : "Create Category"}{" "}
        </ModalHeader>
        <ModalBody>
          <Form
            id="creatcategory-form"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <input
              type="hidden"
              id="categoryid-input"
              className="form-control"
            />
            <div className="mb-3">
              <label htmlFor="category-name-input" className="form-label">
                Category Name
              </label>
              <Input
                type="text"
                id="category-name-input"
                className="form-control"
                placeholder="Enter category name"
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
                  checked={isCategory}
                  onChange={handleToggleChange}
                />
                <label className="form-check-label" htmlFor="SwitchCheck3">
                  is Main Category?
                </label>
              </div>

              {/* Show the "Category Category" input field when the toggle is on */}
              {isCategory && (
                <div className="mb-3">
                  <label htmlFor="category-name-input" className="form-label">
                    Category Category
                  </label>
                  <input
                    type="text"
                    id="category-name-input"
                    className="form-control"
                    placeholder="Enter category name"
                    name="name"
                    validate={{ required: { value: true } }}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={validation.touched.name && validation.errors.name}
                  />
                  {validation.touched.name && validation.errors.name && (
                    <FormFeedback type="invalid">
                      {validation.errors.name}
                    </FormFeedback>
                  )}
                </div>
              )}
            </div>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-ghost-success"
                onClick={() => setModalGroup(false)}
              >
                <i className="ri-close-fill align-bottom"></i> Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                id="addNewCategory"
              >
                {!!isEdit ? "Save" : "Add Category"}
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Groups;

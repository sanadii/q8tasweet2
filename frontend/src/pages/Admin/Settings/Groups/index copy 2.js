// External Libraries
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import SimpleBar from "simplebar-react";
import { ToastContainer } from "react-toastify";
import { Col, Container, Form, FormFeedback, Input, Modal, ModalBody, ModalHeader, Row, Label } from "reactstrap";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getGroups, updateGroup, deleteGroup, addNewGroup } from "store/actions";

import { authSelector } from 'Selectors';

// Components & Hooks
import DeleteModal from "components/Components/DeleteModal";
import BreadCrumb from "components/Components/BreadCrumb";



const Groups = () => {
  document.title = "المجموعات | Q8Tasweet - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const { groups, categories } = useSelector(authSelector);

  // State hooks
  const [groupList, setGroupList] = useState(groups); // Original, unfiltered list
  const [filteredGroupList, setFilteredGroupList] = useState(groups); // The list that gets updated on search
  const [showNoResult, setShowNoResult] = useState(false);

  const [categoryList, setCategoryList] = useState(categories);
  const [modalCategory, setModalCategory] = useState(false);
  const [categoryData, setCategoryData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isMainCategory, setIsMainCategory] = useState(false);
  const [parentValue, setParentValue] = useState(null);

  // Effects
  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  useEffect(() => {
    setGroupList(groups);
    setCategoryList(categories);
  }, [groups, categories]);

  const toggleModalCategory = useCallback(() => {
    setModalCategory(prev => !prev);
    if (modalCategory) {
      setCategoryData(null);
    }
  }, [modalCategory]);

  const handleCategoryClick = useCallback((selectedCategory) => {
    setCategoryData({
      id: selectedCategory.id,
      name: selectedCategory.name,
      parent: selectedCategory.parent,
      isActive: selectedCategory.isActive,
    });
    setIsEdit(true);
    toggleModalCategory();
  }, [toggleModalCategory]);

  // Add To do
  const handleCategoryClicks = () => {
    setCategoryList("");
    setModalCategory(!modalCategory);
    setIsEdit(false);
    toggle();
  };

  // Delete Categories
  const onClickCategoryDelete = (category) => {
    setCategoryList(category);
    setDeleteModal(true);
  };

  const handleDeleteCategory = () => {
    if (category) {
      dispatch(deleteGroup(category));
      setDeleteModal(false);
    }
  };


  const searchList = (e) => {
    const inputVal = e.target.value.toLowerCase();
    const filteredData = groupList.filter(el => el.category.toLowerCase().includes(inputVal));

    setFilteredGroupList(filteredData);
    setShowNoResult(filteredData.length === 0);
  };

  // Function to handle the toggle change
  const handleToggleChange = () => {
    setIsMainCategory((prevValue) => !prevValue);
    // Set the "parent" value to 0 when the toggle is turned on
    setParentValue(isMainCategory ? 0 : null);
  };

  // Categories validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (category && category.name) || "",
      category: (category && category.category) || "",
    },
    validationSchema: Yup.object({
      // name: Yup.string().required("Please Enter Category"),
      // parent: Yup.string().required("Please Enter Parent"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedCategory = {
          id: category ? category.id : 0,
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
    changeSubCategoriesOptions,
    activeParentCategoryId
  } = useCategoryManager(categories, subCategories, validation);


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
                    onClick={() => setModalCategory(true)}
                  >
                    <i className="ri-add-line align-bottom"></i> Add Category
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
                      // Add a conditional check for parent === 0 and id !== 0
                      <li key={item.id}>
                        <Link
                          to="#"
                          className="nav-link fs-13"
                          id={item.id}
                          onClick={(e) => changeSubCategoriesOptions({ ...e, target: { ...e.target, value: item.id } })}
                        >
                          {item.name}
                        </Link>
                        <div className="sub-menu list-unstyled ps-3 vstack gap-2 mb-2">
                          {(categoryOptions || []).map(
                            (nestedItem) =>
                              nestedItem.parent === item.id && (
                                <li
                                  key={nestedItem.id}
                                  onClick={changeSubCategoriesOptions}
                                >
                                  <Link
                                    to="#"
                                    className="nav-link fs-13"
                                    id={"Categories" + nestedItem.id}
                                  >
                                    {nestedItem.name}
                                  </Link>
                                </li>
                              )
                          )}
                        </div>
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
                  <Col className="col-lg">
                    <div className="search-box">
                      <input
                        type="text"
                        id="searchgroupList"
                        className="form-control search"
                        placeholder="Search category name"
                        onKeyUp={(e) => searchList(e.target.value)}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col className="col-lg-auto">
                    <button
                      className="btn btn-primary createCategory"
                      type="button"
                      onClick={() => handleCategoryClicks()}
                    >
                      <i className="ri-add-fill align-bottom" /> Add Categories
                    </button>
                  </Col>
                </Row>
              </div>

              <div
                className="category-content position-relative px-4 mx-n4"
                id="category-content"
              >
                {!categoryList && (
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
                          <th scope="col">Category Name</th>
                          <th scope="col">Elections</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>

                      <tbody id="category-list">
                        {(groupOptions || []).map(
                          (item, key) => (
                            // Filter the child Categories based on the active parent category ID
                            !activeParentCategoryId ||
                            (item.parent === activeParentCategoryId && (
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
                                <td>Hello !</td>
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
        isOpen={modalCategory}
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
                  checked={isMainCategory}
                  onChange={handleToggleChange}
                />
                <label className="form-check-label" htmlFor="SwitchCheck3">
                  is Main Category?
                </label>
              </div>

              {/* Show the "Parent Category" input field when the toggle is on */}
              {isMainCategory && (
                <div className="mb-3">
                  <label htmlFor="category-name-input" className="form-label">
                    Parent Category
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
                onClick={() => setModalCategory(false)}
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

import React, { useState, useEffect, useCallback } from "react";
import { Col, Container, Form, FormFeedback, Input, Modal, ModalBody, ModalHeader, Row, Label } from "reactstrap";
import SimpleBar from "simplebar-react";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "components/Components/DeleteModal";
import BreadCrumb from "components/Components/BreadCrumb";
import { electionsSelector } from 'Selectors/electionsSelector';
import useGroupManager from "hooks/CategoryHooks";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Store actions
import {
  getGroups as onGetGroups,
  updateGroup as onUpdateGroup,
  deleteGroup as onDeleteGroup,
  addNewGroup as onAddNewGroup,
} from "../../../../store/actions";

const Categories = () => {
  document.title = "المجموعات | Q8Tasweet - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  // ------------ Image Upload Helper ------------
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };
  const formData = new FormData();
  if (!selectedImage) {
    // 
  } else {
    formData.append("image", selectedImage);
    formData.append("folder", "elections"); // replace "yourFolderName" with the actual folder name
  }


  const { categories, subCategories } = useSelector(electionsSelector);
  const [categoryList, setCategoryList] = useState(categories);
  const [groupList, setSubCategoryList] = useState(subCategories);

  useEffect(() => {
    setSubCategoryList(subCategories);
  }, [subCategories]);

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  const [deleteModal, setDeleteModal] = useState(false);



  // Add / Edit / Modals
  const [category, setCategory] = useState(null);
  const [modalCategory, setModalCategory] = useState(false);
  const [isEdit, setIsEdit] = useState(false);


  useEffect(() => {
    dispatch(onGetCategories());
  }, [dispatch]);

  useEffect(() => {
    setCategory(categoryList);
    setSubCategoryList(categoryList);
  }, [categoryList]);

  const toggle = useCallback(() => {
    if (modalCategory) {
      setModalCategory(false);
      setCategory(null);
    } else {
      setModalCategory(true);
    }
  }, [modalCategory]);

  // Update To do
  const handleCategoryClick = useCallback(
    (arg) => {
      const category = arg;

      setCategory({
        id: category.id,
        name: category.name,
        parent: category.parent,
        image: category.image,
        isActive: category.isActive,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Add To do
  const handleCategoryClicks = () => {
    setCategory("");
    setModalCategory(!modalCategory);
    setIsEdit(false);
    toggle();
  };

  // Delete Categories
  const onClickCategoryDelete = (category) => {
    setCategory(category);
    setDeleteModal(true);
  };

  const handleDeleteCategory = () => {
    if (category) {
      dispatch(onDeleteCategory(category));
      setDeleteModal(false);
    }
  };

  const searchList = (e) => {
    let inputVal = e.toLowerCase();

    function filterItems(arr, query) {
      return arr.filter(function (el) {
        return el.category.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    }

    let filterData = filterItems(groupList, inputVal);
    setSubCategoryList(filterData);
    if (filterData.length === 0) {
      document.getElementById("noresult").style.display = "block";
      document.getElementById("category-category").style.display = "none";
    } else {
      document.getElementById("noresult").style.display = "none";
      document.getElementById("category-category").style.display = "block";
    }
  };
  console.log(categories, subCategories);

  const [isMainCategory, setIsMainCategory] = useState(false);

  // State to store the "parent" value
  const [parentValue, setParentValue] = useState(null);

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
      parent: (category && category.parent) || "",
      image: (category && category.image) || "",
      selectedImage: selectedImage,
      // status: (category && category.status) || '',
      // priority: (category && category.priority) || '',
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
          image: values.image,
          selectedImage: selectedImage,
          parent: values.parent,
        };
        // save edit Folder
        dispatch(onUpdateCategory({cateogy: updatedCategory, formData: formData}));
        validation.resetForm();
      } else {
        const newCategory = {
          name: values.name,
          image: values.image,
          selectedImage: selectedImage,
          parent: values.parent,
        };
        // save new Folder
        dispatch(onAddNewCategory(newCategory));
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
            <Col lg={6}>
              <div>
                <Label for="emage-field" className="form-label">
                  Upload Image
                </Label>
                <div className="text-center">
                  <label
                    htmlFor="emage-field"
                    className="mb-0"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title=""
                    data-bs-original-title="Select Image"
                  >
                    <div className="position-relative d-inline-block">
                      <div className="position-absolute top-100 start-100 translate-middle">
                        <div className="avatar-xs">
                          <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                            <i className="ri-image-fill"></i>
                          </div>
                        </div>
                      </div>
                      <div
                        className="avatar-xl"
                        style={{
                          width: "250px",
                          height: "250px",
                          overflow: "hidden",
                          cursor: "pointer", // Add this line
                          backgroundImage: `url(${validation.values.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    </div>
                    <input
                      className="form-control d-none"
                      id="emage-field"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={(e) => {
                        handleImageSelect(e);
                        const selectedImage = e.target.files[0];
                        if (selectedImage) {
                          const reader = new FileReader();
                          reader.onloadend = () => {

                            const imgElement =
                              document.querySelector(".avatar-xl");
                            if (imgElement) {
                              imgElement.style.backgroundImage = `url(${reader.result})`;
                            }
                          };
                          reader.readAsDataURL(selectedImage);
                        }
                      }}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.image && validation.errors.image
                          ? "true"
                          : undefined
                      }
                    />
                  </label>
                </div>
                {validation.touched.image && validation.errors.image ? (
                  <FormFeedback type="invalid">
                    {validation.errors.image}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
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

export default Categories;

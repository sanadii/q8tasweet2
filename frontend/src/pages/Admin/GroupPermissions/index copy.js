// React & Redux core imports
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Store Actions & Selectors
import { getGroupPermissions } from "store/actions";
import { authSelector } from 'selectors';

// Components & Hooks
import { BreadCrumb } from "shared/components";
import { useGroupManager } from "shared/hooks"


// UI Components & styling imports
import { Container } from "reactstrap";
import SimpleBar from "simplebar-react";
import { ToastContainer } from "react-toastify";


const Permissions = () => {
  document.title = "المجموعات | Q8Tasweet - React Admin & Dashboard Template";
  const dispatch = useDispatch();

  // State Management
  const { groups, categories } = useSelector(authSelector);


  // State Hooks
  const [group, setGroup] = useState(null);
  const [modalGroup, setModalGroup] = useState(false);

  // Dispatch to get Groups
  useEffect(() => {
    dispatch(getGroupPermissions());
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


  const {
    categoryOptions,
    groupOptions,
    changeGroupsOptions,
    activeCategoryCategoryId
  } = useGroupManager(categories, groups);

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />

      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Categories" pageTitle="Settings" />

          <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
            <div className="file-manager-sidebar">
              <div className="p-4 d-flex flex-column h-100">

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


    </React.Fragment>
  );
};

export default Permissions;

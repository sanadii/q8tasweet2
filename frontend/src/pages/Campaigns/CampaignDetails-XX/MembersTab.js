// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  addNewCampaignMember,
  updateCampaignMember,
  deleteCampaignMember,
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

const MembersTab = ({ campaignMembers }) => {
  const dispatch = useDispatch();

  const { allUsers, isCampaignMemberSuccess, error } = useSelector((state) => ({
    allUsers: state.Users.users,
    isCampaignMemberSuccess: state.Campaigns.isCampaignMemberSuccess,
    error: state.Campaigns.error,
  }));

  const [memberList, setMemberList] = useState(campaignMembers);

  const [searchUserInput, setSearchUserInput] = useState("");
  const userList = campaignMembers.filter((user) =>
    user.name.toLowerCase().includes(searchUserInput.toLowerCase())
  );

  const openModal = () => setModal(!modal);

  const campaign_id = useSelector(
    (state) => state.Campaigns.campaignDetails.id
  );

  const [isEdit, setIsEdit] = useState(false);
  const [campaignMember, setCampaignMember] = useState([]);

  //Delete Election Member
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);

  // Toggle
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCampaignMember(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteCampaignMember = () => {
    if (campaignMember) {
      dispatch(deleteCampaignMember(campaignMember.id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (campaignMember) => {
    setCampaignMember(campaignMember);
    setDeleteModal(true);
  };

  // Add Dataa
  // handleCampaignMemberClicks Function
  const handleCampaignMemberClicks = () => {
    setCampaignMember(""); // Changed from empty string to null
    setIsEdit(false);
    toggle();
  };

  // Update Data
  const handleCampaignMemberClick = useCallback(
    (arg) => {
      const campaignMember = arg;
      setCampaignMember({
        id: campaignMember.id,
        campaign_id: campaignMember.campaign_id,
        user_id: campaignMember.user_id,
        // rank: campaignMember.rank,
        // role: campaignMember.role,
        // status: campaignMember.status,
        // notes: campaignMember.notes,
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
      campaign_id: (campaignMember && campaignMember.campaign_id) || "",
      user_id: (campaignMember && campaignMember.user_id) || "",
      // rank: (campaignMember && campaignMember.rank) || null, // Set to null instead of ""
      // role: (campaignMember && campaignMember.role) || null, // Set to null instead of ""
      // status: (campaignMember && campaignMember.status) || "",
      // notes: (campaignMember && campaignMember.notes) || "",
    },
    validationSchema: Yup.object({
      // member_id: Yup.string().required("Please Enter Member ID"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedCampaignMember = {
          id: campaignMember ? campaignMember.id : 0,
          campaign_id: values.campaign_id,
          user_id: values.user_id,
          // email: values.email,
          // rank: values.rank,
          // status: values.status,
          // remarks: values.remarks,
          // notes: values.notes,
        };
        dispatch(updateCampaignMember(updatedCampaignMember));
      } else {
        const newCampaignMember = {
          id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
          campaign_id: campaign_id,
          user_id: values["user_id"],
        };
        console.log(
          "Dispatching addNewCampaignMember with:",
          newCampaignMember
        );
        dispatch(addNewCampaignMember(newCampaignMember));
      }
      validation.resetForm();
      toggle();
    },
  });

  // Dispatch getCandidate TODO: MOVE TO ELECTION DETAILS
  useEffect(() => {
    if (allUsers && !allUsers.length) {
      dispatch(getUsers());
    }
  }, [dispatch, allUsers]);

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".campaignMemberCheckBox");

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
      dispatch(deleteCampaignMember(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".campaignMemberCheckBox:checked");
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
              className="campaignMemberCheckBox form-check-input"
              value={cellProps.row.original.id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "id",
      },
      {
        Header: "ID",
        Cell: (cellProps) => {
          return <p> {cellProps.row.original.id}</p>;
        },
      },
      {
        Header: "Member",
        filterable: true,
        Cell: (campaignMember) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                {campaignMember.row.original.image ? (
                  // Use the ImageCircle component here
                  <ImageCircle imagePath={campaignMember.row.original.image} />
                ) : (
                  <div className="flex-shrink-0 avatar-xs me-2">
                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                      {campaignMember.row.original.name.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-grow-1 ms-2 name">
                {campaignMember.row.original.name}
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Rank",
        accessor: "rank",
        filterable: false,
        Cell: (cellProps) => {
          return <p> {cellProps.row.original.role}</p>;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        filterable: false,
        Cell: (cellProps) => {
          return <p>{cellProps.row.original.status}</p>;
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
                    // const campaignMemberInfo = cellProps.row.original;
                    // setCampaignMemberInfo(campaignMemberInfo);
                    // console.log("campaignMemberInfo", campaignMemberInfo);
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
                    const campaignMemberInfo = cellProps.row.original;
                    handleCampaignMemberClick(campaignMemberInfo);
                  }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="remove-item-btn"
                  onClick={() => {
                    const campaignMemberInfo = cellProps.row.original;
                    onClickDelete(campaignMemberInfo);
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
    [handleCampaignMemberClick, checkedAll]
  );

  // // Export Modal
  // const [isExportCSV, setIsExportCSV] = useState(false);

  return (
    <React.Fragment>
      {/* <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={CampaignMembers}
          /> */}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCampaignMember}
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
            <Card id="memberList">
              <CardBody className="pt-0">
                <div>
                  {memberList.length ? (
                    <TableContainer
                      setDeleteModalMulti={setDeleteModalMulti}
                      setIsEdit={setIsEdit}
                      toggle={toggle}
                      isGlobalHeader={true}
                      //
                      isMultiDeleteButton={isMultiDeleteButton}
                      columns={columns}
                      data={memberList || []}
                      isGlobalFilter={true}
                      SearchPlaceholder="Search for Election Candidates..."
                      customPageSize={50}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-2"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleCampaignMemberClick={handleCampaignMemberClicks}
                    />
                  ) : (
                    <Loader error={error} />
                  )}
                </div>
                <Modal
                  isOpen={modal}
                  toggle={openModal}
                  centered
                  className="border-0"
                >
                  <ModalHeader
                    toggle={openModal}
                    className="p-3 ps-4 bg-soft-success"
                  >
                    Members
                  </ModalHeader>

                  {/* Wrap the content with the Form component */}
                  <ModalBody className="p-4">
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
                        {allUsers.map((user) => (
                          <Form
                            key={user.id} // Add key prop here to resolve the react/jsx-key error
                            className="tablelist-form"
                            onSubmit={(e) => {
                              e.preventDefault(); // Prevent page refresh
                              console.log(
                                "Submitting form for user ID:",
                                user.id
                              );
                              const newCampaignMember = {
                                id: (
                                  Math.floor(Math.random() * (100 - 20)) + 20
                                ).toString(),
                                campaign_id: campaign_id,
                                user_id: user.id,
                              };
                              console.log(
                                "New campaign member:",
                                newCampaignMember
                              );
                              dispatch(addNewCampaignMember(newCampaignMember));
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <input
                                type="hidden"
                                id="id-field"
                                name="id"
                                value={user.id}
                                onChange={validation.handleChange}
                              />
                              {user.id}
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
                                    {user.username}
                                  </Link>
                                </h5>
                              </div>
                              <div className="flex-shrink-0">
                                {campaignMembers.some(
                                  (item) => item.user_id === user.id
                                ) ? (
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    disabled
                                  >
                                    ADDED
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    className="btn btn-light btn-sm"
                                    id="add-btn"
                                  >
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
                    <button
                      type="button"
                      className="btn btn-light w-xs"
                      data-bs-dismiss="modal"
                    >
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
                    {!!isEdit ? "Edit CampaignMember" : "Add CampaignMember"}
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
                              htmlFor="member-id-field"
                              className="form-label"
                            >
                              Member ID
                            </Label>
                            <Input
                              name="member_id"
                              id="member-id-field"
                              className="form-control"
                              placeholder="Enter Member ID"
                              type="text"
                              validate={{
                                required: { value: true },
                              }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.member_id || ""}
                              invalid={
                                validation.touched.member_id &&
                                validation.errors.member_id
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.member_id &&
                            validation.errors.member_id ? (
                              <FormFeedback type="invalid">
                                {validation.errors.member_id}
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
                          {!!isEdit ? "Update" : "Add CampaignMember"}{" "}
                        </Button>
                      </div>
                    </ModalFooter>
                  </Form>
                </Modal> */}
                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default MembersTab;

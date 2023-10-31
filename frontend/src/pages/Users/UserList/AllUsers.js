// React & Redux
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Row, Card, CardBody } from "reactstrap";

// Actions
import { getUsers, deleteUser, getModeratorUsers } from "store/actions";

// Custom Components & ConstantsImports
import { AvatarList, Loader, DeleteModal, TableContainer, TableContainerHeader } from "Common/Components";
import UserModal from "./UsersModal";
import { Id, Name, Username, Status, CreateBy, Actions } from "./UsersListCol";

// Toast & Styles
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// React FilePond & Styles
import { registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AllUsers = () => {
  const dispatch = useDispatch();

  // State Management
  const { users, moderators, isUserSuccess, error } = useSelector((state) => ({
    users: state.Users.users,
    moderators: state.Users.moderators,
    isUserSuccess: state.Users.isUserSuccess,
    error: state.Users.error,
  }));

  const [userList, setUserList] = useState(users);
  const [user, setUser] = useState([]);
  const [userElections, setUserElections] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // User Data
  useEffect(() => {
    if (users && !users.length) {
      dispatch(getUsers());
    }
  }, [dispatch, users]);

  useEffect(() => {
    setUserList(users);
  }, [users]);

  // Moderators
  useEffect(() => {
    if (moderators && !moderators.length) {
      dispatch(getModeratorUsers());
    }
  }, [dispatch, moderators]);

  const [moderatorsMap, setModeratorsMap] = useState({});

  useEffect(() => {
    Promise.resolve(moderators).then((moderatorsList) => {
      const map = moderatorsList.reduce((acc, moderator) => {
        acc[moderator.id] = moderator;
        return acc;
      }, {});

      setModeratorsMap(map);
    });
  }, [moderators]);

  // Delete User
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setUser(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);

  // Delete Data
  const onClickDelete = (user) => {
    setUser(user);
    setDeleteModal(true);
  };

  // Delete Data
  const handleDeleteUser = () => {
    if (user) {
      dispatch(deleteUser(user.id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleUserClick = useCallback(
    (arg) => {
      const user = arg;

      setUser({
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Add Data
  const handleUserClicks = () => {
    setUser("");
    setIsEdit(false);
    toggle();
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".userCheckBox");

    if (checkall.checked) {
      checkedEntry.forEach((checkedEntry) => {
        checkedEntry.checked = true;
      });
    } else {
      checkedEntry.forEach((checkedEntry) => {
        checkedEntry.checked = false;
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
      dispatch(deleteUser(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(".userCheckBox:checked");
    checkedEntry.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(checkedEntry);
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
              className="userCheckBox form-check-input"
              value={cellProps.row.original.id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        Header: "الرمز",
        accessor: "id",
        filterable: false,
        Cell: (cellProps) => {
          return <Id {...cellProps} />;
        },
      },
      {
        Header: "الإسم",
        accessor: "fullName",
        filterable: false,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "اسم المستخدم",
        accessor: "username",
        filterable: false,
        Cell: (cellProps) => {
          return <Username {...cellProps} />;
        },
      },
      {
        Header: "الحالة",
        accessor: "status",
        filterable: true,
        // useFilters: true,

        Cell: (cellProps) => {
          return <Status status={cellProps.row.original.status} />;
        },
      },
      {
        Header: "إجراءات",
        accessor: "user",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <Actions
              {...cellProps}
              handleUserClick={handleUserClick}
              onClickDelete={onClickDelete}
            />
          );
        },
      },
    ],
    [handleUserClick, checkedAll]
  );

  // Dates
  const defaultdate = () => {
    let d = new Date();
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const [dueDate, setDate] = useState(defaultdate());

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
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
      <UserModal
        modal={modal}
        toggle={toggle}
        user={user}
        isEdit={isEdit}
        setModal={setModal}
      />
      <Row>
        <Col lg={12}>
          <Card id="memberList">
            <CardBody>
              <TableContainerHeader
                // Title
                ContainerHeaderTitle="قائمة المستخدمين"

                // Add Elector Button
                isContainerAddButton={true}
                AddButtonText="إضافة مستخدم"
                isEdit={isEdit}
                handleEntryClick={handleUserClicks}
                toggle={toggle}

                // Delete Button
                isMultiDeleteButton={isMultiDeleteButton}
                setDeleteModalMulti={setDeleteModalMulti}
              />

              {isUserSuccess && users.length ? (
                <TableContainer
                  // Header
                  isTableContainerHeader={true}
                  setIsEdit={setIsEdit}
                  toggle={toggle}
                  isContainerAddButton={true}
                  isEdit={isEdit}
                  // Filters
                  isGlobalFilter={true}
                  preGlobalFilteredRows={true}
                  isUserGenderFilter={true}
                  // isGlobalSearch={true}
                  // isUserListFilter={true}
                  // isCustomerFilter={isCustomerFilter}
                  // FieldFiters
                  isFieldFilter={true}
                  isResetFilters={true}
                  isStatusFilter={true}
                  // isTestFilter={true}

                  // Table
                  columns={columns}
                  data={userList || []}
                  setUserList={setUserList}
                  // isStatusFilter={true}
                  // isGlobalPagination={true}
                  // isColumnFilter={true} // Change the prop name
                  // isUserSuserFilter={true}
                  // isSuserFilter={true}

                  SearchPlaceholder="Search for users or something..."
                  // useFilters={true}
                  customPageSize={20}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light table-nowrap"
                  thClass="table-light text-muted"
                  handleEntryClick={handleUserClicks}
                />
              ) : (
                <Loader error={error} />
              )}
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AllUsers;

// React & Redux
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
<<<<<<< HEAD
import { getUsers, deleteUser } from "store/actions";
import { userSelector } from 'selectors';
=======
import { getUsers, deleteUser, getGroups } from "store/actions";
import { userSelector, groupSelector } from 'selectors';
>>>>>>> sanad

// Custom Components & ConstantsImports
import UserModal from "./UserModal";
import { Id, CheckboxHeader, CheckboxCell, Name, Username, Actions } from "./UserListCol";
import { AvatarList, Loader, DeleteModal, TableContainer, TableContainerHeader } from "shared/components";
import { useDelete } from "shared/hooks"

// Toast & Styles
import { Col, Row, Card, CardBody } from "reactstrap";
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
  const { users, isUserSuccess, error } = useSelector(userSelector);
<<<<<<< HEAD


  // Delete Hook
  const {
    handleDeleteItem,
    onClickDelete,
    deleteModal,
    setDeleteModal,
    checkedAll,
    deleteCheckbox,
    isMultiDeleteButton,
    deleteModalMulti,
    setDeleteModalMulti,
    deleteMultiple,
  } = useDelete(deleteUser);

  console.log("checkedAll: ", checkedAll)
=======
  const { groups, categories } = useSelector(groupSelector);

  const transformGroups = (categories, groups) => {
    return categories.map(category => {
      return {
        label: category.name,
        options: groups
          .filter(group => group.category === category.id)
          .map(group => ({
            value: group.id,
            label: group.name
          }))
      };
    });
  };

  const userGroups = transformGroups(categories, groups);

  // Delete Hook
  const {
    // Delete Modal
    handleDeleteItem,
    deleteModal,
    setDeleteModal,
    deleteModalMulti,
    handleDeleteMultiple,

    // Table Header
    isMultiDeleteButton,
    setDeleteModalMulti,

    // Column Actions
    handleItemDeleteClick,
    handleCheckAllClick,
    handleCheckCellClick,
  } = useDelete(deleteUser);


>>>>>>> sanad
  // Model & Toggle Function
  const [user, setUser] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // User Data
  useEffect(() => {
    if (users && !users.length) {
      dispatch(getUsers());
<<<<<<< HEAD
    }
  }, [dispatch, users]);

=======
      dispatch(getGroups());
    }
  }, [dispatch, users]);


>>>>>>> sanad
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setUser(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Update Data
  const handleUserClick = useCallback(
<<<<<<< HEAD
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

=======
    (selectedUser) => {
      setUser(selectedUser);
>>>>>>> sanad
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

  const columns = useMemo(
    () => [
      {
<<<<<<< HEAD
        Header: () => <CheckboxHeader checkedAll={checkedAll} />,
        accessor: "id",
        Cell: (cellProps) =>
          <CheckboxCell
            {...cellProps}
            deleteCheckbox={deleteCheckbox}
          />,
=======
        Header: () => <CheckboxHeader handleCheckAllClick={handleCheckAllClick} />,
        accessor: "id",
        Cell: (cellProps) => <CheckboxCell {...cellProps} handleCheckCellClick={handleCheckCellClick} />,
>>>>>>> sanad
      },
      {
        Header: "م.",
        Cell: (cellProps) => <Id {...cellProps} />
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
        Header: "إجراءات",
<<<<<<< HEAD
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
=======
        accessor: "election",
        Cell: (cellProps) =>
          <Actions
            {...cellProps}
            handleElectionClick={handleUserClick}
            handleItemDeleteClick={handleItemDeleteClick}
          />
      },
    ],
    [handleCheckCellClick, handleCheckAllClick, handleUserClick, handleItemDeleteClick]
>>>>>>> sanad
  );

  // Filters----------
  const [filters, setFilters] = useState({
    global: "",
  });

  const userList = users.filter(user => {
    let isValid = true;

    if (filters.global) {
      isValid = isValid && user.fullName && typeof user.fullName === 'string' && user.fullName.toLowerCase().includes(filters.global.toLowerCase());
    }
    return isValid;
  });
<<<<<<< HEAD
=======

>>>>>>> sanad
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
<<<<<<< HEAD
        onDeleteClick={handleDeleteItem}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
=======
        onDeleteClick={() => handleDeleteItem()}
        onCloseClick={() => setDeleteModal(false)}
      />

      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          handleDeleteMultiple();
>>>>>>> sanad
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
<<<<<<< HEAD
=======
        userGroups={userGroups}
>>>>>>> sanad
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
                  // Filters----------
                  isTableContainerFilter={true}
                  isGlobalFilter={true}
                  preGlobalFilteredRows={true}
                  isResetFilters={true}

                  // Filter Settings
                  filters={filters}
                  setFilters={setFilters}
                  SearchPlaceholder="البحث بالاسم..."

                  // Header
                  isTableContainerHeader={true}
                  setIsEdit={setIsEdit}
                  toggle={toggle}
                  isContainerAddButton={true}
                  isEdit={isEdit}


                  // Data----------
                  columns={columns}
                  data={userList || []}
                  customPageSize={20}

                  // Styling----------
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light table-nowrap"
                  thClass="table-light text-muted"
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

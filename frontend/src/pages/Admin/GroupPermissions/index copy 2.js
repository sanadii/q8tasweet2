// React & Redux core imports
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Store Actions & Selectors
import { getGroupPermissions } from "store/actions";
import { groupPermissionSelector } from 'selectors';

// Components & Hooks
import { BreadCrumb, Loader, TableContainer } from "shared/components";

// UI Components & styling imports
import { Container } from "reactstrap";
import SimpleBar from "simplebar-react";


const Permissions = () => {
  document.title = "المجموعات | كويت تصويت";
  const dispatch = useDispatch();

  // State Selectors
  const { permissions, groups, categories, error } = useSelector(groupPermissionSelector);

  // State Management
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [group, setGroup] = useState(null);
  const [modalGroup, setModalGroup] = useState(false);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const filteredGroups = selectedCategoryId
    ? groups.filter(group => group.category === selectedCategoryId)
    : groups;


  // Dispatch to get Groups
  useEffect(() => {
    dispatch(getGroupPermissions());
  }, [dispatch]);


  const columns = useMemo(
    () => [
      {
        Header: "Id",
        Cell: (cellProps) => { cellProps.row.original.id }
      },
      {
        Header: "المجموعة",
        Cell: (cellProps) => { cellProps.row.original.displayName }

      },
      {
        Header: "Code",
        filterable: true,
        Cell: (cellProps) => { cellProps.row.original.name }
      },
    ],
    [handleCategoryClick]
  );

  permissions.forEach((permission) => {
    columns.push({
      Header: permission.name,
      accessor: (row) => {
        // For Sorting Results
        const permissionValue = row.permissionSomething[permission.id];
        return permissionValue || 0;

      },
      Cell: (cellProps) => <strong>{cellProps.value}</strong>,
    });
  });



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Categories" pageTitle="Settings" />
          <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
            <div className="file-manager-sidebar">
              <div className="p-4 d-flex flex-column h-100">
                <SimpleBar style={{ height: "calc(100vh - 468px)" }}>
                  <ul className="to-do-menu list-unstyled" id="CategoryList-data">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          to="#"
                          className="nav-link fs-13"
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </SimpleBar>
              </div>
            </div>
            <div className="file-manager-content w-100 p-4 pb-0">
              <div className="category-content position-relative px-4 mx-n4" id="category-content">
                <div className="category-category" id="category-category">
                  <div className="table-responsive">
                    {permissions && permissions.length ? (
                      <TableContainer
                        // Data
                        columns={columns}
                        data={permissions || []}
                        customPageSize={50}

                        // Sorting
                        sortBy="position"

                        // Styling
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap mb-0"
                        theadClass="table-light table-nowrap"
                        thClass="table-light text-muted"
                      />
                    ) : (
                      <Loader error={error} />
                    )}

                  </div>
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

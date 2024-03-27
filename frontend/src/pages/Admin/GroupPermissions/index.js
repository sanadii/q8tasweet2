import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getGroupPermissions } from "store/actions";
import { groupPermissionSelector } from 'selectors';
import { Container } from "reactstrap";
import { BreadCrumb, Loader, TableContainer } from "shared/components";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";

const Permissions = () => {
  const dispatch = useDispatch();
  const { contentTypes, permissions, groups, categories, error } = useSelector(groupPermissionSelector);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedContentTypeIds, setSelectedContentTypeIds] = useState([]);
  const [filteredContentTypes, setFilteredContentTypes] = useState([]);
  const [selectedPermissionTypes, setSelectedPermissionTypes] = useState([]);

  const permissionTypes = ["Add", "Update", "Delete", "View"];


  useEffect(() => {
    const filtered = contentTypes.filter(contentType =>
      permissions.some(permission => permission.contentType === contentType.id)
    );
    setFilteredContentTypes(filtered);
  }, [contentTypes, permissions]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryIds(prevIds =>
      prevIds.includes(categoryId)
        ? prevIds.filter(id => id !== categoryId)
        : [...prevIds, categoryId]
    );
  };

  const handleContentTypeClick = (contentTypeId) => {
    setSelectedContentTypeIds(prevIds =>
      prevIds.includes(contentTypeId)
        ? prevIds.filter(id => id !== contentTypeId)
        : [...prevIds, contentTypeId]
    );
  };

  const handlePermissionTypeClick = (permissionType) => {
    setSelectedPermissionTypes(prevTypes =>
      prevTypes.includes(permissionType)
        ? prevTypes.filter(type => type !== permissionType)
        : [...prevTypes, permissionType]
    );
  };

  useEffect(() => {
    dispatch(getGroupPermissions());
  }, [dispatch]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "Id",
        accessor: "id"
      },
      {
        Header: "المجموعة",
        accessor: "displayName"
      },
      {
        Header: "Code",
        accessor: "name"
      }
    ];

    // Ensure permissions is always an array
    const safePermissions = permissions || [];
    safePermissions.forEach(permission => {
      const permissionType = permission.codename.split(/(?=[A-Z])/)[0]; // Extracts "Add", "Update", etc.
      if (!selectedPermissionTypes.length || selectedPermissionTypes.includes(permissionType)) {
        baseColumns.push({
          Header: permission.codename,
          accessor: `permissions.${permission.id}`,
          Cell: ({ row }) => row.original.permissions.includes(permission.id) ? '✔️' : ''
        });
      }
    });
  
    return baseColumns;
  }, [permissions, selectedContentTypeIds, selectedPermissionTypes]);
  
  const transformedGroups = useMemo(() => {
    const filteredGroups = selectedCategoryIds.length > 0
      ? groups.filter(group => selectedCategoryIds.includes(group.category))
      : groups;

    return filteredGroups.map(group => {
      const permissionsObj = {};
      const safePermissions = permissions || [];
      safePermissions.forEach(permission => {
        permissionsObj[`permissions.${permission.id}`] = group.permissions.includes(permission.id);
      });
      return { ...group, ...permissionsObj };
    });
  }, [groups, permissions, selectedCategoryIds]);


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Categories" pageTitle="Settings" />
          <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">

            <div className="file-manager-sidebar">
              <div className="p-4 d-flex flex-column h-100">
                <SimpleBar>
                  <h4 >الأقسام</h4>
                  <ul className="to-do-menu list-unstyled" id="CategoryList-data">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          to="#"
                          className={`nav-link fs-13 ${selectedCategoryIds.includes(category.id) ? 'bg-soft-success' : ''}`}
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>


                  <h4 className="text-danger">المحتوى</h4>
                  <ul className="to-do-menu list-unstyled" id="ContentTypeList-data">
                    {filteredContentTypes.map((contentType) => (
                      <li key={contentType.id}>
                        <Link
                          to="#"
                          className={`nav-link fs-13 ${selectedContentTypeIds.includes(contentType.id) ? 'bg-soft-success' : ''}`}
                          onClick={() => handleContentTypeClick(contentType.id)}
                        >
                          {contentType.model}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-danger">أنواع الصلاحيات</h4>
                  <ul className="to-do-menu list-unstyled" id="PermissionTypeList-data">
                    {permissionTypes.map((type) => (
                      <li key={type}>
                        <Link
                          to="#"
                          className={`nav-link fs-13 ${selectedPermissionTypes.includes(type) ? 'bg-soft-success' : ''}`}
                          onClick={() => handlePermissionTypeClick(type)}
                        >
                          {type}
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
                    {transformedGroups && transformedGroups.length ? (
                      <TableContainer
                        columns={columns}
                        data={transformedGroups}
                        customPageSize={50}
                        // divClass="table-responsive table-card mb-3"
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

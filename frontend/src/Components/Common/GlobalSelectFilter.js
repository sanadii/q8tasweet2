import React, { useState } from 'react';

const ElectionSelectionFilter = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategoryFilter(selectedCategory);
  };

  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            data-choices
            data-choices-search-false
            name="status"
            id="idStatus"
            value={statusFilter || ''}
            onChange={handleStatusChange}
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Pending">Pending</option>
            <option value="Inprogress">Inprogress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            data-choices
            data-choices-search-false
            name="category"
            id="idCategory"
            value={categoryFilter || ''}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
      <div className="col-xxl-1 col-sm-4"></div>
    </React.Fragment>
  );
};

export { ElectionSelectionFilter };

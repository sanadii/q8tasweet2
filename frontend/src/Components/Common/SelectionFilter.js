import React, { useState } from 'react';

const ElectionSelectionFilter = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
  };

  const handlePriorityChange = (e) => {
    const selectedPriority = e.target.value;
    setPriorityFilter(selectedPriority);
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
            name="priority"
            id="idPriority"
            value={priorityFilter || ''}
            onChange={handlePriorityChange}
          >
            <option value="">All Priority</option>
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

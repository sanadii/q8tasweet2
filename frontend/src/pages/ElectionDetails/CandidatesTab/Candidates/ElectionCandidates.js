// React imports
import React from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'selectors';
import { Loader, TableContainer } from "shared/components";
import { ToastContainer } from "react-toastify";

const Candidates = ({ columns }) => {

  // State Management
  const { electionCandidates, error } = useSelector(electionSelector);

    return (
    <React.Fragment>
      <div>
        <p>we are candidates</p>
        {electionCandidates && electionCandidates.length ? (
          <TableContainer
            // Data
            columns={columns}
            data={electionCandidates || []}
            customPageSize={50}

            // Filters
            isGlobalFilter={true}
            isCandidateGenderFilter={true}
            SearchPlaceholder="البحث...."

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
      <ToastContainer closeButton={false} limit={1} />
    </React.Fragment>
  );
};

export default Candidates;

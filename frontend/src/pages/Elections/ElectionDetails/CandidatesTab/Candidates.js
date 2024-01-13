// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { deleteElectionCandidate } from "store/actions";
import { electionSelector } from 'Selectors';

// Common Components
import { Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "components";
import { usePermission, useDelete } from "hooks";

// UI & Utilities
import { toast, ToastContainer } from "react-toastify";

const CandidatesTab = ({ columns }) => {

  const { election, electionCandidates, electionParties, error } = useSelector(electionSelector);

  // Constants
  const [electionCandidateList, setElectionCandidateList] = useState(electionCandidates);

  // Sort List by Candidate Position
  useEffect(() => {
    const calculateCandidatePosition = (candidates) => {
      // Sort candidates by votes in desending order
      let sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

      // Assign positions
      for (let i = 0; i < sortedCandidates.length; i++) {
        sortedCandidates[i].position = i + 1;
      }

      // Set isWinner property based on electSeats
      const electSeats = election.electSeats || 0;
      sortedCandidates = sortedCandidates.map(candidate => ({
        ...candidate,
        isWinner: candidate.position <= electSeats
      }));

      // Sort candidates by positions in ascending order (issue in react its always reversing)
      sortedCandidates = sortedCandidates.sort((a, b) => b.position - a.position);
      return sortedCandidates;
    };

    const sortedCandidates = calculateCandidatePosition(electionCandidates);
    setElectionCandidateList(sortedCandidates);

  }, [electionCandidates, election.electSeats]);

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
  } = useDelete(deleteElectionCandidate);

  return (
    <React.Fragment>
      <div>
        {electionCandidateList && electionCandidateList.length ? (
          <TableContainer
            // Data
            columns={columns}
            data={electionCandidateList || []}
            customPageSize={50}

            // Filters
            isGlobalFilter={true}
            isCandidateGenderFilter={true}
            isMultiDeleteButton={isMultiDeleteButton}
            SearchPlaceholder="البحث...."

            // Actions NO NEED
            // handleEntryClick={handleElectionCandidateClicks}
            // setElectionCandidateList={setElectionCandidateList}
            // handleElectionCampaignClick={handleElectionCampaignClicks}

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

export default CandidatesTab;

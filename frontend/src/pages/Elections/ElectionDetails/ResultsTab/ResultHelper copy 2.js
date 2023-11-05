import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { updateElectionCommitteeResults } from "store/actions";


// CommitteeButton is responsible for rendering a button with different texts and classes
// based on whether the committee is being edited or has changes.
// Used Directly in the table columns as a Header
const CommitteeButton = ({ committeeId, committee, isEdited, hasChanges, handleSaveCommitteeResults, toggleCommitteeToEdit }) => {
  const buttonText = isEdited ? (hasChanges ? 'حفظ' : 'اغلاق') : (committee ? committee.name : `Committee ${committeeId}`);
  const buttonClass = isEdited ? (hasChanges ? 'btn-success' : 'btn-danger') : 'btn-info';

  const handleClick = () => {
    if (isEdited && hasChanges) {
      handleSaveCommitteeResults(committeeId);
    }
    toggleCommitteeToEdit(committeeId);
  };

  return (
    <button
      onClick={handleClick}
      className={`btn btn-sm ml-2 ${buttonClass}`}>
      {buttonText}
    </button>
  );
};


export const ResultInputField = ({ candidateId, committeeId, value, onChange }) => {
  const [localVotes, setLocalVotes] = useState(value);

  useEffect(() => {
    setLocalVotes(value);
  }, [value]);

  const handleBlur = () => {
    // If committeeId is provided, use it alongside candidateId to call onChange
    if (committeeId) {
      onChange(localVotes);
    } else {
      // If no committeeId is provided, call onChange with candidateId and localVotes
      onChange(candidateId, localVotes);
    }
  };

  return (
    <input
      key={`${candidateId}-${committeeId}`}
      type="number"
      maxLength="5"
      pattern="\d*"
      style={{ width: "5em" }}
      value={localVotes}
      onChange={(e) => setLocalVotes(e.target.value)}
      onBlur={handleBlur}
    />
  );
};

// Final Result Input field
// export const ResultInputField = (({ candidateId, value, onChange }) => {
//   const [localVotes, setLocalVotes] = useState(value);

//    useEffect(() => {
//     setLocalVotes(value);
//   }, [value]);

//   const handleBlur = () => {
//     onChange(candidateId, localVotes);
//   };

//   return (
//     <input
//       type="number"
//       maxLength="5"
//       pattern="\d*"
//       style={{ width: "5em" }}
//       value={localVotes}
//       onChange={(e) => setLocalVotes(e.target.value)}
//       onBlur={handleBlur}
//     />
//   );
// });

// // VoteInput.displayName = 'VoteInput'; // Add this line to define a display name

// // ResultInputField is a controlled component for vote input that localizes its state and synchronizes it with the parent component's state onBlur.
// const ResultInputField = ({ candidateId, committeeId, value, onChange }) => {
//   const [localVote, setLocalVotes] = useState(value);

//   useEffect(() => {
//     setLocalVotes(value);
//   }, [value]);

//   const handleBlur = () => {
//     onChange(localVote);
//   };

//   return (
//     <input
//       key={`${candidateId}-${committeeId}`}
//       type="text"
//       maxLength="5"
//       pattern="\d*"
//       inputMode="numeric"
//       style={{ width: "5em" }}
//       value={localVote}
//       onChange={(e) => setLocalVotes(e.target.value)}
//       onBlur={handleBlur}
//     />
//   );
// };

// createVoteInputField is a factory function to create a ResultInputField component with bound parameters.
const createVoteInputField = (candidateId, committeeId, votes, handleCommitteeVoteChange) => {
  return (
    <ResultInputField
      candidateId={candidateId}
      committeeId={committeeId}
      value={votes}
      onChange={(value) => handleCommitteeVoteChange(candidateId, committeeId, value)}
    />
  );
};


// calculateTotalVotes is a utility function to sum up the votes for a candidate across all committees.
const calculateTotalVotes = (candidate, electionCommittees) => {
  return electionCommittees.reduce((total, committee) => {
    const committeeVote = candidate.committeeVotes?.find(v => v.electionCommittee === committee.id);
    return total + (committeeVote?.votes || 0);
  }, 0);
};


// transformData takes the raw election data and transforms it into a structure suitable for rendering by the frontend,
// including calculating the total votes and candidate positions.
const transformData = (electionCandidates, electionCommittees, committeeEdited, handleCommitteeVoteChange, election) => {
  if (!electionCandidates || !electionCommittees || !election) return [];

  const candidatesWithTotalVotes = electionCandidates.map(candidate => {
    const totalVotes = calculateTotalVotes(candidate, electionCommittees);
    const transformedCandidate = {
      'candidate.id': candidate.id,
      position: candidate.position,
      name: candidate.name,
      total: totalVotes
    };

    electionCommittees.forEach(committee => {
      const committeeVote = candidate.committeeVotes?.find(v => v.electionCommittee === committee.id);
      const votes = committeeEdited[committee.id]?.[candidate.id] ?? committeeVote?.votes ?? 0;
      transformedCandidate[`committee_${committee.id}`] = committeeEdited[committee.id]
        ? createVoteInputField(candidate.id, committee.id, votes, handleCommitteeVoteChange)
        : votes;
    });

    return transformedCandidate;
  });

  const calculateCandidatePosition = (candidates) => {
    const sortedCandidates = [...candidates].sort((a, b) => b.total - a.total);
    sortedCandidates.forEach((candidate, index) => {
      candidate.position = index + 1;
      candidate.isWinner = candidate.position <= (election.electSeats || 0);
    });
    return sortedCandidates.sort((a, b) => b.position - a.position);
  };

  return calculateCandidatePosition(candidatesWithTotalVotes);
};



// useSaveCommitteeResults is a custom hook that dispatches an action to save committee results and handles local state updates related to editing.
const useSaveCommitteeResults = (committeeEditedData, committeeEdited, setCommitteeEdited, setCommitteeEditedData, toggleCommitteeToEdit) => {
  const dispatch = useDispatch();

  return useCallback((committeeId) => {
    if (committeeEditedData[committeeId]) {
      const updatedElectionCommitteeResult = {
        id: committeeId,
        data: committeeEditedData[committeeId]
      };
      console.log("DataData:", committeeEditedData)
      dispatch(updateElectionCommitteeResults(updatedElectionCommitteeResult));

      // Reset edited data for this specific committee
      const updatededitedCommittee = { ...committeeEdited };
      delete updatededitedCommittee[committeeId];
      setCommitteeEdited(updatededitedCommittee);

      // Reset the modified data for this committee if needed
      const updatedModifiedData = { ...committeeEditedData };
      delete updatedModifiedData[committeeId];
      setCommitteeEditedData(updatedModifiedData);

      // Toggle edit mode off immediately, don’t wait for the action to complete
      toggleCommitteeToEdit(committeeId);
    } else {
      // If no modifications are there but user still clicked save, simply toggle off the edit mode
      toggleCommitteeToEdit(committeeId);
    }
  }, [committeeEditedData, dispatch, committeeEdited, setCommitteeEdited, setCommitteeEditedData, toggleCommitteeToEdit]);
};

export {
  transformData,
  CommitteeButton,
  useSaveCommitteeResults,
}
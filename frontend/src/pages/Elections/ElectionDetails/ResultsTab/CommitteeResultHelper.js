import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { updateElectionCommitteeResults } from "store/actions";


// CommitteeVoteButton is responsible for rendering a button with different texts and classes
// based on whether the committee is being edited or has changes.
// Used Directly in the table columns as a Header

const CommitteeVoteButton = ({ committeeId, committee, isEdited, hasChanges, handleSaveCommitteeResults, toggleCommitteeToEdit }) => {
  const buttonText = isEdited ? (hasChanges ? 'حفظ' : 'اغلاق') : (committee ? committee.name : `Committee ${committeeId}`);
  const buttonClass = isEdited ? (hasChanges ? 'btn-success' : 'btn-danger') : 'btn-info';

  console.log("isEdited?", isEdited)

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




// ResultInputField is a controlled component for vote input that localizes its state and synchronizes it with the parent component's state onBlur.
const ResultInputField = ({ candidateId, committeeId, value, onChange }) => {
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
  console.log("candidateIdcandidateId: ", candidateId); // Check what you receive when the input changes
  console.log("newValuenewValue: ", value); // Check what you receive when the input changes

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

// createVoteInputField is a factory function to create a ResultInputField component with bound parameters.

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
    const transformedCandidate = {
      'candidate.id': candidate.id,
      position: candidate.position,
      name: candidate.name,
      votes: candidate.votes,
      total: calculateTotalVotes(candidate, electionCommittees),
    };

    electionCommittees.forEach(committee => {
      const committeeVote = candidate.committeeVotes?.find(v => v.electionCommittee === committee.id);
      const votes = committeeEdited[committee.id]?.[candidate.id] ?? committeeVote?.votes ?? 0;
      transformedCandidate[`committee_${committee.id}`] = committeeEdited[committee.id]
        ? <ResultInputField
          candidateId={candidate.id}
          committeeId={committee.id}
          value={votes}
          onChange={(value) => handleCommitteeVoteChange(candidate.id, committee.id, value)}
        />

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
  CommitteeVoteButton,
  // CandidateVoteButton,
  useSaveCommitteeResults,
  ResultInputField
}
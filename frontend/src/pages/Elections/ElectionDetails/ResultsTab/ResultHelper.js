import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { updateElectionCommitteeResults, updateElectionCandidateVotes } from "store/actions";


// CommitteeVoteButton is responsible for rendering a button with different texts and classes
// based on whether the committee is being edited or has changes.
// Used Directly in the table columns as a Header

const HeaderVoteButton = ({
  committee, committeeId,
  isCandidateEdited, isCommitteeEdited,
  hasChanges,
  handleSaveCandidateResults,
  handleSavResults,
  toggleRowToEdit,
}) => {
  // Determine the button text and class based on the editing state
  const buttonClass = isCommitteeEdited || isCandidateEdited ? (hasChanges ? 'btn-success' : 'btn-danger') : 'btn-info';
  const buttonText = isCommitteeEdited || isCandidateEdited ? (hasChanges ? 'حفظ' : 'اغلاق') : (committee ? committee.name : `تعديل`);

  const handleClick = () => {
    if (isCommitteeEdited && hasChanges) {
      handleSavResults(committeeId);
    } else if (isCandidateEdited && hasChanges) {
      handleSavResults();
      console.log("handleSaveCandidateResults is called")
    }

    toggleRowToEdit(committeeId);
  };

  return (
    <button onClick={handleClick} className={`btn btn-sm ml-2 ${buttonClass}`}>
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


// calculateTotalVotes is a utility function to sum up the votes for a candidate across all committees.
const calculateTotalVotes = (candidate, electionCommittees) => {
  return electionCommittees.reduce((total, committee) => {
    const committeeVote = candidate.committeeVotes?.find(v => v.electionCommittee === committee.id);
    return total + (committeeVote?.votes || 0);
  }, 0);
};


// transformResulteData takes the raw election data and transforms it into a structure suitable for rendering by the frontend,
// including calculating the total votes and candidate positions.
const transformResulteData = (
  electionCandidates,
  electionCommittees,
  resultFieldEdited,
  handleResultVoteChange,
  election
) => {

  if (!electionCandidates || !electionCommittees || !election) return [];

  const candidatesWithTotalVotes = electionCandidates.map(candidate => {
    const votes = candidate.votes ?? 0;
    const transformedCommitteeCandidate = {
      candidateId: candidate.id,
      position: candidate.position,
      name: candidate.name,
      gender: candidate.gender,
      image: candidate.imagePath,
      isWinner: candidate.isWinner,
      total: calculateTotalVotes(candidate, electionCommittees),

      // Differentiation
      votes: resultFieldEdited
        ? <ResultInputField
          candidateId={candidate.id}
          value={votes}
          onChange={(value) => handleResultVoteChange(candidate.id, value)}
        />
        : votes,
    };

    // Creating committee for Detailed Results
    electionCommittees.forEach(committee => {
      const committeeVote = candidate.committeeVotes?.find(v => v.electionCommittee === committee.id);
      const votes = resultFieldEdited[committee.id]?.[candidate.id] ?? committeeVote?.votes ?? 0;
      transformedCommitteeCandidate[`committee_${committee.id}`] = resultFieldEdited[committee.id]
        ? <ResultInputField
          candidateId={candidate.id}
          committeeId={committee.id}
          value={votes}
          onChange={(value) => handleResultVoteChange(committee.id, candidate.id, value)}
        />
        : votes;
    });


    return transformedCommitteeCandidate;
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
const useSaveCommitteeResults = (
  resultFieldEditedData,
  resultFieldEdited,
  setResultFieldEdited,
  setResultFieldEditedData,
  toggleRowToEdit
) => {
  const dispatch = useDispatch();
  console.log("resultFieldEditedData: ", resultFieldEditedData)
  return useCallback((committeeId, candidateId) => {
    if (resultFieldEditedData[committeeId]) {
      const updatedElectionCommitteeResult = {
        id: committeeId,
        data: resultFieldEditedData[committeeId]
      };
      dispatch(updateElectionCommitteeResults(updatedElectionCommitteeResult));

      // Reset edited data for this specific committee
      const updatededitedCommittee = { ...resultFieldEdited };
      delete updatededitedCommittee[committeeId];
      setResultFieldEdited(updatededitedCommittee);

      // Reset the modified data for this committee if needed
      const updatedModifiedData = { ...resultFieldEditedData };
      delete updatedModifiedData[committeeId];
      setResultFieldEditedData(updatedModifiedData);

      // Toggle edit mode off immediately, don’t wait for the action to complete
      toggleRowToEdit(committeeId);

    } if (resultFieldEditedData) {
      dispatch(updateElectionCandidateVotes(resultFieldEditedData));
    } else {
      // If no modifications are there but user still clicked save, simply toggle off the edit mode
      toggleRowToEdit(committeeId);
    }
  }, [
    resultFieldEditedData,
    dispatch,
    resultFieldEdited,
    setResultFieldEdited,
    setResultFieldEditedData,
    toggleRowToEdit
  ]);
};


export {
  HeaderVoteButton,
  ResultInputField,

  useSaveCommitteeResults,

  transformResulteData,
}
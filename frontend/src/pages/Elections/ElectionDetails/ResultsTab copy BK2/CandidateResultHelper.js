import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { updateElectionCandidateVotes } from "store/actions";


// CandidateVoteButton is responsible for rendering a button with different texts and classes
// based on whether the Candidate is being edited or has changes.
// Used Directly in the table columns as a Header

const CandidateVoteButton = ({ isCandidateEdited, hasChanges, handleSaveCandidateResults, toggleCandidateToEdit }) => {
  // Determine the button text based on the editing state
  const buttonText = isCandidateEdited ? (hasChanges ? 'حفظ' : 'اغلاق') : 'تعديل';
  const buttonClass = isCandidateEdited ? (hasChanges ? 'btn-success' : 'btn-danger') : 'btn-info';

  console.log("isCandidateEdited?", isCandidateEdited, "hasChanges?", hasChanges)


  const handleClick = () => {
    if (isCandidateEdited && hasChanges) {
      handleSaveCandidateResults();
      // console.log("committeeId::", committeeId)
    }
    toggleCandidateToEdit('votes');
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
    onChange(candidateId, localVotes); // Always pass candidateId as the first argument and the new vote value as the second
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


// transformCandidateData takes the raw election data and transforms it into a structure suitable for rendering by the frontend,
// including calculating the total votes and candidate positions.
const transformCandidateData = (election, electionCandidates, candidateEdited, handleCandidateVoteChange) => {
  if (!electionCandidates || !election) return [];

  const candidatesWithTotalVotes = electionCandidates.map(candidate => {
    const votes = candidate.votes ?? 0;
    const transformedCandidate = {
      candidateId: candidate.id,
      position: candidate.position,
      name: candidate.name,
      image: candidate.imagePath,
      gender: candidate.gender,
      isWinner: candidate.isWinner,
      // Here we check if the candidate is being edited and accordingly return a component or the votes
      votes: candidateEdited
        ? <ResultInputField
          candidateId={candidate.id}
          value={votes}
          onChange={handleCandidateVoteChange}
        />
        : votes,
    };

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



// useSaveCandidateResults is a custom hook that dispatches an action to save committee results and handles local state updates related to editing.
const useSaveCandidateResults = (candidateEditedData, candidateEdited, setCommitteeEdited, toggleCandidateToEdit) => {
  const dispatch = useDispatch();
  console.log("GOOD:", candidateEditedData) // im getting this

  return useCallback(() => {
    dispatch(updateElectionCandidateVotes(candidateEditedData));
    console.log("BAD::", candidateEditedData) // but this is empty
  }, [candidateEditedData, dispatch]);
};

export {
  transformCandidateData,
  CandidateVoteButton,
  useSaveCandidateResults,
  ResultInputField
}
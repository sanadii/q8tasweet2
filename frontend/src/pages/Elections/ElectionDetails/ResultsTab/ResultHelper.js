import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { updateElectionCommitteeResults, updateElectionCandidateVotes } from "store/actions";


// CommitteeVoteButton is responsible for rendering a button with different texts and classes
// based on whether the committee is being edited or has changes.
// Used Directly in the table columns as a Header

const HeaderVoteButton = ({
  committee,
  committeeId,
  isEdited,
  candidateVoteFieldEdited,
  committeeVoteFieldEdited,
  hasChanges,
  handleSaveResults,
  toggleColumnToEdit,
}) => {
  // Determine the button text and class based on the editing state
  const buttonText = isEdited ? (hasChanges ? 'حفظ' : 'اغلاق') : (committee ? committee.name : `تعديل`);
  const buttonClass = isEdited ? (hasChanges ? 'btn-success' : 'btn-danger') : 'btn-info';

  console.log("Button: isEdited: ", isEdited, "hasChanges: ", hasChanges)

  const handleClick = () => {
    if (hasChanges && committeeId) {
      handleSaveResults(committeeId);


    } else if (hasChanges && !committeeId) {
      handleSaveResults();
      console.log("handleSaveCandidateResults is called")
    }

    toggleColumnToEdit(committeeId);
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
  // console.log("candidateIdcandidateId: ", candidateId); // Check what you receive when the input changes
  // console.log("newValuenewValue: ", value); // Check what you receive when the input changes

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


// transformResultData takes the raw election data and transforms it into a structure suitable for rendering by the frontend,
// including calculating the total votes and candidate positions.

const transformResultData = (
  electionCandidates,
  electionCommittees,
  candidateVoteFieldEdited,
  committeeVoteFieldEdited,
  handleResultVoteChange,
  election
) => {
  if (!electionCandidates || !electionCommittees || !election) return [];

  console.log(`Rendering isEdited mode: ${candidateVoteFieldEdited}`);
  console.log(`Rendering isEdited mode: ${committeeVoteFieldEdited}`);


  const candidatesWithTotalVotes = electionCandidates.map((candidate) => {
    const candidateVotes = candidate.votes ?? 0;


    const transformedCommitteeCandidate = {
      'candidate.id': candidate.id,
      position: candidate.position,
      name: candidate.name,
      gender: candidate.gender,

      image: candidate.imagePath,
      isWinner: candidate.isWinner,
      total: calculateTotalVotes(candidate, electionCommittees),

      // Conditionally render ResultInputField or display votes based on edit mode
      votes:
        // candidateVoteFieldEdited ? (
        <ResultInputField
          candidateId={candidate.id}
          value={candidateVotes}
          onChange={(newValue) => handleResultVoteChange(candidate.id, undefined, newValue)} // Pass `undefined` for `committeeId`
        />
      // ) : (
      //   candidateVotes
      // ),
    };

    // console.log("transformedCommitteeCandidate: ", transformedCommitteeCandidate)
    console.log("candidateVoteFieldEdited: ", candidateVoteFieldEdited)


    if (electionCommittees.length > 0) {
      electionCommittees.forEach(committee => {
        const committeeVote = candidate.committeeVotes?.find(v => v.electionCommittee === committee.id);
        const votes = committeeVoteFieldEdited[committee.id]?.[candidate.id] ?? committeeVote?.votes ?? 0;
        transformedCommitteeCandidate[`committee_${committee.id}`] = committeeVoteFieldEdited[committee.id]
          ? <ResultInputField
            candidateId={candidate.id}
            committeeId={committee.id}
            value={votes}
            onChange={(value) => handleResultVoteChange(candidate.id, committee.id, value)}
          />

          : votes;
      });
    }

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
  candidateVoteFieldEdited,
  committeeVoteFieldEdited,
  setCandidateVoteFieldEdited,
  setCommitteeVoteFieldEdited,
  setResultFieldEditedData,
  toggleColumnToEdit
) => {
  const dispatch = useDispatch();
  // console.log("resultFieldEditedData: ", resultFieldEditedData)
  return useCallback((committeeId, candidateId) => {
    if (committeeId) {
      const updatedElectionCommitteeResult = {
        id: committeeId,
        data: resultFieldEditedData[committeeId]
      };
      dispatch(updateElectionCommitteeResults(updatedElectionCommitteeResult));

      // Reset edited data for this specific committee
      const updatededitedCommittee = { ...committeeVoteFieldEdited };
      delete updatededitedCommittee[committeeId];
      setCommitteeVoteFieldEdited(updatededitedCommittee);

      // Reset the modified data for this committee if needed
      const updatedModifiedData = { ...resultFieldEditedData };
      delete updatedModifiedData[committeeId];
      setResultFieldEditedData(updatedModifiedData);

      // Toggle edit mode off immediately, don’t wait for the action to complete
      toggleColumnToEdit(committeeId);

    } else if (!committeeId) {
      //   // console.log("resultFieldEditedData:", resultFieldEditedData)
      dispatch(updateElectionCandidateVotes(resultFieldEditedData));
    } else {
      // If no modifications are there but user still clicked save, simply toggle off the edit mode
      toggleColumnToEdit('votes');
    }
  }, [
    resultFieldEditedData,
    dispatch,
    candidateVoteFieldEdited,
    committeeVoteFieldEdited,
    setCandidateVoteFieldEdited,
    setCommitteeVoteFieldEdited,
    setResultFieldEditedData,
    toggleColumnToEdit
  ]);
};


export {
  HeaderVoteButton,
  ResultInputField,
  useSaveCommitteeResults,
  transformResultData,
}
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { updateElectionResults, updateElectionPartyResults, updateElectionPartyCandidateResults } from "store/actions";


// CommitteeVoteButton is responsible for rendering a button with different texts and classes
// based on whether the committee is being edited or has changes.
// Used Directly in the table columns as a Header

const HeaderVoteButton = ({
  committee,
  committeeId,
  columnEdited,
  hasChanges,
  handleSaveResults,
  toggleColumnToEdit,
}) => {

  // Determine the button text and class based on the editing state
  const buttonText = columnEdited[committeeId] ? (hasChanges[committeeId] ? 'حفظ' : 'اغلاق') : (committee ? committee.name : `تعديل`);
  const buttonClass = columnEdited[committeeId] ? (hasChanges[committeeId] ? 'btn-success' : 'btn-danger') : 'btn-info';

  const handleClick = () => {
    if (hasChanges[committeeId]) {
      console.log("It should handleSaveResults Results here")
      handleSaveResults(committeeId);
    }
    console.log("It should toggleColumnToEdit Results here")

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
  electionContestants,
  electionCommittees,
  columnEdited,
  handleVoteFieldChange,
  election,
  partyCommitteeVoteList,
  resultsDisplayType,
) => {
  if (!electionContestants || !electionCommittees || !election) return [];

  console.log("partyCommitteeVoteList: ", partyCommitteeVoteList);

  let contestantIndex = 1; // Initialize contestant index

  const contestantTotalVoteUpdated = electionContestants.map((contestant) => {
    const contestantVotes = contestant.votes ?? 0;

    const partyData = partyCommitteeVoteList?.find(party => party.partyId === contestant.electionParty);
    const sumPartyVote = partyData
      ? partyData.committeeVotes.reduce((total, committeeVote) => total + committeeVote.votes, 0)
      : 0;

    const total = calculateTotalVotes(contestant, electionCommittees)
    const sumPartyCandidateVote = sumPartyVote + total;

    const transformedResultFieldsData = {
      id: contestant.id,
      position: contestant.position,
      electionParty: contestant.electionParty,
      name: contestant.name, // Use contestantIndex + 1 as the index number
      rankName: contestantIndex + 1 + ". " + contestant.name, // Use contestantIndex + 1 as the index number
      gender: contestant.gender,
      image: contestant.imagePath,
      isWinner: contestant.isWinner,
      total: resultsDisplayType === "candidateOriented" ? total : sumPartyCandidateVote,
      sumVote: total,
      sumPartyVote: sumPartyVote,
      sumPartyCandidateVote: sumPartyCandidateVote,
    };
    

    // Candidate Vote Field
    const noCommittee = "0";
    transformedResultFieldsData[`votes`] = columnEdited[0]
      ? <ResultInputField
        committeeId={noCommittee}
        contestantId={contestant.id}
        value={contestantVotes}
        onChange={(value) => handleVoteFieldChange(noCommittee, contestant.id, value)}
      />
      : contestantVotes;

    // Committee Contestant Vote Field
    if (electionCommittees.length > 0) {
      electionCommittees.forEach(committee => {
        const committeeVote = candidate.committeeVotes?.find(v => v.electionCommittee === committee.id);
        const votes = columnEdited[committee.id]?.[candidate.id] ?? committeeVote?.votes ?? 0;
        transformedResultFieldsData[`committee_${committee.id}`] = columnEdited[committee.id]
          ? <ResultInputField
            committeeId={committee.id}
            candidateId={candidate.id}
            value={votes}
            onChange={(value) => handleVoteFieldChange(committee.id, candidate.id, value)}
          />
          : votes;
      });
    }

    candidateIndex++; // Increment candidate index for the next candidate
    return transformedResultFieldsData;
  });

  // Calculate positions and determine winners, but do not sort by position
  const calculateContestantPosition = (resultData) => {
    const sortedContestants = [...resultData].sort((a, b) => b.total - a.total);
    sortedContestants.forEach((candidate, index) => {
      candidate.position = index + 1;
      candidate.isWinner = candidate.position <= (election.electSeats || 0);
    });
    return resultData; // Return the original list without sorting by position
  };

  return calculateContestantPosition(contestantTotalVoteUpdated);
};


// useSaveCommitteeResults is a custom hook that dispatches an action to save committee results and handles local state updates related to editing.
const useSaveCommitteeResults = (
  voteFieldEditedData,
  columnEdited,
  setColumnEdited,
  setVoteFieldEditedData,
  toggleColumnToEdit,
  electionMethod,
  resultsDisplayType,
) => {
  const dispatch = useDispatch();

  return useCallback((committeeId) => {
    let resultType;

    if (electionMethod === "candidateOnly") {
      resultType = "candidates";
    } else {
      if (resultsDisplayType === "partyOriented") {
        resultType = "parties";
      } else if (resultsDisplayType === "candidateOriented" || resultsDisplayType === "partyCandidateOriented") {
        resultType = "partyCandidates";
      }
    }

    if (committeeId) {
      const updatedResults = {
        id: committeeId,
        data: voteFieldEditedData[committeeId],
        resultType: resultType, // Fixed the typo in 'resultType'
      };



      dispatch(updateElectionResults(updatedResults))


      // Reset edited data for this specific committee
      const updatededitedCommittee = { ...columnEdited };
      delete updatededitedCommittee[committeeId];
      setColumnEdited(updatededitedCommittee);

      // Reset the modified data for this committee if needed
      const updatedModifiedData = { ...voteFieldEditedData };
      delete updatedModifiedData[committeeId];
      setVoteFieldEditedData(updatedModifiedData);
      console.log("updatedResults", updatedResults);

    }

    // Toggle edit mode off immediately, don’t wait for the action to complete
    toggleColumnToEdit(committeeId);

  }, [
    voteFieldEditedData,
    dispatch,
    columnEdited,
    setColumnEdited,
    setVoteFieldEditedData,
    toggleColumnToEdit
  ]);
};


export {
  HeaderVoteButton,
  ResultInputField,
  useSaveCommitteeResults,
  transformResultData,
}
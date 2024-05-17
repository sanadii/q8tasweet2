import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { updateElectionResults, updateElectionPartyResults, updateElectionPartyCandidateResults } from "store/actions";


// CommitteeVoteButton is responsible for rendering a button with different texts and classes
// based on whether the committee is being edited or has changes.
// Used Directly in the table columns as a Header

const HeaderVoteButton = ({
  committee,
  isColumnInEditMode,
  isEditField,
  handleSaveResults,
  toggleColumnEditMode,
}) => {

  const committeeId = committee?.id;
  // Determine the button text and class based on the editing state
  const buttonText = isColumnInEditMode[committeeId] ?
    (isEditField[committeeId] ? 'حفظ' : 'اغلاق')
    :
    (committee?.id === "0" ? `تعديل` :  committee.name);

  const buttonClass = isColumnInEditMode[committeeId] ?
    (isEditField[committeeId] ? 'btn-success' : 'btn-danger')
    :
    'btn-info';

  const handleClick = () => {
    if (isEditField[committeeId]) {
      console.log("It should handleSaveResults Results here")
      handleSaveResults(committeeId);
    }
    console.log("It should toggleColumnEditMode Results here")

    toggleColumnEditMode(committeeId);
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

const generateVoteFields = (participant, electionCommittees, isColumnInEditMode, onVoteFieldChange) => {
  const voteFields = {};
  const noCommittee = "0";
  voteFields[`votes`] = isColumnInEditMode[0]
    ? <ResultInputField
      committeeId={noCommittee}
      participantId={participant.id}
      value={participant.votes ?? 0}
      onChange={(value) => onVoteFieldChange(noCommittee, participant.id, value)}
    />
    : participant.votes ?? 0;

  electionCommittees.forEach(committee => {
    const committeeVote = participant.committeeResults?.find(committeeResult => committeeResult.committee === committee.id);
    const votes = isColumnInEditMode[committee.id]?.[participant.id] ?? committeeVote?.votes ?? 0;
    voteFields[`committee_${committee.id}`] = isColumnInEditMode[committee.id]
      ? <ResultInputField
        committeeId={committee.id}
        participantId={participant.id}
        value={votes}
        onChange={(value) => onVoteFieldChange(committee.id, participant.id, value)}
      />
      : votes;
  });

  return voteFields;
};
// calculateTotalVotes is a utility function to sum up the votes for a candidate across all committees.
const calculateTotalVotes = (candidate, electionCommittees) => {
  return electionCommittees.reduce((total, committee) => {
    const committeeVote = candidate.committeeResults?.find(committeeResult => committeeResult.committee === committee.id);
    return total + (committeeVote?.votes || 0);
  }, 0);
};

// Party Committee Votes
// Extract the votes from the party and make it as a list
const usePartyCommitteeVotes = (electionParties) => {
  const partyCommitteeVoteList = useMemo(() => {
    if (!electionParties) return [];

    return electionParties.map(party => {
      const committeeResults = party.committeeResults.map(committeeVote => ({
        committeeId: committeeVote.committee,
        votes: committeeVote.votes
      }));

      return {
        partyId: party.id,
        partyName: party.name,
        committeeResults: committeeResults
      };
    });
  }, [electionParties]);

  return partyCommitteeVoteList;
};






// transformResultData takes the raw election data and transforms it into a structure suitable for rendering by the frontend,
// including calculating the total votes and candidate positions.
const transformResultData = (
  electionContestants,
  electionCommittees,
  isColumnInEditMode,
  onVoteFieldChange,
  election,
  partyCommitteeVoteList,
  electionMethod,
  isDetailedResults,
) => {
  if (!electionContestants || !electionCommittees || !election) return [];

  // console.log("partyCommitteeVoteList: ", partyCommitteeVoteList);

  let participantIndex = 1; // Initialize participant index

  const participantTotalVoteUpdated = electionContestants.map((participant) => {
    const participantVotes = participant.votes ?? 0;

    const partyData = partyCommitteeVoteList?.find(party => party.partyId === participant.electionParty);
    const sumPartyVote = partyData
      ? partyData.committeeResults.reduce((total, committeeVote) => total + committeeVote.votes, 0)
      : 0;

    const total = calculateTotalVotes(participant, electionCommittees)
    const sumPartyCandidateVote = sumPartyVote + total;

    const transformedResultFieldsData = {
      id: participant.id,
      position: participant.position,
      electionParty: participant.electionParty,
      name: participant.name, // Use participantIndex + 1 as the index number
      nameIndex: participantIndex + 1 + ". " + participant.name, // Use participantIndex + 1 as the index number
      gender: participant.gender,
      image: participant.imagePath,
      isWinner: participant.isWinner,
      total: isDetailedResults && (electionMethod === "partyCandidateOnly") ? total : sumPartyCandidateVote,
      sumVote: total,
      sumPartyVote: sumPartyVote,
      sumPartyCandidateVote: sumPartyCandidateVote,
    };


    // Candidate Vote Field
    // Add vote fields to the transformed data
    const voteFields = generateVoteFields(participant, electionCommittees, isColumnInEditMode, onVoteFieldChange);
    Object.assign(transformedResultFieldsData, voteFields);

    // Committee Contestant Vote Field
    if (electionCommittees.length > 0) {
      electionCommittees.forEach(committee => {
        const committeeVote = participant.committeeResults?.find(committeeResult => committeeResult.committee === committee.id);
        const votes = isColumnInEditMode[committee.id]?.[participant.id] ?? committeeVote?.votes ?? 0;
        transformedResultFieldsData[`committee_${committee.id}`] = isColumnInEditMode[committee.id]
          ? <ResultInputField
            committeeId={committee.id}
            candidateId={participant.id}
            value={votes}
            onChange={(value) => onVoteFieldChange(committee.id, participant.id, value)}
          />
          : votes;
      });
    }

    participantIndex++; // Increment candidate index for the next candidate
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

  return calculateContestantPosition(participantTotalVoteUpdated);
};


// useCommitteeResultSaver is a custom hook that dispatches an action to save committee results and handles local state updates related to editing.
const useCommitteeResultSaver = (
  voteFieldEditedData,
  isColumnInEditMode,
  SetIsColumnInEditMode,
  setVoteFieldEditedData,
  toggleColumnEditMode,
  election,
) => {
  const dispatch = useDispatch();

  return useCallback((committeeId) => {
    // let resultType;

    // if (electionMethod === "candidateOnly") {
    //   resultType = "candidates";
    // } else {
    //   if (isDetailedResults && (electionMethod === "partyOnly")) {
    //     resultType = "parties";
    //   } else if (isDetailedResults && (electionMethod === ("partyCandidateOnly" || "partyCandidateCombined"))) {
    //     resultType = "partyCandidates";
    //   }
    // }

    if (committeeId) {
      const updatedResults = {
        id: committeeId,
        electionSlug: election.slug,
        electionMethod: election.electionMethod,
        isDetailedResults: election.isDetailedResults,
        data: voteFieldEditedData[committeeId],
        // resultType: resultType, // Fixed the typo in 'resultType'
      };

      dispatch(updateElectionResults(updatedResults))

      // Reset edited data for this specific committee
      const updatededitedCommittee = { ...isColumnInEditMode };
      delete updatededitedCommittee[committeeId];
      SetIsColumnInEditMode(updatededitedCommittee);

      // Reset the modified data for this committee if needed
      const updatedModifiedData = { ...voteFieldEditedData };
      delete updatedModifiedData[committeeId];
      setVoteFieldEditedData(updatedModifiedData);
      console.log("updatedResults", updatedResults);

    }

    // Toggle edit mode off immediately, don’t wait for the action to complete
    toggleColumnEditMode(committeeId);

  }, [
    voteFieldEditedData,
    dispatch,
    isColumnInEditMode,
    SetIsColumnInEditMode,
    setVoteFieldEditedData,
    toggleColumnEditMode,
    election,
  ]);
};


export {
  HeaderVoteButton,
  ResultInputField,
  useCommitteeResultSaver,
  transformResultData,
  usePartyCommitteeVotes,
}
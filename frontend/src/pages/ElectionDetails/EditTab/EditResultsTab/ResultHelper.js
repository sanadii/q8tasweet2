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
    (isEditField[committeeId] ? 'حفظ' : 'اغلق')
    :
    (committee ? `${committee.id}` : `تعديل`);

  const buttonClass = isColumnInEditMode[committeeId] ?
    (isEditField[committeeId] ? 'btn-success' : 'btn-danger') : 'btn-info';

  const handleClick = () => {
    if (isEditField[committeeId]) {
      console.log("It should handleSaveResults Results here")
      handleSaveResults(committeeId);
    }
    console.log("It should toggleColumnEditMode Results here")

    toggleColumnEditMode(committeeId);
  };

  return (
    <button onClick={handleClick} className={`btn btn-sm ml-2 ${buttonClass}`} title={committee.type}>
      {buttonText}
    </button>
  );
};

//  Extract the votes from the party and make it as a list
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
  usePartyCommitteeVotes,
  useCommitteeResultSaver,

}
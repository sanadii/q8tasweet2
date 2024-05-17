import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { updateElectionResults, updateElectionPartyResults, updateElectionPartyCandidateResults } from "store/actions";

// ResultInputField is a controlled component for vote input that localizes its state and synchronizes it with the parent component's state onBlur.
const ResultInputField = ({ candidateId, committeeId, value, onChange }) => {
    const [localVotes, setLocalVotes] = useState(value);

    useEffect(() => {
        setLocalVotes(value);
    }, [value]);

    const handleBlur = () => {
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

// Generates vote fields for each committee candidate
const generateVoteFields = (participant, electionCommitteeSites, isColumnInEditMode, onVoteFieldChange) => {
    const voteFields = {};
    const noCommittee = "0";
    voteFields[`votes`] = isColumnInEditMode[0]
        ? <ResultInputField
            committeeId={noCommittee}
            candidateId={participant.id}
            value={participant.votes ?? 0}
            onChange={(value) => onVoteFieldChange(noCommittee, participant.id, value)}
        />
        : participant.votes ?? 0;

    electionCommitteeSites.forEach(site => {
        site.committees.forEach(committee => {
            const committeeVote = participant.committeeResults?.find(committeeResult => committeeResult.committee === committee.id);
            const votes = isColumnInEditMode[committee.id]?.[participant.id] ?? committeeVote?.votes ?? 0;
            voteFields[`committee_${committee.id}`] = isColumnInEditMode[committee.id]
                ? <ResultInputField
                    committeeId={committee.id}
                    candidateId={participant.id}
                    value={votes}
                    onChange={(value) => onVoteFieldChange(committee.id, participant.id, value)}
                />
                : votes;
        });
    });

    return voteFields;
};

// Sums up the votes for a candidate across all committees
const calculateTotalVotes = (candidate, electionCommitteeSites) => {
    return electionCommitteeSites.reduce((total, site) => {
        return site.committees.reduce((siteTotal, committee) => {
            const committeeVote = candidate.committeeResults?.find(committeeResult => committeeResult.committee === committee.id);
            return siteTotal + (committeeVote?.votes || 0);
        }, total);
    }, 0);
};

// Calculates the position of each candidate
const calculateContestantPosition = (resultData, electSeats) => {
    const sortedContestants = [...resultData].sort((a, b) => b.total - a.total);
    sortedContestants.forEach((candidate, index) => {
        candidate.position = index + 1;
        candidate.isWinner = candidate.position <= (electSeats || 0);
    });
    return resultData;
};

// Transforms the data for a single participant
const transformParticipantData = (
    participant,
    participantIndex,
    electionCommitteeSites,
    isColumnInEditMode,
    onVoteFieldChange,
    partyCommitteeVoteList,
    electionMethod,
    isDetailedResults
) => {
    const participantVotes = participant.votes ?? 0;

    const partyData = partyCommitteeVoteList?.find(party => party.partyId === participant.electionParty);
    const sumPartyVote = partyData
        ? partyData.committeeResults.reduce((total, committeeVote) => total + committeeVote.votes, 0)
        : 0;

    const total = calculateTotalVotes(participant, electionCommitteeSites);
    const sumPartyCandidateVote = sumPartyVote + total;

    const transformedResultFieldsData = {
        id: participant.id,
        position: participant.position,
        electionParty: participant.electionParty,
        name: participant.name,
        nameIndex: participantIndex + 1 + ". " + participant.name,
        gender: participant.gender,
        image: participant.imagePath,
        isWinner: participant.isWinner,
        total: isDetailedResults && (electionMethod === "partyCandidateOnly") ? total : sumPartyCandidateVote,
        sumVote: total,
        sumPartyVote: sumPartyVote,
        sumPartyCandidateVote: sumPartyCandidateVote,
    };

    // Add vote fields to the transformed data
    const voteFields = generateVoteFields(participant, electionCommitteeSites, isColumnInEditMode, onVoteFieldChange);
    Object.assign(transformedResultFieldsData, voteFields);

    // Add committee contestant vote fields
    addCommitteeVoteFields(
        participant,
        transformedResultFieldsData,
        electionCommitteeSites,
        isColumnInEditMode,
        onVoteFieldChange
    );

    return transformedResultFieldsData;
};

// Adds the committee vote fields to the transformed result fields data
const addCommitteeVoteFields = (
    participant,
    transformedResultFieldsData,
    electionCommitteeSites,
    isColumnInEditMode,
    onVoteFieldChange
) => {
    electionCommitteeSites.forEach(site => {
        site.committees.forEach(committee => {
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
    });
};


// Transforms the result data
const transformResultData = (
    electionContestants,
    electionCommitteeSites,
    isColumnInEditMode,
    onVoteFieldChange,
    election,
    partyCommitteeVoteList,
    electionMethod,
    isDetailedResults,
) => {
    if (!electionContestants || !electionCommitteeSites || !election) return [];

    console.log("electionCommitteeSites: ", electionCommitteeSites);

    let participantIndex = 1;

    const participantTotalVoteUpdated = electionContestants.map((participant) => {
        const transformedResultFieldsData = transformParticipantData(
            participant,
            participantIndex,
            electionCommitteeSites,
            isColumnInEditMode,
            onVoteFieldChange,
            partyCommitteeVoteList,
            electionMethod,
            isDetailedResults
        );

        participantIndex++;
        return transformedResultFieldsData;
    });

    return calculateContestantPosition(participantTotalVoteUpdated, election.electSeats);
};

export {
    transformResultData,
}

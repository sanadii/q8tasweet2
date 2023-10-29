import React from 'react';
import { VotesInputField } from './FormComponents';

export const transformData = (
    electionCandidates,
    electionCommitteeResults,
    committeeEdited,
    handleEditCell
) => {

    if (!electionCommitteeResults) return [];

    // Create a Map for electionCandidates lookup of candidates by their id, c represents the (c)andidate
    const electionCandidateMap = new Map(electionCandidates.map(candidate => [candidate.id, candidate]));
    console.log("electionCandidateMap:", electionCandidateMap);


    // Check if any committee is in edit mode
    const isEditingAnyColumn = Object.values(committeeEdited).some(Boolean);

    // Calculate total votes for each candidate and organize electionCommitteeResults
    const transformed = Object.entries(electionCommitteeResults).reduce((acc, [committeeId, committeeVotes]) => {
        Object.entries(committeeVotes).forEach(([candidateId, votes]) => {
            candidateId = parseInt(candidateId);
            if (!acc[candidateId]) {
                acc[candidateId] = {
                    "candidate.id": candidateId,
                    position: electionCandidateMap.get(candidateId)?.position || 0,
                    total: 0,
                };
            }
            acc[candidateId].total += votes;
            acc[candidateId][`committee_${committeeId}`] = committeeEdited[committeeId]
                ? <VotesInputField candidateId={candidateId} committeeId={committeeId} votes={votes} handleEditCell={handleEditCell} />
                : votes;
        });
        return acc;
    }, {});
    console.log("transformedtransformed:", transformed);


    // Convert the object to an array and sort it
    const sortedCandidates = Object.values(transformed).sort((a, b) => {
        return isEditingAnyColumn
            ? (electionCandidateMap.get(a["candidate.id"])?.name || "").localeCompare(electionCandidateMap.get(b["candidate.id"])?.name || "")
            : a.position - b.position;
    });

    // Assigning the position
    sortedCandidates.forEach((item, index) => item.position = index + 1);

    return sortedCandidates;
};

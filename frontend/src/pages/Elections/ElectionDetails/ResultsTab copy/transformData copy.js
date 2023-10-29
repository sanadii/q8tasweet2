import React from 'react';
import { VotesInputField } from './FormComponents'; // Importing required component

export const transformData = (data, committeeEdited, electionCandidates, handleEditCell) => {

    console.log("Original Data:", data);

    // Add a guard clause to handle null or undefined data
    if (data === null || data === undefined) {
        return [];
    }
    const transformed = [];
    const totals = {};

    // Calculate total votes for each candidate
    for (const committeeVotes of Object.values(data)) {
        for (const [candidateId, votes] of Object.entries(committeeVotes)) {
            const id = parseInt(candidateId);
            totals[id] = (totals[id] || 0) + votes;
        }
    }


    // Check whether any column is in edit mode
    const isEditingAnyColumn = Object.values(committeeEdited).some(Boolean);

    // Helper function to find candidate name
    const findCandidateName = (id) => electionCandidates.find(c => c.id === id)?.name;

    // Sort candidates either by name (if editing) or by total votes (if not editing)
    const sortedCandidates = Object.keys(totals)
        .map(Number)
        .sort((a, b) => {
            const result = isEditingAnyColumn
                ? (findCandidateName(a) || "").localeCompare(findCandidateName(b) || "")
                : (() => {
                    const candidateA = electionCandidates.find(c => c.id === a);
                    const candidateB = electionCandidates.find(c => c.id === b);
                    return (candidateA.position || 0) - (candidateB.position || 0);
                })();
            return result;
        });

    // Organize and transform the data
    sortedCandidates.forEach((candidateId, index) => {
        // Creating initial row setup
        const row = { "candidate.id": candidateId, position: index + 1 };

        // Calculating and assigning total votes for each candidate
        row["total"] = totals[candidateId] || 0;

        // Assigning committee votes to each row
        for (const committeeId in data) {
            // Checking if column is in edit mode
            const isColumnInEditMode = committeeEdited[committeeId];

            // Assigning votes or input field based on edit mode
            row[`committee_${committeeId}`] = isColumnInEditMode
                ? <VotesInputField candidateId={candidateId} committeeId={committeeId} votes={data[committeeId][candidateId] || 0} handleEditCell={handleEditCell} />
                : data[committeeId][candidateId] || 0;
        }

        // Pushing each transformed row to the result
        transformed.push(row);
    });
    // Returning the transformed data

    return transformed;
};
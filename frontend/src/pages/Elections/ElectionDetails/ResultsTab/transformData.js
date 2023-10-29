import React from 'react';
import { VotesInputField } from './FormComponents';

export const transformData = (
    electionCandidates,
    electionCommittees,
    committeeEdited,
    handleEditCell,
    election
) => {
    if (!electionCandidates || !electionCommittees || !election) return [];

    const calculateTotalVotes = (candidate) => {
        return electionCommittees.reduce((total, committee) => {
            const committeeVote = candidate.committeeVotes?.find(v => v.electionCommittee === committee.id);
            return total + (committeeVote?.votes || 0);
        }, 0);
    };

    const createVoteInputField = (candidateId, committeeId, votes) => {
        return (
            <VotesInputField
                candidateId={candidateId}
                committeeId={committeeId}
                value={votes}
                onChange={(value) => handleEditCell(candidateId, committeeId, value)}
            />
        );
    };

    const candidatesWithTotalVotes = electionCandidates.map(candidate => {
        const totalVotes = calculateTotalVotes(candidate);
        const transformedCandidate = {
            'candidate.id': candidate.id,
            position: candidate.position,
            name: candidate.name,
            total: totalVotes
        };

        electionCommittees.forEach(committee => {
            const committeeVote = candidate.committeeVotes?.find(v => v.electionCommittee === committee.id);
            const votes = committeeEdited[committee.id]?.[candidate.id] ?? committeeVote?.votes ?? 0;
            transformedCandidate[`committee_${committee.id}`] = committeeEdited[committee.id]
                ? createVoteInputField(candidate.id, committee.id, votes)
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

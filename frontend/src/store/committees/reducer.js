import {
    // Committee Success/Error
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,

    // Election Committees
    GET_ELECTION_COMMITTEES,
    ADD_ELECTION_COMMITTEE_SUCCESS,
    ADD_ELECTION_COMMITTEE_FAIL,
    UPDATE_ELECTION_COMMITTEE_SUCCESS,
    UPDATE_ELECTION_COMMITTEE_FAIL,
    DELETE_ELECTION_COMMITTEE_SUCCESS,
    DELETE_ELECTION_COMMITTEE_FAIL,


    // Election Committee Results-
    UPDATE_ELECTION_RESULTS_SUCCESS,
    UPDATE_ELECTION_RESULTS_FAIL,
} from "./actionType";

const IntialState = {
};

const Committees = (state = IntialState, action) => {
    switch (action.type) {

        case API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case GET_ELECTION_COMMITTEES:
                    return {
                        ...state,
                        electionCommittee: action.payload.data,
                        isElectionCommitteeCreated: false,
                        isElectionCommitteeSuccess: true,
                    };
                default:
                    return { ...state };
            }
        case API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case GET_ELECTION_COMMITTEES: {
                    return {
                        ...state,
                        error: action.payload.error,
                        isElectionCommitteeCreated: false,
                        isElectionCommitteeSuccess: true,
                    };
                }
                default:
                    return { ...state };
            }
        // Election Committees
        case GET_ELECTION_COMMITTEES: {
            return {
                ...state,
                error: action.payload.error,
                isElectionCommitteeCreated: false,
                isElectionCommitteeSuccess: true,
            };
        }

        case ADD_ELECTION_COMMITTEE_SUCCESS:
            return {
                ...state,
                isElectionCommitteeCreated: true,
                electionCommittees: [...state.electionCommittees, action.payload.data],
                isElectionCommitteeAdd: true,
                isElectionCommitteeAddFail: false,
            };

        case ADD_ELECTION_COMMITTEE_FAIL:
            return {
                ...state,
                error: action.payload,
                isElectionCommitteeAdd: false,
                isElectionCommitteeAddFail: true,
            };
        case UPDATE_ELECTION_COMMITTEE_SUCCESS:
            return {
                ...state,
                electionCommittees: state.electionCommittees.map(
                    (electionCommittee) =>
                        electionCommittee.id.toString() === action.payload.data.id.toString()
                            ? { ...electionCommittee, ...action.payload.data }
                            : electionCommittee
                ),
                isElectionCommitteeUpdate: true,
                isElectionCommitteeUpdateFail: false,
            };
        case UPDATE_ELECTION_COMMITTEE_FAIL:
            return {
                ...state,
                error: action.payload,
                isElectionCommitteeUpdate: false,
                isElectionCommitteeUpdateFail: true,
            };
        case DELETE_ELECTION_COMMITTEE_SUCCESS:
            return {
                ...state,
                electionCommittees: state.electionCommittees.filter(
                    (electionCommittee) =>
                        electionCommittee.id.toString() !==
                        action.payload.electionCommittee.toString()
                ),
                isElectionCommitteeDelete: true,
                isElectionCommitteeDeleteFail: false,
            };
        case DELETE_ELECTION_COMMITTEE_FAIL:
            return {
                ...state,
                error: action.payload,
                isElectionCommitteeDelete: false,
                isElectionCommitteeDeleteFail: true,
            };


        // We need to update electionCandidates.candidate.committeeVotes with the new value




        // Election Party Results
        case UPDATE_ELECTION_RESULTS_SUCCESS: {
            const { data, resultType } = action.payload;
            const committeeIdStr = Object.keys(data)[0];
            const committeeId = parseInt(committeeIdStr, 10);

            let resultState;
            if (resultType === "parties") {
                resultState = state.electionParties;
            } else if (resultType === "candidates") {
                resultState = state.electionCandidates;
            } else if (resultType === "partyCandidates") {
                resultState = state.electionPartyCandidates;
            }



            // If committeeIdStr is not present, or it's not a number, or data[committeeIdStr] is not present, return the current state.
            if (!committeeIdStr || isNaN(committeeId) || !data[committeeIdStr]) return state;

            const updatedCandidateResult = resultState.map(candidate => {
                // Update votes directly on the candidate if committeeId is 0
                if (committeeId === 0) {
                    console.log("committeeIdStr", committeeIdStr, "updating candidate votes");
                    return {
                        ...candidate,
                        votes: data[committeeIdStr][candidate.id.toString()] || candidate.votes,
                    };
                }

                // If candidate has committeeVotes and committeeId is not 0, update committeeVotes
                if (candidate.committeeVotes) {
                    console.log("committeeIdStr", committeeIdStr, "updating committee");
                    const updatedVotes = candidate.committeeVotes.map(committeeVote => {
                        if (committeeVote.electionCommittee === committeeId) {
                            return {
                                ...committeeVote,
                                votes: data[committeeIdStr][candidate.id.toString()] || committeeVote.votes,
                            };
                        }
                        return committeeVote;
                    });

                    return {
                        ...candidate,
                        committeeVotes: updatedVotes,
                    };
                }

                return candidate;
            });

            return {
                ...state,
                ...(resultType === "parties"
                    ? { electionParties: updatedCandidateResult }
                    : resultType === "candidates"
                        ? { electionCandidates: updatedCandidateResult }
                        : resultType === "partyCandidates"
                            ? { electionPartyCandidates: updatedCandidateResult }
                            : {}),
                isElectionPartyCandidateResultUpdate: true,
                isElectionPartyCandidateResultUpdateFail: false,
            };


        }
        case UPDATE_ELECTION_RESULTS_FAIL:
            return {
                ...state,
                error: action.payload,
                isElectionCommitteeResultUpdated: false,
                isElectionCommitteeResultUpdatedFail: true,
            };


        default:
            return { ...state };
    }
};

export default Committees;



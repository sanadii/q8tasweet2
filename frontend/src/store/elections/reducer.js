import {
  // Election Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Election
  GET_ELECTIONS,
  GET_ELECTION_DETAILS,
  UPLOAD_ELECTION_DATA,
  ADD_ELECTION_SUCCESS,
  ADD_ELECTION_FAIL,
  UPDATE_ELECTION_SUCCESS,
  UPDATE_ELECTION_FAIL,
  DELETE_ELECTION_SUCCESS,
  DELETE_ELECTION_FAIL,

  // Election Candidates
  GET_ELECTION_CANDIDATES,
  ADD_ELECTION_CANDIDATE_SUCCESS,
  ADD_TO_ELECTION_AFTER_CANDIDATE_SUCCESS,
  ADD_ELECTION_CANDIDATE_FAIL,
  UPDATE_ELECTION_CANDIDATE_SUCCESS,
  UPDATE_ELECTION_CANDIDATE_FAIL,
  UPDATE_ELECTION_CANDIDATE_VOTES_SUCCESS,
  UPDATE_ELECTION_CANDIDATE_VOTES_FAIL,
  DELETE_ELECTION_CANDIDATE_SUCCESS,
  DELETE_ELECTION_CANDIDATE_FAIL,


  // Election Parties
  GET_ELECTION_PARTIES,
  ADD_ELECTION_PARTY_SUCCESS,
  ADD_TO_ELECTION_AFTER_PARTY_SUCCESS,
  ADD_ELECTION_PARTY_FAIL,
  UPDATE_ELECTION_PARTY_SUCCESS,
  UPDATE_ELECTION_PARTY_FAIL,
  DELETE_ELECTION_PARTY_SUCCESS,
  DELETE_ELECTION_PARTY_FAIL,
  UPDATE_ELECTION_PARTY_RESULTS_SUCCESS,
  UPDATE_ELECTION_PARTY_RESULTS_FAIL,

  // Election Parties
  GET_ELECTION_PARTY_CANDIDATES,
  ADD_ELECTION_PARTY_CANDIDATE_SUCCESS,
  ADD_TO_ELECTION_AFTER_PARTY_CANDIDATE_SUCCESS,
  ADD_ELECTION_PARTY_CANDIDATE_FAIL,
  UPDATE_ELECTION_PARTY_CANDIDATE_SUCCESS,
  UPDATE_ELECTION_PARTY_CANDIDATE_FAIL,
  DELETE_ELECTION_PARTY_CANDIDATE_SUCCESS,
  DELETE_ELECTION_PARTY_CANDIDATE_FAIL,
  UPDATE_ELECTION_PARTY_CANDIDATE_VOTES_SUCCESS,
  UPDATE_ELECTION_PARTY_CANDIDATE_VOTES_FAIL,

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
  elections: [],
  recentElections: [],
  futureElections: [],
  electionDetails: [],
  electionCandidates: [],
  electionParties: [],
  electionPartyCandidates: [],
  electionCampaigns: [],
  electionResults: [],
  electionSorters: [],

  // Schema
  schemaDetails: [],
  electionCommitteeSites: [],
  electionAreas: [],
};

const Elections = (state = IntialState, action) => {
  switch (action.type) {


    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ELECTIONS: {
          const { recentElections, futureElections, elections } = action.payload.data;

          // Update state based on the type of elections data received
          if (recentElections || futureElections) {
            return {
              ...state,
              recentElections,
              futureElections,
              isElectionCreated: false,
              isElectionSuccess: true,
            };
          } else if (elections) {
            return {
              ...state,
              elections,
              isElectionCreated: false,
              isElectionSuccess: true,
            };
          }
          return state;
        }
        case GET_ELECTION_DETAILS:
          return {
            ...state,
            electionDetails: action.payload.data.electionDetails,
            electionParties: action.payload.data.electionParties,
            electionPartyCandidates: action.payload.data.electionPartyCandidates,
            electionCandidates: action.payload.data.electionCandidates,
            electionCampaigns: action.payload.data.electionCampaigns,
            electionResults: action.payload.data.electionResults,
            electionSorters: action.payload.data.electionSorters,

            // Schema
            electionCommitteeSites: action.payload.data.electionCommitteeSites,
            electionAreas: action.payload.data.electionAreas,
            schemaDetails: action.payload.data.schemaDetails,

            isElectionCreated: false,
            isElectionSuccess: true,
          };
        case UPLOAD_ELECTION_DATA:
          return {
            ...state,
            // electiondata: action.payload.data,
            isElectionDataCreated: false,
            isElectionDataSuccess: true,
          };
        case GET_ELECTION_CANDIDATES:
          return {
            ...state,
            electionCandidates: action.payload.data,
            isElectionCandidateCreated: false,
            isElectionCandidateSuccess: true,
          };

        case GET_ELECTION_PARTIES:
          return {
            ...state,
            electionParties: action.payload.data,
            isElectionPartyCreated: false,
            isElectionPartySuccess: true,
          };

        case GET_ELECTION_PARTY_CANDIDATES:
          return {
            ...state,
            electionPartyCandidates: action.payload.data,
            isElectionPartyCandidateCreated: false,
            isElectionPartCandidateySuccess: true,
          };

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
        case GET_ELECTIONS:
          return {
            ...state,
            error: action.payload.error,
            isElectionCreated: false,
            isElectionSuccess: true,
          };
        case GET_ELECTION_DETAILS:
          return {
            ...state,
            error: action.payload.error,
            isElectionCreated: false,
            isElectionSuccess: true,
          };
        case UPLOAD_ELECTION_DATA:
          return {
            ...state,
            error: action.payload.error,
            isElectionCreated: false,
            isElectionSuccess: true,
          };

        case GET_ELECTION_CANDIDATES: {
          return {
            ...state,
            error: action.payload.error,
            isElectionCandidateCreated: false,
            isElectionCandidateSuccess: true,
          };
        }
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

    case GET_ELECTIONS: {
      return {
        ...state,
        isElectionCreated: false,
      };
    }

    case GET_ELECTION_DETAILS: {
      return {
        ...state,
        electionDetails: action.payload,
        isElectionCreated: false,
      };
    }

    case UPLOAD_ELECTION_DATA: {
      return {
        ...state,
        isElectionDataUploaded: true,
        isElectionCreated: false,
      };
    }

    case ADD_ELECTION_SUCCESS:
      return {
        ...state,
        isElectionCreated: true,
        elections: [...state.elections, action.payload.data],
        isElectionAdd: true,
        isElectionAddFail: false,
      };
    case ADD_ELECTION_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionAdd: false,
        isElectionAddFail: true,
      };
    case UPDATE_ELECTION_SUCCESS:
      return {
        ...state,
        // Checking before accessing Elections to prevent error
        elections: Array.isArray(state.elections)
          ? state.elections.map((election) =>
            election.id.toString() === action.payload.data.id.toString()
              ? { ...election, ...action.payload.data.elections }
              : election
          )
          : state.elections,

        // Checking before accessing Election Details to prevent error
        electionDetails: state.electionDetails
          ? {
            ...state.electionDetails,
            ...(action.payload.data || {}),
          }
          : action.payload.data || null,

        isCampaignUpdate: true,
        isCampaignUpdateFail: false,
      };

    case UPDATE_ELECTION_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionUpdate: false,
        isElectionUpdateFail: true,
      };
    case DELETE_ELECTION_SUCCESS:
      return {
        ...state,
        elections: state.elections.filter(
          (election) =>
            election.id.toString() !== action.payload.election.id.toString()
        ),
        isElectionDelete: true,
        isElectionDeleteFail: false,
      };
    case DELETE_ELECTION_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionDelete: false,
        isElectionDeleteFail: true,
      };

    // Election Candidates
    case GET_ELECTION_CANDIDATES: {
      return {
        ...state,
        error: action.payload.error,
        isElectionCandidateCreated: false,
        isElectionCandidateSuccess: true,
      };
    }

    case ADD_ELECTION_CANDIDATE_SUCCESS:
      return {
        ...state,
        isElectionCandidateCreated: true,
        electionCandidates: [...state.electionCandidates, action.payload.data],
        isElectionCandidateAdd: true,
        isElectionCandidateAddFail: false,
      };

    // DO_AFTER_ADD_CANDIDATE_SUCCESS
    case ADD_TO_ELECTION_AFTER_CANDIDATE_SUCCESS:
      return {
        ...state,
        isElectionCandidateCreated: true,
        electionCandidates: [...state.electionCandidates, action.payload.electionCandidate],
        isElectionCandidateAdd: true,
        isElectionCandidateAddFail: false,
      };

    case ADD_ELECTION_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCandidateAdd: false,
        isElectionCandidateAddFail: true,
      };
    case UPDATE_ELECTION_CANDIDATE_SUCCESS:
      return {
        ...state,
        electionCandidates: state.electionCandidates.map((electionCandidate) =>
          electionCandidate.id.toString() === action.payload.data.id.toString()
            ? { ...electionCandidate, ...action.payload.data }
            : electionCandidate
        ),
        isElectionCandidateUpdate: true,
        isElectionCandidateUpdateFail: false,
      };

    case UPDATE_ELECTION_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCandidateUpdate: false,
        isElectionCandidateUpdateFail: true,
      };
    // case DELETE_ELECTION_CANDIDATE_SUCCESS:
    //   console.log("action.payload: ", action.payload)
    //   return {
    //     ...state,
    //     electionCandidates: state.electionCandidates.filter(
    //       (electionCandidate) =>
    //         electionCandidate.id.toString() !== action.payload.electionCandidate.toString()
    //     ),
    //     isElectionCandidateDelete: true,
    //     isElectionCandidateDeleteFail: false,
    //   };

    case DELETE_ELECTION_CANDIDATE_SUCCESS:
      console.log("action.payload: ", action.payload)
      return {
        ...state,
        electionCandidates: state.electionCandidates.filter(
          (electionCandidate) =>
            electionCandidate.id.toString() !== action.payload.electionCandidate.id.toString()
        ),
        isElectionCandidateDelete: true,
        isElectionCandidateDeleteFail: false,
      };



    case DELETE_ELECTION_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCandidateDelete: false,
        isElectionCandidateDeleteFail: true,
      };


    // Election Candidate Votes
    case UPDATE_ELECTION_CANDIDATE_VOTES_SUCCESS:
      return {

        ...state,
        electionCandidates: action.payload.data,
        isElectionCandidateUpdate: true,
        isElectionCandidateUpdateFail: false,


        // ...state,
        // electionCandidates: state.electionCandidates.map((electionCandidate) =>
        //   electionCandidate.id.toString() === action.payload.data.id.toString()
        //     ? { ...electionCandidate, ...action.payload.data }
        //     : electionCandidate
        // ),
        // isElectionCandidateUpdate: true,
        // isElectionCandidateUpdateFail: false,
      };
    case UPDATE_ELECTION_CANDIDATE_VOTES_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCandidateUpdate: false,
        isElectionCandidateUpdateFail: true,
      };



    // Election Party
    case GET_ELECTION_PARTIES: {
      return {
        ...state,
        error: action.payload.error,
        isElectionPartyCreated: false,
        isElectionPartySuccess: true,
      };
    }

    case ADD_ELECTION_PARTY_SUCCESS:
      return {
        ...state,
        isElectionPartyCreated: true,
        electionParties: [...state.electionParties, action.payload.data],
        isElectionPartyAdd: true,
        isElectionPartyAddFail: false,
      };

    // DO_AFTER_ADD_PARTY_SUCCESS
    case ADD_TO_ELECTION_AFTER_PARTY_SUCCESS:
      return {
        ...state,
        isElectionPartyCreated: true,
        electionParties: [...state.electionParties, action.payload.electionParty],
        isElectionPartyAdd: true,
        isElectionPartyAddFail: false,
      };

    case ADD_ELECTION_PARTY_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionPartyAdd: false,
        isElectionPartyAddFail: true,
      };
    case UPDATE_ELECTION_PARTY_SUCCESS:
      return {
        ...state,
        electionParties: state.electionParties.map((electionParty) =>
          electionParty.id.toString() === action.payload.data.id.toString()
            ? { ...electionParty, ...action.payload.data }
            : electionParty
        ),
        isElectionPartyUpdate: true,
        isElectionPartyUpdateFail: false,
      };

    case UPDATE_ELECTION_PARTY_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionPartyUpdate: false,
        isElectionPartyUpdateFail: true,
      };

    case DELETE_ELECTION_PARTY_SUCCESS:
      return {
        ...state,
        electionParties: state.electionParties.filter(
          (electionParty) =>
            electionParty.id.toString() !==
            action.payload.electionParty.id.toString()
        ),
        isElectionPartyDelete: true,
        isElectionPartyDeleteFail: false,
      };

    case DELETE_ELECTION_PARTY_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionPartyDelete: false,
        isElectionPartyDeleteFail: true,
      };

    // Election Party Candidates
    case GET_ELECTION_PARTY_CANDIDATES: {
      return {
        ...state,
        error: action.payload.error,
        isElectionPartyCandidateCreated: false,
        isElectionPartyCandidateSuccess: true,
      };
    }

    case ADD_ELECTION_PARTY_CANDIDATE_SUCCESS:
      return {
        ...state,
        isElectionPartyCandidateCreated: true,
        electionPartyCandidates: [...state.electionPartyCandidates, action.payload.data],
        isElectionPartyCandidateAdd: true,
        isElectionPartyCandidateAddFail: false,
      };

    // DO_AFTER_ADD_PARTY_CANDIDATE_SUCCESS
    case ADD_TO_ELECTION_AFTER_PARTY_CANDIDATE_SUCCESS:
      return {
        ...state,
        isElectionPartyCandidateCreated: true,
        electionPartyCandidates: [...state.electionPartyCandidates, action.payload.electionPartyCandidate],
        isElectionPartyCandidateAdd: true,
        isElectionPartyCandidateAddFail: false,
      };

    case ADD_ELECTION_PARTY_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionPartyCandidateAdd: false,
        isElectionPartyCandidateAddFail: true,
      };

    case UPDATE_ELECTION_PARTY_CANDIDATE_SUCCESS:
      return {
        ...state,
        electionPartyCandidates: state.electionPartyCandidates.map((electionParty) =>
          electionParty.id.toString() === action.payload.data.id.toString()
            ? { ...electionParty, ...action.payload.data }
            : electionParty
        ),
        isElectionPartyCandidateUpdate: true,
        isElectionPartyCandidateUpdateFail: false,
      };

    case UPDATE_ELECTION_PARTY_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionPartyCandidateUpdate: false,
        isElectionPartyCandidateUpdateFail: true,
      };

    case DELETE_ELECTION_PARTY_CANDIDATE_SUCCESS:
      return {
        ...state,
        electionPartyCandidates: state.electionPartyCandidates.filter(
          (electionPartyCandidate) =>
            electionPartyCandidate.id.toString() !==
            action.payload.electionPartyCandidate.id.toString()
        ),
        isElectionPartyCandidateDelete: true,
        isElectionPartyCandidateDeleteFail: false,
      };

    case DELETE_ELECTION_PARTY_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionPartyCandidateDelete: false,
        isElectionPartyCandidateDeleteFail: true,
      };


    // Election Party Votes
    case UPDATE_ELECTION_PARTY_CANDIDATE_VOTES_SUCCESS:
      return {

        ...state,
        electionParties: action.payload.data,
        isElectionPartyCandidateUpdate: true,
        isElectionPartyCandidateUpdateFail: false,
      };

    case UPDATE_ELECTION_PARTY_CANDIDATE_VOTES_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionPartyCandidateUpdate: false,
        isElectionPartyCandidateUpdateFail: true,
      };


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
            action.payload.electionCommittee.id.toString()
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


    // We need to update electionCandidates.candidate.committeeResults with the new value




    // Election Party Results
    case UPDATE_ELECTION_RESULTS_SUCCESS: {
      const { data, electionMethod, isDetailedResults } = action.payload;
      const committeeIdStr = Object.keys(data)[0];
      const committeeId = parseInt(committeeIdStr, 10);

      let participantState;
      if (electionMethod === "candidateOnly" || electionMethod === "partyCandidateOriented") {
        participantState = state.electionCandidates;
      } else if (electionMethod === "parties") {
        participantState = state.electionParties;
      } else if (electionMethod === "partyCandidates") {
        participantState = state.electionPartyCandidates;
      }

      // If committeeIdStr is not present, or it's not a number, or data[committeeIdStr] is not present, return the current state.
      if (!committeeIdStr || isNaN(committeeId) || !data[committeeIdStr]) return state;

      const updatedParticipantState = participantState.map(participant => {
        // Update votes directly on the participant if committeeId is 0
        if (isDetailedResults === false) {
          return {
            ...participant,
            votes: data[committeeIdStr][participant.id.toString()] || participant.votes,
          };
        }

        // If participant has committeeResults and committeeId is not 0, update committeeResults
        if (isDetailedResults === true) {
          console.log("committeeIdStr", committeeIdStr, "updating committee", "Participant: ", participant, "data: ", data);

          const updatedVotes = participant.committeeResults.map(committeeVote => {
            if (committeeVote.committee === committeeId) {
              return {
                ...committeeVote,
                votes: data[committeeIdStr][participant.id.toString()] || committeeVote.votes,
              };
            }
            return committeeVote;
          });

          // Handle case where committeeResults might be empty or not found
          const newVotes = data[committeeIdStr][participant.id.toString()];
          if (newVotes !== undefined && !updatedVotes.some(vote => vote.committee === committeeId)) {
            updatedVotes.push({
              committee: committeeId,
              votes: newVotes
            });
          }

          return {
            ...participant,
            committeeResults: updatedVotes,
          };
        }

        return participant;
      });

      return {
        ...state,
        ...(electionMethod === "parties"
          ? { electionParties: updatedParticipantState }
          : electionMethod === "candidateOnly" || electionMethod === "partyCandidateOriented"
            ? { electionCandidates: updatedParticipantState }
            : electionMethod === "partyCandidates"
              ? { electionPartyCandidates: updatedParticipantState }
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

export default Elections;

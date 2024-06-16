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
<<<<<<< HEAD
  DELETE_ELECTION_CANDIDATE_SUCCESS,
  DELETE_ELECTION_CANDIDATE_FAIL,
  UPDATE_ELECTION_CANDIDATE_VOTES_SUCCESS,
  UPDATE_ELECTION_CANDIDATE_VOTES_FAIL,
=======
  UPDATE_ELECTION_CANDIDATE_VOTES_SUCCESS,
  UPDATE_ELECTION_CANDIDATE_VOTES_FAIL,
  DELETE_ELECTION_CANDIDATE_SUCCESS,
  DELETE_ELECTION_CANDIDATE_FAIL,
>>>>>>> sanad


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
<<<<<<< HEAD


  // Election Campaigns
  GET_ELECTION_CAMPAIGNS,
  ADD_ELECTION_CAMPAIGN_SUCCESS,
  ADD_ELECTION_CAMPAIGN_FAIL,
  UPDATE_ELECTION_CAMPAIGN_SUCCESS,
  UPDATE_ELECTION_CAMPAIGN_FAIL,
  DELETE_ELECTION_CAMPAIGN_SUCCESS,
  DELETE_ELECTION_CAMPAIGN_FAIL,
=======
>>>>>>> sanad
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
<<<<<<< HEAD
  electionCommittees: [],
  electionResults: [],
  electionSorters: [],
=======
  electionResults: [],
  electionSorters: [],

  // Schema
  schemaDetails: [],
  electionCommitteeSites: [],
  electionAreas: [],
>>>>>>> sanad
};

const Elections = (state = IntialState, action) => {
  switch (action.type) {
<<<<<<< HEAD
=======


>>>>>>> sanad
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
<<<<<<< HEAD
            electionCommittees: action.payload.data.electionCommittees,
            electionResults: action.payload.data.electionResults,
            electionSorters: action.payload.data.electionSorters,
=======
            electionResults: action.payload.data.electionResults,
            electionSorters: action.payload.data.electionSorters,

            // Schema
            electionCommitteeSites: action.payload.data.electionCommitteeSites,
            electionAreas: action.payload.data.electionAreas,
            schemaDetails: action.payload.data.schemaDetails,

>>>>>>> sanad
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
<<<<<<< HEAD
        case GET_ELECTION_CAMPAIGNS:
          return {
            ...state,
            electionCampaigns: action.payload.data,
            isElectionCampaignCreated: false,
            isElectionCampaignSuccess: true,
          };
=======
>>>>>>> sanad

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

<<<<<<< HEAD
        case GET_ELECTION_CAMPAIGNS: {
          return {
            ...state,
            error: action.payload.error,
            isElectionCampaignCreated: false,
            isElectionCampaignSuccess: true,
          };
        }
=======
>>>>>>> sanad
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
<<<<<<< HEAD
            election.id.toString() !== action.payload.election.toString()
=======
            election.id.toString() !== action.payload.election.id.toString()
>>>>>>> sanad
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
<<<<<<< HEAD
=======

>>>>>>> sanad
    case UPDATE_ELECTION_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCandidateUpdate: false,
        isElectionCandidateUpdateFail: true,
      };
<<<<<<< HEAD
    case DELETE_ELECTION_CANDIDATE_SUCCESS:
=======
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
>>>>>>> sanad
      return {
        ...state,
        electionCandidates: state.electionCandidates.filter(
          (electionCandidate) =>
<<<<<<< HEAD
            electionCandidate.id.toString() !==
            action.payload.electionCandidate.toString()
=======
            electionCandidate.id.toString() !== action.payload.electionCandidate.id.toString()
>>>>>>> sanad
        ),
        isElectionCandidateDelete: true,
        isElectionCandidateDeleteFail: false,
      };
<<<<<<< HEAD
=======



>>>>>>> sanad
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
<<<<<<< HEAD
            action.payload.electionParty.toString()
=======
            action.payload.electionParty.id.toString()
>>>>>>> sanad
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
<<<<<<< HEAD
            action.payload.electionPartyCandidate.toString()
=======
            action.payload.electionPartyCandidate.id.toString()
>>>>>>> sanad
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
<<<<<<< HEAD
            action.payload.electionCommittee.toString()
=======
            action.payload.electionCommittee.id.toString()
>>>>>>> sanad
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


<<<<<<< HEAD
    // We need to update electionCandidates.candidate.committeeVotes with the new value
=======
    // We need to update electionCandidates.candidate.committeeResults with the new value
>>>>>>> sanad




    // Election Party Results
    case UPDATE_ELECTION_RESULTS_SUCCESS: {
<<<<<<< HEAD
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
=======
      const { data, electionMethod, isDetailedResults } = action.payload;
      const committeeIdStr = Object.keys(data)[0];
      const committeeId = parseInt(committeeIdStr, 10);

      let participantState;
      if (electionMethod === "candidateOnly") {
        participantState = state.electionCandidates;
      } else if (electionMethod === "parties") {
        participantState = state.electionParties;
      } else if (electionMethod === "partyCandidates") {
        participantState = state.electionPartyCandidates;
>>>>>>> sanad
      }



      // If committeeIdStr is not present, or it's not a number, or data[committeeIdStr] is not present, return the current state.
      if (!committeeIdStr || isNaN(committeeId) || !data[committeeIdStr]) return state;

<<<<<<< HEAD
      const updatedCandidateResult = resultState.map(candidate => {
        // Update votes directly on the candidate if committeeId is 0
        if (committeeId === 0) {
          console.log("committeeIdStr", committeeIdStr, "updating candidate votes");
=======
      const updatedCandidateResult = participantState.map(candidate => {
        // Update votes directly on the candidate if committeeId is 0
        if (isDetailedResults === false) {
          // console.log("committeeIdStr", committeeIdStr, "updating candidate votes");
>>>>>>> sanad
          return {
            ...candidate,
            votes: data[committeeIdStr][candidate.id.toString()] || candidate.votes,
          };
        }

<<<<<<< HEAD
        // If candidate has committeeVotes and committeeId is not 0, update committeeVotes
        if (candidate.committeeVotes) {
          console.log("committeeIdStr", committeeIdStr, "updating committee");
          const updatedVotes = candidate.committeeVotes.map(committeeVote => {
            if (committeeVote.electionCommittee === committeeId) {
=======
        // If candidate has committeeResults and committeeId is not 0, update committeeResults
        if (isDetailedResults === true) {
          // console.log("committeeIdStr", committeeIdStr, "updating committee", "Participant: ", candidate, "data: ", data);

          const updatedVotes = candidate.committeeResults.map(committeeVote => {
            if (committeeVote.committee === committeeId) {
>>>>>>> sanad
              return {
                ...committeeVote,
                votes: data[committeeIdStr][candidate.id.toString()] || committeeVote.votes,
              };
            }
            return committeeVote;
          });

          return {
            ...candidate,
<<<<<<< HEAD
            committeeVotes: updatedVotes,
=======
            committeeResults: updatedVotes,
>>>>>>> sanad
          };
        }

        return candidate;
      });

      return {
        ...state,
<<<<<<< HEAD
        ...(resultType === "parties"
          ? { electionParties: updatedCandidateResult }
          : resultType === "candidates"
            ? { electionCandidates: updatedCandidateResult }
            : resultType === "partyCandidates"
=======
        ...(electionMethod === "parties"
          ? { electionParties: updatedCandidateResult }
          : electionMethod === "candidateOnly"
            ? { electionCandidates: updatedCandidateResult }
            : electionMethod === "partyCandidates"
>>>>>>> sanad
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

<<<<<<< HEAD

    // Election Campaigns
    case GET_ELECTION_CAMPAIGNS: {
      return {
        ...state,
        error: action.payload.error,
        isElectionCampaignCreated: false,
        isElectionCampaignSuccess: true,
      };
    }

    case ADD_ELECTION_CAMPAIGN_SUCCESS:
      return {
        ...state,
        isElectionCampaignCreated: true,
        electionCampaigns: [
          ...state.electionCampaigns,
          action.payload.data,
        ],
        isElectionCampaignAdd: true,
        isElectionCampaignAddFail: false,
      };

    case ADD_ELECTION_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCampaignAdd: false,
        isElectionCampaignAddFail: true,
      };
    case UPDATE_ELECTION_CAMPAIGN_SUCCESS:
      return {
        ...state,
        electionCampaigns: state.electionCampaigns.map(
          (electionCampaign) =>
            electionCampaign.id.toString() ===
              action.payload.data.id.toString()
              ? { ...electionCampaign, ...action.payload.data }
              : electionCampaign
        ),
        isElectionCampaignUpdate: true,
        isElectionCampaignUpdateFail: false,
      };
    case UPDATE_ELECTION_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCampaignUpdate: false,
        isElectionCampaignUpdateFail: true,
      };
    case DELETE_ELECTION_CAMPAIGN_SUCCESS:
      return {
        ...state,
        electionCampaigns: state.electionCampaigns.filter(
          (electionCampaign) =>
            electionCampaign.id.toString() !==
            action.payload.electionCampaign.toString()
        ),
        isElectionCampaignDelete: true,
        isElectionCampaignDeleteFail: false,
      };
    case DELETE_ELECTION_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCampaignDelete: false,
        isElectionCampaignDeleteFail: true,
      };



=======
>>>>>>> sanad
    default:
      return { ...state };
  }
};

export default Elections;

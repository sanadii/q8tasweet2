import {
  // Campaign Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Campaign s
  GET_CAMPAIGNS,
  ADD_NEW_CAMPAIGN_SUCCESS,
  ADD_NEW_CAMPAIGN_FAIL,
  UPDATE_CAMPAIGN_SUCCESS,
  UPDATE_CAMPAIGN_FAIL,
  DELETE_CAMPAIGN_SUCCESS,
  DELETE_CAMPAIGN_FAIL,

  // Campaign Details
  GET_CAMPAIGN_DETAILS,

  // Campaign Members
  GET_ALL_CAMPAIGN_MEMBERS,
  // GET_CAMPAIGN_MEMBER_DETAILS,
  ADD_NEW_CAMPAIGN_MEMBER_SUCCESS,
  ADD_NEW_CAMPAIGN_MEMBER_FAIL,
  UPDATE_CAMPAIGN_MEMBER_SUCCESS,
  UPDATE_CAMPAIGN_MEMBER_FAIL,
  DELETE_CAMPAIGN_MEMBER_SUCCESS,
  DELETE_CAMPAIGN_MEMBER_FAIL,

  // Campaign Guarantees
  GET_ALL_CAMPAIGN_GUARANTEES,
  // GET_CAMPAIGN_GUARANTEE_DETAILS,
  ADD_NEW_CAMPAIGN_GUARANTEE_SUCCESS,
  ADD_NEW_CAMPAIGN_GUARANTEE_FAIL,
  UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  UPDATE_CAMPAIGN_GUARANTEE_FAIL,
  DELETE_CAMPAIGN_GUARANTEE_SUCCESS,
  DELETE_CAMPAIGN_GUARANTEE_FAIL,

  // Campaign Attendees
  GET_ELECTION_ATTENDEES,
  // GET_ELECTION_ATTENDEE_DETAILS,
  ADD_NEW_ELECTION_ATTENDEE_SUCCESS,
  ADD_NEW_ELECTION_ATTENDEE_FAIL,
  UPDATE_ELECTION_ATTENDEE_SUCCESS,
  UPDATE_ELECTION_ATTENDEE_FAIL,
  DELETE_ELECTION_ATTENDEE_SUCCESS,
  DELETE_ELECTION_ATTENDEE_FAIL,
} from "./actionType";

const IntialState = {
  currentCampaignMember: [],

  campaigns: [],
  campaignDetails: [],
  campaignGuarantees: [],

  campaignElectionCandidates: [],
  campaignElectionCommittees: [],
  campaignElectionAttendees: [],
};

const Campaigns = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_CAMPAIGNS:
          return {
            ...state,
            campaigns: action.payload.data,
            isCampaignCreated: false,
            isCampaignSuccess: true,
          };
        case GET_CAMPAIGN_DETAILS:
          return {
            ...state,
            currentCampaignMember: action.payload.data.currentCampaignMember,

            campaignDetails: action.payload.data.campaignDetails,
            campaignMembers: action.payload.data.campaignMembers,
            campaignGuarantees: action.payload.data.campaignGuarantees,

            campaignElectionCandidates: action.payload.data.electionCandidates,
            campaignElectionCommittees: action.payload.data.electionCommittees,
            campaignElectionAttendees: action.payload.data.electionAttendees,
            isCampaignCreated: false,
            isCampaignSuccess: true,
          };
        case GET_ALL_CAMPAIGN_MEMBERS:
          return {
            ...state,
            campaignMembers: action.payload.data,
            isCampaignMemberCreated: false,
            isCampaignMemberSuccess: true,
          };
        case GET_ALL_CAMPAIGN_GUARANTEES:
          return {
            ...state,
            campaignGuarantees: action.payload.data,
            isCampaignGuaranteeCreated: false,
            isCampaignGuaranteeSuccess: true,
          };
        case GET_ELECTION_ATTENDEES:
          return {
            ...state,
            campaignElectionAttendees: action.payload.data.electors,
            isElectionAttendeeCreated: false,
            isElectionAttendeeSuccess: true,
          };

        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_CAMPAIGNS:
          return {
            ...state,
            error: action.payload.error,
            isCampaignCreated: false,
            isCampaignSuccess: true,
          };
        case GET_CAMPAIGN_DETAILS:
          console.log(
            "GET_CAMPAIGN_DETAILS ERROR LOGGING Payload:",
            action.payload
          ); // Log the payload

          return {
            ...state,
            error: action.payload.error,
            isCampaignCreated: false,
            isCampaignSuccess: true,
          };
        case GET_ALL_CAMPAIGN_MEMBERS: {
          return {
            ...state,
            error: action.payload.error,
            isCampaignMemberCreated: false,
            isCampaignMemberSuccess: true,
          };
        }
        case GET_ALL_CAMPAIGN_GUARANTEES: {
          return {
            ...state,
            error: action.payload.error,
            isCampaignGuaranteeCreated: false,
            isCampaignGuaranteeSuccess: true,
          };
        }
        case GET_ELECTION_ATTENDEES: {
          return {
            ...state,
            error: action.payload.error,
            isElectionAttendeeCreated: false,
            isElectionAttendeeSuccess: true,
          };
        }

        default:
          return { ...state };
      }

    case GET_CAMPAIGNS: {
      return {
        ...state,
        isCampaignCreated: false,
      };
    }

    case GET_CAMPAIGN_DETAILS: {
      return {
        ...state,
        campaignDetails: action.payload,
        isCampaignCreated: false,
      };
    }
    case ADD_NEW_CAMPAIGN_SUCCESS:
      return {
        ...state,
        isCampaignCreated: true,
        campaigns: [...state.campaigns, action.payload.data],
        isCampaignAdd: true,
        isCampaignAddFail: false,
      };
    case ADD_NEW_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignAdd: false,
        isCampaignAddFail: true,
      };
    case UPDATE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        campaigns: state.campaigns.map((campaign) =>
          campaign.id.toString() === action.payload.data.id.toString()
            ? { ...campaign, ...action.payload.data }
            : campaign
        ),
        isCampaignUpdate: true,
        isCampaignUpdateFail: false,
      };
    case UPDATE_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignUpdate: false,
        isCampaignUpdateFail: true,
      };
    case DELETE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        campaigns: state.campaigns.filter(
          (campaign) =>
            campaign.id.toString() !== action.payload.campaign.toString()
        ),
        isCampaignDelete: true,
        isCampaignDeleteFail: false,
      };
    case DELETE_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignDelete: false,
        isCampaignDeleteFail: true,
      };

    // Campaign Candidates
    case GET_ALL_CAMPAIGN_MEMBERS: {
      return {
        ...state,
        error: action.payload.error,
        isCampaignMemberCreated: false,
        isCampaignMemberSuccess: true,
      };
    }

    case ADD_NEW_CAMPAIGN_MEMBER_SUCCESS:
      return {
        ...state,
        isCampaignMemberCreated: true,
        campaignMembers: [...state.campaignMembers, action.payload.data],
        isCampaignMemberAdd: true,
        isCampaignMemberAddFail: false,
      };

    case ADD_NEW_CAMPAIGN_MEMBER_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignMemberAdd: false,
        isCampaignMemberAddFail: true,
      };
    case UPDATE_CAMPAIGN_MEMBER_SUCCESS:
      return {
        ...state,
        campaignMembers: state.campaignMembers.map((campaignMember) =>
          campaignMember.id.toString() === action.payload.data.id.toString()
            ? { ...campaignMember, ...action.payload.data }
            : campaignMember
        ),
        isCampaignMemberUpdate: true,
        isCampaignMemberUpdateFail: false,
      };
    case UPDATE_CAMPAIGN_MEMBER_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignMemberUpdate: false,
        isCampaignMemberUpdateFail: true,
      };
    case DELETE_CAMPAIGN_MEMBER_SUCCESS:
      return {
        ...state,
        campaignMembers: state.campaignMembers.filter(
          (campaignMember) =>
            campaignMember.id.toString() !==
            action.payload.campaignMember.toString()
        ),
        isCampaignMemberDelete: true,
        isCampaignMemberDeleteFail: false,
      };
    case DELETE_CAMPAIGN_MEMBER_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignMemberDelete: false,
        isCampaignMemberDeleteFail: true,
      };

    // Campaign Candidates
    case GET_ALL_CAMPAIGN_GUARANTEES: {
      return {
        ...state,
        error: action.payload.error,
        isCampaignGuaranteeCreated: false,
        isCampaignGuaranteeSuccess: true,
      };
    }

    case ADD_NEW_CAMPAIGN_GUARANTEE_SUCCESS:
      return {
        ...state,
        isCampaignGuaranteeCreated: true,
        campaignGuarantees: [...state.campaignGuarantees, action.payload.data],
        isCampaignGuaranteeAdd: true,
        isCampaignGuaranteeAddFail: false,
      };

    case ADD_NEW_CAMPAIGN_GUARANTEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignGuaranteeAdd: false,
        isCampaignGuaranteeAddFail: true,
      };
    case UPDATE_CAMPAIGN_GUARANTEE_SUCCESS:
      return {
        ...state,
        campaignGuarantees: state.campaignGuarantees.map((campaignGuarantee) =>
          campaignGuarantee.id.toString() === action.payload.data.id.toString()
            ? { ...campaignGuarantee, ...action.payload.data }
            : campaignGuarantee
        ),
        isCampaignGuaranteeUpdate: true,
        isCampaignGuaranteeUpdateFail: false,
      };
    case UPDATE_CAMPAIGN_GUARANTEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignGuaranteeUpdate: false,
        isCampaignGuaranteeUpdateFail: true,
      };
    case DELETE_CAMPAIGN_GUARANTEE_SUCCESS:
      return {
        ...state,
        campaignGuarantees: state.campaignGuarantees.filter(
          (campaignGuarantee) =>
            campaignGuarantee.id.toString() !==
            action.payload.campaignGuarantee.toString()
        ),
        isCampaignGuaranteeDelete: true,
        isCampaignGuaranteeDeleteFail: false,
      };
    case DELETE_CAMPAIGN_GUARANTEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignGuaranteeDelete: false,
        isCampaignGuaranteeDeleteFail: true,
      };
    // Campaign Attendees
    case GET_ELECTION_ATTENDEES: {
      return {
        ...state,
        error: action.payload.error,
        isElectionAttendeeCreated: false,
        isElectionAttendeeSuccess: true,
      };
    }

    case ADD_NEW_ELECTION_ATTENDEE_SUCCESS:
      return {
        ...state,
        isElectionAttendeeCreated: true,
        campaignElectionAttendees: [...state.campaignElectionAttendees, action.payload.data],
        isElectionAttendeeAdd: true,
        isElectionAttendeeAddFail: false,
      };

    case ADD_NEW_ELECTION_ATTENDEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionAttendeeAdd: false,
        isElectionAttendeeAddFail: true,
      };
    case UPDATE_ELECTION_ATTENDEE_SUCCESS:
      return {
        ...state,
        campaignElectionAttendees: state.campaignElectionAttendees.map((electionAttendee) =>
          electionAttendee.id.toString() === action.payload.data.id.toString()
            ? { ...electionAttendee, ...action.payload.data }
            : electionAttendee
        ),
        isElectionAttendeeUpdate: true,
        isElectionAttendeeUpdateFail: false,
      };
    case UPDATE_ELECTION_ATTENDEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionAttendeeUpdate: false,
        isElectionAttendeeUpdateFail: true,
      };
    case DELETE_ELECTION_ATTENDEE_SUCCESS:
      return {
        ...state,
        campaignElectionAttendees: state.campaignElectionAttendees.filter(
          (electionAttendee) =>
            electionAttendee.id.toString() !==
            action.payload.electionAttendee.toString()
        ),
        isElectionAttendeeDelete: true,
        isElectionAttendeeDeleteFail: false,
      };
    case DELETE_ELECTION_ATTENDEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionAttendeeDelete: false,
        isElectionAttendeeDeleteFail: true,
      };


    default:
      return { ...state };
  }
};

export default Campaigns;

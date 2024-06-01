import {
  // Campaign Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Campaigns ------------
  GET_CAMPAIGNS,
  GET_CAMPAIGN_DETAILS,
  ADD_CAMPAIGN,
  ADD_CAMPAIGN_SUCCESS,
  ADD_CAMPAIGN_FAIL,
  UPDATE_CAMPAIGN_SUCCESS,
  UPDATE_CAMPAIGN_FAIL,
  DELETE_CAMPAIGN_SUCCESS,
  DELETE_CAMPAIGN_FAIL,

  // Campaign Members
  GET_ALL_CAMPAIGN_MEMBERS,
  ADD_CAMPAIGN_MEMBER_SUCCESS,
  ADD_CAMPAIGN_MEMBER_FAIL,
  UPDATE_CAMPAIGN_MEMBER_SUCCESS,
  UPDATE_CAMPAIGN_MEMBER_FAIL,
  DELETE_CAMPAIGN_MEMBER_SUCCESS,
  DELETE_CAMPAIGN_MEMBER_FAIL,

  // Campaign Guarantees
  GET_ALL_CAMPAIGN_GUARANTEES,
  ADD_CAMPAIGN_GUARANTEE_SUCCESS,
  ADD_CAMPAIGN_GUARANTEE_FAIL,
  UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  UPDATE_CAMPAIGN_GUARANTEE_FAIL,
  DELETE_CAMPAIGN_GUARANTEE_SUCCESS,
  DELETE_CAMPAIGN_GUARANTEE_FAIL,

  // Campaign Guarantees
  GET_ALL_CAMPAIGN_GUARANTEE_GROUPS,
  ADD_CAMPAIGN_GUARANTEE_GROUP_SUCCESS,
  ADD_CAMPAIGN_GUARANTEE_GROUP_FAIL,
  UPDATE_CAMPAIGN_GUARANTEE_GROUP_SUCCESS,
  UPDATE_CAMPAIGN_GUARANTEE_GROUP_FAIL,
  DELETE_CAMPAIGN_GUARANTEE_GROUP_SUCCESS,
  DELETE_CAMPAIGN_GUARANTEE_GROUP_FAIL,

  // Campaign Attendees
  GET_CAMPAIGN_ATTENDEES,
  ADD_CAMPAIGN_ATTENDEE_SUCCESS,
  ADD_CAMPAIGN_ATTENDEE_FAIL,
  UPDATE_CAMPAIGN_ATTENDEE_SUCCESS,
  UPDATE_CAMPAIGN_ATTENDEE_FAIL,
  DELETE_CAMPAIGN_ATTENDEE_SUCCESS,
  DELETE_CAMPAIGN_ATTENDEE_FAIL,

  // Campaign Sorting
  GET_ALL_CAMPAIGN_SORTING,
  GET_CAMPAIGN_COMMITTEE_SORTING,

} from "./actionType";

const IntialState = {
  currentCampaignMember: [],

  campaigns: [],
  electionDetails: [],
  campaignDetails: [],
  campaignGuarantees: [],
  campaignGuaranteeGroups: [],
  campaignAttendees: [],
  campaignSorting: [],
  campaignNotifications: [],

  campaignElectionCandidates: [],
  electionCommitteeSites: [],
  campaignRoles: [],
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
            campaignRoles: action.payload.data.campaignRoles,
            campaignMembers: action.payload.data.campaignMembers,
            campaignGuarantees: action.payload.data.campaignGuarantees,
            campaignGuaranteeGroups: action.payload.data.campaignGuaranteeGroups,
            campaignAttendees: action.payload.data.campaignAttendees,
            campaignNotifications: action.payload.data.campaignNotifications,

            electionDetails: action.payload.data.electionDetails,
            campaignElectionCandidates: action.payload.data.campaignElectionCandidates,
            electionCommitteeSites: action.payload.data.electionCommitteeSites,

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
        case GET_ALL_CAMPAIGN_GUARANTEE_GROUPS:
          return {
            ...state,
            campaignGuaranteeGroups: action.payload.data,
            isCampaignGuaranteeGroupCreated: false,
            isCampaignGuaranteeGroupSuccess: true,
          };
        case GET_CAMPAIGN_ATTENDEES:
          return {
            ...state,
            campaignAttendees: action.payload.data.voters,
            isCampaignAttendeeCreated: false,
            isCampaignAttendeeSuccess: true,
          };
        case GET_ALL_CAMPAIGN_SORTING:
          return {
            ...state,
            campaignSorting: action.payload.data,
            isCampaignCreated: false,
            isCampaignSuccess: true,
          };
          
        case ADD_CAMPAIGN:
          return {
            ...state,
            isCampaignCreated: true,
            campaigns: [...state.campaigns, action.payload.data],
            isCampaignAdd: true,
            isCampaignAddFail: false,
          };
          
        default:
          return { ...state };
      }


    // API RESPONSE ERROR

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
          // console.log("GET_CAMPAIGN_DETAILS ERROR LOGGING Payload:", action.payload); // Log the payload

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
        case GET_ALL_CAMPAIGN_GUARANTEE_GROUPS: {
          return {
            ...state,
            error: action.payload.error,
            isCampaignGuaranteeGroupCreated: false,
            isCampaignGuaranteeGroupSuccess: true,
          };
        }
        case GET_CAMPAIGN_ATTENDEES: {
          return {
            ...state,
            error: action.payload.error,
            isCampaignAttendeeCreated: false,
            isCampaignAttendeeSuccess: true,
          };
        }
        case GET_ALL_CAMPAIGN_SORTING:
          return {
            ...state,
            error: action.payload.error,
            isCampaignCreated: false,
            isCampaignSuccess: true,
          };
        case ADD_CAMPAIGN:
          return {
            ...state,
            error: action.payload,
            isCampaignAdd: false,
            isCampaignAddFail: true,
          };
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


    case UPDATE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        campaigns: state.campaigns.map((campaign) =>
          campaign.id.toString() === action.payload.data.id.toString()
            ? { ...campaign, ...action.payload.data }
            : campaign
        ),
        campaignDetails: state.campaignDetails.id.toString() === action.payload.data.id.toString()
          ? { ...state.campaignDetails, ...action.payload.data }
          : state.campaignDetails,
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

    case ADD_CAMPAIGN_MEMBER_SUCCESS:
      return {
        ...state,
        isCampaignMemberCreated: true,
        campaignMembers: [...state.campaignMembers, action.payload.data],
        isCampaignMemberAdd: true,
        isCampaignMemberAddFail: false,
      };

    case ADD_CAMPAIGN_MEMBER_FAIL:
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

    // Campaign Guarantees
    case GET_ALL_CAMPAIGN_GUARANTEES: {
      return {
        ...state,
        error: action.payload.error,
        isCampaignGuaranteeCreated: false,
        isCampaignGuaranteeSuccess: true,
      };
    }

    case ADD_CAMPAIGN_GUARANTEE_SUCCESS:
      return {
        ...state,
        isCampaignGuaranteeCreated: true,
        campaignGuarantees: [...state.campaignGuarantees, action.payload.data],
        isCampaignGuaranteeAdd: true,
        isCampaignGuaranteeAddFail: false,
      };

    case ADD_CAMPAIGN_GUARANTEE_FAIL:
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

    // Campaign GuaranteeGroups
    case GET_ALL_CAMPAIGN_GUARANTEE_GROUPS: {
      return {
        ...state,
        error: action.payload.error,
        isCampaignGuaranteeGroupCreated: false,
        isCampaignGuaranteeGroupSuccess: true,
      };
    }

    case ADD_CAMPAIGN_GUARANTEE_GROUP_SUCCESS:
      return {
        ...state,
        isCampaignGuaranteeGroupCreated: true,
        campaignGuaranteeGroups: [...state.campaignGuaranteeGroups, action.payload.data],
        isCampaignGuaranteeGroupAdd: true,
        isCampaignGuaranteeGroupAddFail: false,
      };

    case ADD_CAMPAIGN_GUARANTEE_GROUP_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignGuaranteeGroupAdd: false,
        isCampaignGuaranteeGroupAddFail: true,
      };
    case UPDATE_CAMPAIGN_GUARANTEE_GROUP_SUCCESS:
      return {
        ...state,
        campaignGuaranteeGroups: state.campaignGuaranteeGroups.map((campaignGuaranteeGroup) =>
          campaignGuaranteeGroup.id.toString() === action.payload.data.id.toString()
            ? { ...campaignGuaranteeGroup, ...action.payload.data }
            : campaignGuaranteeGroup
        ),
        isCampaignGuaranteeGroupUpdate: true,
        isCampaignGuaranteeGroupUpdateFail: false,
      };
    case UPDATE_CAMPAIGN_GUARANTEE_GROUP_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignGuaranteeGroupUpdate: false,
        isCampaignGuaranteeGroupUpdateFail: true,
      };
    case DELETE_CAMPAIGN_GUARANTEE_GROUP_SUCCESS:
      return {
        ...state,
        campaignGuaranteeGroups: state.campaignGuaranteeGroups.filter(
          (campaignGuaranteeGroup) =>
            campaignGuaranteeGroup.id.toString() !==
            action.payload.campaignGuaranteeGroup.toString()
        ),
        isCampaignGuaranteeGroupDelete: true,
        isCampaignGuaranteeGroupDeleteFail: false,
      };
    case DELETE_CAMPAIGN_GUARANTEE_GROUP_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignGuaranteeGroupDelete: false,
        isCampaignGuaranteeGroupDeleteFail: true,
      };

    // Campaign Attendees
    case GET_CAMPAIGN_ATTENDEES: {
      return {
        ...state,
        error: action.payload.error,
        isCampaignAttendeeCreated: false,
        isCampaignAttendeeSuccess: true,
      };
    }

    case ADD_CAMPAIGN_ATTENDEE_SUCCESS:
      return {
        ...state,
        isCampaignAttendeeCreated: true,
        campaignAttendees: [...state.campaignAttendees, action.payload.data],
        isCampaignAttendeeAdd: true,
        isCampaignAttendeeAddFail: false,
      };

    case ADD_CAMPAIGN_ATTENDEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignAttendeeAdd: false,
        isCampaignAttendeeAddFail: true,
      };
    case UPDATE_CAMPAIGN_ATTENDEE_SUCCESS:
      return {
        ...state,
        campaignAttendees: state.campaignAttendees.map((campaignAttendee) =>
          campaignAttendee.id.toString() === action.payload.data.id.toString()
            ? { ...campaignAttendee, ...action.payload.data }
            : campaignAttendee
        ),
        isCampaignAttendeeUpdate: true,
        isCampaignAttendeeUpdateFail: false,
      };
    case UPDATE_CAMPAIGN_ATTENDEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignAttendeeUpdate: false,
        isCampaignAttendeeUpdateFail: true,
      };
    case DELETE_CAMPAIGN_ATTENDEE_SUCCESS:
      return {
        ...state,
        campaignAttendees: state.campaignAttendees.filter(
          (campaignAttendee) =>
            campaignAttendee.id.toString() !==
            action.payload.campaignAttendee.toString()
        ),
        isCampaignAttendeeDelete: true,
        isCampaignAttendeeDeleteFail: false,
      };
    case DELETE_CAMPAIGN_ATTENDEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCampaignAttendeeDelete: false,
        isCampaignAttendeeDeleteFail: true,
      };
    case GET_ALL_CAMPAIGN_SORTING: {
      return {
        ...state,
        isCampaignCreated: false,
      };
    }

    default:
      return { ...state };
  }
};

export default Campaigns;

import {
  // Campaign Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Campaigns ------------
  GET_CAMPAIGNS,
  GET_CAMPAIGN_DETAILS,
<<<<<<< HEAD
  ADD_NEW_CAMPAIGN_SUCCESS,
  ADD_NEW_CAMPAIGN_FAIL,
=======
  ADD_CAMPAIGN,
  ADD_CAMPAIGN_SUCCESS,
  ADD_CAMPAIGN_FAIL,
>>>>>>> sanad
  UPDATE_CAMPAIGN_SUCCESS,
  UPDATE_CAMPAIGN_FAIL,
  DELETE_CAMPAIGN_SUCCESS,
  DELETE_CAMPAIGN_FAIL,

  // Campaign Members
  GET_ALL_CAMPAIGN_MEMBERS,
<<<<<<< HEAD
  ADD_NEW_CAMPAIGN_MEMBER_SUCCESS,
  ADD_NEW_CAMPAIGN_MEMBER_FAIL,
=======
  ADD_CAMPAIGN_MEMBER_SUCCESS,
  ADD_CAMPAIGN_MEMBER_FAIL,
>>>>>>> sanad
  UPDATE_CAMPAIGN_MEMBER_SUCCESS,
  UPDATE_CAMPAIGN_MEMBER_FAIL,
  DELETE_CAMPAIGN_MEMBER_SUCCESS,
  DELETE_CAMPAIGN_MEMBER_FAIL,

  // Campaign Guarantees
  GET_ALL_CAMPAIGN_GUARANTEES,
<<<<<<< HEAD
  ADD_NEW_CAMPAIGN_GUARANTEE_SUCCESS,
  ADD_NEW_CAMPAIGN_GUARANTEE_FAIL,
=======
  ADD_CAMPAIGN_GUARANTEE_SUCCESS,
  ADD_CAMPAIGN_GUARANTEE_FAIL,
>>>>>>> sanad
  UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  UPDATE_CAMPAIGN_GUARANTEE_FAIL,
  DELETE_CAMPAIGN_GUARANTEE_SUCCESS,
  DELETE_CAMPAIGN_GUARANTEE_FAIL,

<<<<<<< HEAD
  // Campaign Attendees
  GET_CAMPAIGN_ATTENDEES,
  ADD_NEW_CAMPAIGN_ATTENDEE_SUCCESS,
  ADD_NEW_CAMPAIGN_ATTENDEE_FAIL,
=======
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
>>>>>>> sanad
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
<<<<<<< HEAD
  campaignDetails: [],
  campaignGuarantees: [],
=======
  currentElection: [],
  previousElection: [],
  campaignDetails: [],
  campaignMembers: [],
  campaignGuarantees: [],
  campaignGuaranteeGroups: [],
>>>>>>> sanad
  campaignAttendees: [],
  campaignSorting: [],
  campaignNotifications: [],

  campaignElectionCandidates: [],
<<<<<<< HEAD
  campaignElectionCommittees: [],
=======
  electionCommitteeSites: [],
>>>>>>> sanad
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
<<<<<<< HEAD

=======
>>>>>>> sanad
            campaignDetails: action.payload.data.campaignDetails,
            campaignRoles: action.payload.data.campaignRoles,
            campaignMembers: action.payload.data.campaignMembers,
            campaignGuarantees: action.payload.data.campaignGuarantees,
<<<<<<< HEAD
            campaignAttendees: action.payload.data.campaignAttendees,
            campaignNotifications: action.payload.data.campaignNotifications,
            campaignElectionCandidates: action.payload.data.campaignElectionCandidates,
            campaignElectionCommittees: action.payload.data.campaignElectionCommittees,
=======
            campaignGuaranteeGroups: action.payload.data.campaignGuaranteeGroups,
            campaignAttendees: action.payload.data.campaignAttendees,
            campaignNotifications: action.payload.data.campaignNotifications,

            currentElection: action.payload.data.currentElection,
            previousElection: action.payload.data.previousElection,
            campaignElectionCandidates: action.payload.data.campaignElectionCandidates,
            electionCommitteeSites: action.payload.data.electionCommitteeSites,
>>>>>>> sanad

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
<<<<<<< HEAD
        case GET_CAMPAIGN_ATTENDEES:
          return {
            ...state,
            campaignAttendees: action.payload.data.electors,
=======
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
>>>>>>> sanad
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

<<<<<<< HEAD
=======
        case ADD_CAMPAIGN:
          return {
            ...state,
            isCampaignCreated: true,
            campaigns: [...state.campaigns, action.payload.data],
            isCampaignAdd: true,
            isCampaignAddFail: false,
          };

>>>>>>> sanad
        default:
          return { ...state };
      }

<<<<<<< HEAD
=======

    // API RESPONSE ERROR

>>>>>>> sanad
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
<<<<<<< HEAD
=======
        case GET_ALL_CAMPAIGN_GUARANTEE_GROUPS: {
          return {
            ...state,
            error: action.payload.error,
            isCampaignGuaranteeGroupCreated: false,
            isCampaignGuaranteeGroupSuccess: true,
          };
        }
>>>>>>> sanad
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
<<<<<<< HEAD

=======
        case ADD_CAMPAIGN:
          return {
            ...state,
            error: action.payload,
            isCampaignAdd: false,
            isCampaignAddFail: true,
          };
>>>>>>> sanad
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
<<<<<<< HEAD
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
=======


>>>>>>> sanad
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
<<<<<<< HEAD
            campaign.id.toString() !== action.payload.campaign.toString()
=======
            campaign.id.toString() !== action.payload.campaign.id.toString()
>>>>>>> sanad
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

<<<<<<< HEAD
    case ADD_NEW_CAMPAIGN_MEMBER_SUCCESS:
=======
    case ADD_CAMPAIGN_MEMBER_SUCCESS:
>>>>>>> sanad
      return {
        ...state,
        isCampaignMemberCreated: true,
        campaignMembers: [...state.campaignMembers, action.payload.data],
        isCampaignMemberAdd: true,
        isCampaignMemberAddFail: false,
      };

<<<<<<< HEAD
    case ADD_NEW_CAMPAIGN_MEMBER_FAIL:
=======
    case ADD_CAMPAIGN_MEMBER_FAIL:
>>>>>>> sanad
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
<<<<<<< HEAD
=======
      console.log("action.payload.campaignMember: ", action.payload.campaignMember)
>>>>>>> sanad
      return {
        ...state,
        campaignMembers: state.campaignMembers.filter(
          (campaignMember) =>
            campaignMember.id.toString() !==
<<<<<<< HEAD
            action.payload.campaignMember.toString()
=======
            action.payload.campaignMember.id.toString()
>>>>>>> sanad
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

<<<<<<< HEAD
    // Campaign Candidates
=======
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


    case UPDATE_CAMPAIGN_GUARANTEE_GROUP_SUCCESS: {
      const campaignGuaranteeData = action.payload.data.guarantees;

      const updatedCampaignGuaranteeGroups = state.campaignGuaranteeGroups.map((campaignGuaranteeGroup) =>
        campaignGuaranteeGroup.id.toString() === action.payload.data.id.toString()
          ? { ...campaignGuaranteeGroup, ...action.payload.data }
          : campaignGuaranteeGroup
      );

      const updatedCampaignGuarantees = state.campaignGuarantees.map((campaignGuarantee) => {
        const updatedGuarantee = campaignGuaranteeData.find(
          (guarantee) => guarantee.id.toString() === campaignGuarantee.id.toString()
        );
        return updatedGuarantee ? { ...campaignGuarantee, ...updatedGuarantee } : campaignGuarantee;
      });

      return {
        ...state,
        campaignGuaranteeGroups: updatedCampaignGuaranteeGroups,
        campaignGuarantees: updatedCampaignGuarantees,
        isCampaignGuaranteeGroupUpdate: true,
        isCampaignGuaranteeGroupUpdateFail: false,
      };
    }


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
            action.payload.campaignGuaranteeGroup.id.toString()
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

    // Campaign Guarantees
>>>>>>> sanad
    case GET_ALL_CAMPAIGN_GUARANTEES: {
      return {
        ...state,
        error: action.payload.error,
        isCampaignGuaranteeCreated: false,
        isCampaignGuaranteeSuccess: true,
      };
    }

<<<<<<< HEAD
    case ADD_NEW_CAMPAIGN_GUARANTEE_SUCCESS:
=======
    case ADD_CAMPAIGN_GUARANTEE_SUCCESS:
>>>>>>> sanad
      return {
        ...state,
        isCampaignGuaranteeCreated: true,
        campaignGuarantees: [...state.campaignGuarantees, action.payload.data],
        isCampaignGuaranteeAdd: true,
        isCampaignGuaranteeAddFail: false,
      };

<<<<<<< HEAD
    case ADD_NEW_CAMPAIGN_GUARANTEE_FAIL:
=======
    case ADD_CAMPAIGN_GUARANTEE_FAIL:
>>>>>>> sanad
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
<<<<<<< HEAD
            action.payload.campaignGuarantee.toString()
=======
            action.payload.campaignGuarantee.id.toString()
>>>>>>> sanad
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
<<<<<<< HEAD
=======

>>>>>>> sanad
    // Campaign Attendees
    case GET_CAMPAIGN_ATTENDEES: {
      return {
        ...state,
        error: action.payload.error,
        isCampaignAttendeeCreated: false,
        isCampaignAttendeeSuccess: true,
      };
    }

<<<<<<< HEAD
    case ADD_NEW_CAMPAIGN_ATTENDEE_SUCCESS:
=======
    case ADD_CAMPAIGN_ATTENDEE_SUCCESS:
>>>>>>> sanad
      return {
        ...state,
        isCampaignAttendeeCreated: true,
        campaignAttendees: [...state.campaignAttendees, action.payload.data],
<<<<<<< HEAD
=======
        campaignGuarantees: state.campaignGuarantees.map((campaignGuarantee) =>
          campaignGuarantee.elector.toString() === action.payload.data.elector.toString()
            ? { ...campaignGuarantee, ...action.payload.data.attended }
            : campaignGuarantee
        ),

>>>>>>> sanad
        isCampaignAttendeeAdd: true,
        isCampaignAttendeeAddFail: false,
      };

<<<<<<< HEAD
    case ADD_NEW_CAMPAIGN_ATTENDEE_FAIL:
=======
    case ADD_CAMPAIGN_ATTENDEE_FAIL:
>>>>>>> sanad
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
<<<<<<< HEAD
            action.payload.campaignAttendee.toString()
=======
            action.payload.campaignAttendee.id.toString()
>>>>>>> sanad
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

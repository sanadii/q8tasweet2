import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Campaigns
  GET_CAMPAIGNS,
  ADD_NEW_CAMPAIGN,
  ADD_NEW_CAMPAIGN_SUCCESS,
  ADD_NEW_CAMPAIGN_FAIL,
  UPDATE_CAMPAIGN,
  UPDATE_CAMPAIGN_SUCCESS,
  UPDATE_CAMPAIGN_FAIL,
  DELETE_CAMPAIGN,
  DELETE_CAMPAIGN_SUCCESS,
  DELETE_CAMPAIGN_FAIL,

  // Campaign Details
  GET_CAMPAIGN_COUNT,
  GET_CAMPAIGN_DETAILS,

  // CampaignMembers
  GET_ALL_CAMPAIGN_MEMBERS,
  ADD_NEW_CAMPAIGN_MEMBER,
  ADD_NEW_CAMPAIGN_MEMBER_SUCCESS,
  ADD_NEW_CAMPAIGN_MEMBER_FAIL,
  UPDATE_CAMPAIGN_MEMBER,
  UPDATE_CAMPAIGN_MEMBER_SUCCESS,
  UPDATE_CAMPAIGN_MEMBER_FAIL,
  DELETE_CAMPAIGN_MEMBER,
  DELETE_CAMPAIGN_MEMBER_SUCCESS,
  DELETE_CAMPAIGN_MEMBER_FAIL,

  // CampaignGuarantees
  GET_ALL_CAMPAIGN_GUARANTEES,
  ADD_NEW_CAMPAIGN_GUARANTEE,
  ADD_NEW_CAMPAIGN_GUARANTEE_SUCCESS,
  ADD_NEW_CAMPAIGN_GUARANTEE_FAIL,
  UPDATE_CAMPAIGN_GUARANTEE,
  UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  UPDATE_CAMPAIGN_GUARANTEE_FAIL,
  DELETE_CAMPAIGN_GUARANTEE,
  DELETE_CAMPAIGN_GUARANTEE_SUCCESS,
  DELETE_CAMPAIGN_GUARANTEE_FAIL,

  // ElectionAttendees
  GET_ELECTION_ATTENDEES,
  ADD_NEW_ELECTION_ATTENDEE,
  ADD_NEW_ELECTION_ATTENDEE_SUCCESS,
  ADD_NEW_ELECTION_ATTENDEE_FAIL,
  UPDATE_ELECTION_ATTENDEE,
  UPDATE_ELECTION_ATTENDEE_SUCCESS,
  UPDATE_ELECTION_ATTENDEE_FAIL,
  DELETE_ELECTION_ATTENDEE,
  DELETE_ELECTION_ATTENDEE_SUCCESS,
  DELETE_ELECTION_ATTENDEE_FAIL,
} from "./actionType";

// Campaign Success / Error
export const CampaignApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const CampaignApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Get Campaigns
export const getCampaigns = () => ({
  type: GET_CAMPAIGNS,
});

export const getCampaignCount = () => ({
  type: GET_CAMPAIGN_COUNT,
});

// Campaign Details
export const getCampaignDetails = (campaign) => ({
  type: GET_CAMPAIGN_DETAILS,
  payload: campaign,
});



// Campaign Members
export const getAllCampaignMembers = (campaign) => ({
  type: GET_ALL_CAMPAIGN_MEMBERS,
  payload: campaign,
});

// Update Campaign
export const updateCampaign = (campaign) => ({
  type: UPDATE_CAMPAIGN,
  payload: campaign,
});

export const updateCampaignSuccess = (campaign) => ({
  type: UPDATE_CAMPAIGN_SUCCESS,
  payload: campaign,
});

export const updateCampaignFail = (error) => ({
  type: UPDATE_CAMPAIGN_FAIL,
  payload: error,
});

// Add Campaign
export const addNewCampaign = (campaign) => ({
  type: ADD_NEW_CAMPAIGN,
  payload: campaign,
});

export const addNewCampaignSuccess = (campaign) => ({
  type: ADD_NEW_CAMPAIGN_SUCCESS,
  payload: campaign,
});

export const addNewCampaignFail = (error) => ({
  type: ADD_NEW_CAMPAIGN_FAIL,
  payload: error,
});

// Delete Campaign
export const deleteCampaign = (campaign) => ({
  type: DELETE_CAMPAIGN,
  payload: campaign,
});

export const deleteCampaignSuccess = (campaign) => ({
  type: DELETE_CAMPAIGN_SUCCESS,
  payload: campaign,
});

export const deleteCampaignFail = (error) => ({
  type: DELETE_CAMPAIGN_FAIL,
  payload: error,
});

// // Campaign Members
export const updateCampaignMember = (campaignMember) => ({
  type: UPDATE_CAMPAIGN_MEMBER,
  payload: campaignMember,
});
export const updateCampaignMemberSuccess = (campaignMember) => ({
  type: UPDATE_CAMPAIGN_MEMBER_SUCCESS,
  payload: campaignMember,
});
export const updateCampaignMemberFail = (error) => ({
  type: UPDATE_CAMPAIGN_MEMBER_FAIL,
  payload: error,
});

export const addNewCampaignMember = (campaignMember) => ({
  type: ADD_NEW_CAMPAIGN_MEMBER,
  payload: campaignMember,
});

export const addNewCampaignMemberSuccess = (campaignMember) => ({
  type: ADD_NEW_CAMPAIGN_MEMBER_SUCCESS,
  payload: campaignMember,
});

export const addNewCampaignMemberFail = (error) => ({
  type: ADD_NEW_CAMPAIGN_MEMBER_FAIL,
  payload: error,
});

export const deleteCampaignMember = (campaignMember) => ({
  type: DELETE_CAMPAIGN_MEMBER,
  payload: campaignMember,
});

export const deleteCampaignMemberSuccess = (campaignMember) => ({
  type: DELETE_CAMPAIGN_MEMBER_SUCCESS,
  payload: campaignMember,
});

export const deleteCampaignMemberFail = (error) => ({
  type: DELETE_CAMPAIGN_MEMBER_FAIL,
  payload: error,
});


// CampaignGuarantees
export const updateCampaignGuarantee = (campaignGuarantee) => ({
  type: UPDATE_CAMPAIGN_GUARANTEE,
  payload: campaignGuarantee,
});
export const updateCampaignGuaranteeSuccess = (campaignGuarantee) => ({
  type: UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  payload: campaignGuarantee,
});
export const updateCampaignGuaranteeFail = (error) => ({
  type: UPDATE_CAMPAIGN_GUARANTEE_FAIL,
  payload: error,
});

export const addNewCampaignGuarantee = (campaignGuarantee) => ({
  type: ADD_NEW_CAMPAIGN_GUARANTEE,
  payload: campaignGuarantee,
});

export const addNewCampaignGuaranteeSuccess = (campaignGuarantee) => ({
  type: ADD_NEW_CAMPAIGN_GUARANTEE_SUCCESS,
  payload: campaignGuarantee,
});

export const addNewCampaignGuaranteeFail = (error) => ({
  type: ADD_NEW_CAMPAIGN_GUARANTEE_FAIL,
  payload: error,
});

export const deleteCampaignGuarantee = (campaignGuarantee) => ({
  type: DELETE_CAMPAIGN_GUARANTEE,
  payload: campaignGuarantee,
});

export const deleteCampaignGuaranteeSuccess = (campaignGuarantee) => ({
  type: DELETE_CAMPAIGN_GUARANTEE_SUCCESS,
  payload: campaignGuarantee,
});

export const deleteCampaignGuaranteeFail = (error) => ({
  type: DELETE_CAMPAIGN_GUARANTEE_FAIL,
  payload: error,
});



// ----------- Attendeees -------------
// ElectionAttendees
export const updateElectionAttendee = (electionAttendee) => ({
  type: UPDATE_ELECTION_ATTENDEE,
  payload: electionAttendee,
});
export const updateElectionAttendeeSuccess = (electionAttendee) => ({
  type: UPDATE_ELECTION_ATTENDEE_SUCCESS,
  payload: electionAttendee,
});
export const updateElectionAttendeeFail = (error) => ({
  type: UPDATE_ELECTION_ATTENDEE_FAIL,
  payload: error,
});

export const addNewElectionAttendee = (electionAttendee) => ({
  type: ADD_NEW_ELECTION_ATTENDEE,
  payload: electionAttendee,
});

export const addNewElectionAttendeeSuccess = (electionAttendee) => ({
  type: ADD_NEW_ELECTION_ATTENDEE_SUCCESS,
  payload: electionAttendee,
});

export const addNewElectionAttendeeFail = (error) => ({
  type: ADD_NEW_ELECTION_ATTENDEE_FAIL,
  payload: error,
});

export const deleteElectionAttendee = (electionAttendee) => ({
  type: DELETE_ELECTION_ATTENDEE,
  payload: electionAttendee,
});

export const deleteElectionAttendeeSuccess = (electionAttendee) => ({
  type: DELETE_ELECTION_ATTENDEE_SUCCESS,
  payload: electionAttendee,
});

export const deleteElectionAttendeeFail = (error) => ({
  type: DELETE_ELECTION_ATTENDEE_FAIL,
  payload: error,
});

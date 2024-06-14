import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Campaigns
  GET_CAMPAIGNS,
<<<<<<< HEAD
  ADD_NEW_CAMPAIGN,
  ADD_NEW_CAMPAIGN_SUCCESS,
  ADD_NEW_CAMPAIGN_FAIL,
=======
  ADD_CAMPAIGN,
  ADD_CAMPAIGN_SUCCESS,
  ADD_CAMPAIGN_FAIL,
>>>>>>> sanad
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
<<<<<<< HEAD
  ADD_NEW_CAMPAIGN_MEMBER,
  ADD_NEW_CAMPAIGN_MEMBER_SUCCESS,
  ADD_NEW_CAMPAIGN_MEMBER_FAIL,
=======
  ADD_CAMPAIGN_MEMBER,
  ADD_CAMPAIGN_MEMBER_SUCCESS,
  ADD_CAMPAIGN_MEMBER_FAIL,
>>>>>>> sanad
  UPDATE_CAMPAIGN_MEMBER,
  UPDATE_CAMPAIGN_MEMBER_SUCCESS,
  UPDATE_CAMPAIGN_MEMBER_FAIL,
  DELETE_CAMPAIGN_MEMBER,
  DELETE_CAMPAIGN_MEMBER_SUCCESS,
  DELETE_CAMPAIGN_MEMBER_FAIL,

  // CampaignGuarantees
<<<<<<< HEAD
  ADD_NEW_CAMPAIGN_GUARANTEE,
  ADD_NEW_CAMPAIGN_GUARANTEE_SUCCESS,
  ADD_NEW_CAMPAIGN_GUARANTEE_FAIL,
=======
  ADD_CAMPAIGN_GUARANTEE,
  ADD_CAMPAIGN_GUARANTEE_SUCCESS,
  ADD_CAMPAIGN_GUARANTEE_FAIL,
>>>>>>> sanad
  UPDATE_CAMPAIGN_GUARANTEE,
  UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  UPDATE_CAMPAIGN_GUARANTEE_FAIL,
  DELETE_CAMPAIGN_GUARANTEE,
  DELETE_CAMPAIGN_GUARANTEE_SUCCESS,
  DELETE_CAMPAIGN_GUARANTEE_FAIL,

<<<<<<< HEAD
  // CampaignAttendees
  ADD_NEW_CAMPAIGN_ATTENDEE,
  ADD_NEW_CAMPAIGN_ATTENDEE_SUCCESS,
  ADD_NEW_CAMPAIGN_ATTENDEE_FAIL,
=======
  // CampaignGuarantees
  GET_CAMPAIGN_GUARANTEE_GROUPS,
  ADD_CAMPAIGN_GUARANTEE_GROUP,
  ADD_CAMPAIGN_GUARANTEE_GROUP_SUCCESS,
  ADD_CAMPAIGN_GUARANTEE_GROUP_FAIL,
  UPDATE_CAMPAIGN_GUARANTEE_GROUP,
  UPDATE_CAMPAIGN_GUARANTEE_GROUP_SUCCESS,
  UPDATE_CAMPAIGN_GUARANTEE_GROUP_FAIL,
  DELETE_CAMPAIGN_GUARANTEE_GROUP,
  DELETE_CAMPAIGN_GUARANTEE_GROUP_SUCCESS,
  DELETE_CAMPAIGN_GUARANTEE_GROUP_FAIL,

  // CampaignAttendees
  ADD_CAMPAIGN_ATTENDEE,
  ADD_CAMPAIGN_ATTENDEE_SUCCESS,
  ADD_CAMPAIGN_ATTENDEE_FAIL,
>>>>>>> sanad
  UPDATE_CAMPAIGN_ATTENDEE,
  UPDATE_CAMPAIGN_ATTENDEE_SUCCESS,
  UPDATE_CAMPAIGN_ATTENDEE_FAIL,
  DELETE_CAMPAIGN_ATTENDEE,
  DELETE_CAMPAIGN_ATTENDEE_SUCCESS,
  DELETE_CAMPAIGN_ATTENDEE_FAIL,

  // Campaign Sorting
  GET_ALL_CAMPAIGN_SORTING,
  GET_CAMPAIGN_COMMITTEE_SORTING,
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
<<<<<<< HEAD
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
=======
export const addCampaign = campaign => ({
  type: ADD_CAMPAIGN,
  payload: campaign,
});

export const addCampaignSuccess = campaign => ({
  type: ADD_CAMPAIGN_SUCCESS,
  payload: campaign,
});

export const addCampaignFail = (error) => ({
  type: ADD_CAMPAIGN_FAIL,
>>>>>>> sanad
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
<<<<<<< HEAD
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
=======
export const addCampaignMember = (campaignMember) => ({
  type: ADD_CAMPAIGN_MEMBER,
  payload: campaignMember,
});

export const addCampaignMemberSuccess = (campaignMember) => ({
  type: ADD_CAMPAIGN_MEMBER_SUCCESS,
  payload: campaignMember,
});

export const addCampaignMemberFail = (error) => ({
  type: ADD_CAMPAIGN_MEMBER_FAIL,
>>>>>>> sanad
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

// CampaignGuarantees
<<<<<<< HEAD
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


=======
export const addCampaignGuarantee = (campaignGuarantee) => ({
  type: ADD_CAMPAIGN_GUARANTEE,
  payload: campaignGuarantee,
});

export const addCampaignGuaranteeSuccess = (campaignGuarantee) => ({
  type: ADD_CAMPAIGN_GUARANTEE_SUCCESS,
  payload: campaignGuarantee,
});

export const addCampaignGuaranteeFail = (error) => ({
  type: ADD_CAMPAIGN_GUARANTEE_FAIL,
  payload: error,
});

>>>>>>> sanad
export const updateCampaignGuarantee = (campaignGuarantee) => ({
  type: UPDATE_CAMPAIGN_GUARANTEE,
  payload: campaignGuarantee
});
export const updateCampaignGuaranteeSuccess = (campaignGuarantee) => ({
  type: UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  payload: campaignGuarantee
});
export const updateCampaignGuaranteeFail = (error) => ({
  type: UPDATE_CAMPAIGN_GUARANTEE_FAIL,
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

<<<<<<< HEAD
=======
// CampaignGuaranteeGroups
export const addCampaignGuaranteeGroup = (campaignGuaranteeGroup) => ({
  type: ADD_CAMPAIGN_GUARANTEE_GROUP,
  payload: campaignGuaranteeGroup,
});

export const addCampaignGuaranteeGroupSuccess = (campaignGuaranteeGroup) => ({
  type: ADD_CAMPAIGN_GUARANTEE_GROUP_SUCCESS,
  payload: campaignGuaranteeGroup,
});

export const addCampaignGuaranteeGroupFail = (error) => ({
  type: ADD_CAMPAIGN_GUARANTEE_GROUP_FAIL,
  payload: error,
});

export const updateCampaignGuaranteeGroup = (campaignGuaranteeGroup) => ({
  type: UPDATE_CAMPAIGN_GUARANTEE_GROUP,
  payload: campaignGuaranteeGroup
});
export const updateCampaignGuaranteeGroupSuccess = (campaignGuaranteeGroup) => ({
  type: UPDATE_CAMPAIGN_GUARANTEE_GROUP_SUCCESS,
  payload: campaignGuaranteeGroup
});
export const updateCampaignGuaranteeGroupFail = (error) => ({
  type: UPDATE_CAMPAIGN_GUARANTEE_GROUP_FAIL,
  payload: error,
});

export const deleteCampaignGuaranteeGroup = (campaignGuaranteeGroup) => ({
  type: DELETE_CAMPAIGN_GUARANTEE_GROUP,
  payload: campaignGuaranteeGroup,
});

export const deleteCampaignGuaranteeGroupSuccess = (campaignGuaranteeGroup) => ({
  type: DELETE_CAMPAIGN_GUARANTEE_GROUP_SUCCESS,
  payload: campaignGuaranteeGroup,
});

export const deleteCampaignGuaranteeGroupFail = (error) => ({
  type: DELETE_CAMPAIGN_GUARANTEE_GROUP_FAIL,
  payload: error,
});

>>>>>>> sanad


// ----------- Attendeees -------------
// CampaignAttendees
<<<<<<< HEAD
export const addNewCampaignAttendee = (campaignAttendee) => ({
  type: ADD_NEW_CAMPAIGN_ATTENDEE,
  payload: campaignAttendee,
});

export const addNewCampaignAttendeeSuccess = (campaignAttendee) => ({
  type: ADD_NEW_CAMPAIGN_ATTENDEE_SUCCESS,
  payload: campaignAttendee,
});

export const addNewCampaignAttendeeFail = (error) => ({
  type: ADD_NEW_CAMPAIGN_ATTENDEE_FAIL,
=======
export const addCampaignAttendee = (campaignAttendee) => ({
  type: ADD_CAMPAIGN_ATTENDEE,
  payload: campaignAttendee,
});

export const addCampaignAttendeeSuccess = (campaignAttendee) => ({
  type: ADD_CAMPAIGN_ATTENDEE_SUCCESS,
  payload: campaignAttendee,
});

export const addCampaignAttendeeFail = (error) => ({
  type: ADD_CAMPAIGN_ATTENDEE_FAIL,
>>>>>>> sanad
  payload: error,
});
export const updateCampaignAttendee = (campaignAttendee) => ({
  type: UPDATE_CAMPAIGN_ATTENDEE,
  payload: campaignAttendee,
});
export const updateCampaignAttendeeSuccess = (campaignAttendee) => ({
  type: UPDATE_CAMPAIGN_ATTENDEE_SUCCESS,
  payload: campaignAttendee,
});
export const updateCampaignAttendeeFail = (error) => ({
  type: UPDATE_CAMPAIGN_ATTENDEE_FAIL,
  payload: error,
});

export const deleteCampaignAttendee = (campaignAttendee) => ({
  type: DELETE_CAMPAIGN_ATTENDEE,
  payload: campaignAttendee,
});

export const deleteCampaignAttendeeSuccess = (campaignAttendee) => ({
  type: DELETE_CAMPAIGN_ATTENDEE_SUCCESS,
  payload: campaignAttendee,
});

export const deleteCampaignAttendeeFail = (error) => ({
  type: DELETE_CAMPAIGN_ATTENDEE_FAIL,
  payload: error,
});


// Campaign Sorting
// export const getAllCampaignSorting = () => ({
//   type: GET_ALL_CAMPAIGN_SORTING,
// });


export const getAllCampaignSorting = () => {
  // If you need a console log for debugging, you can uncomment the following line
  console.log("getAllCampaignAttendees: ACTION?")

  return {
    type: GET_ALL_CAMPAIGN_SORTING,
  };
};
export const getCampaignCommitteeSorting = (campaignCommittee) => ({
  type: GET_CAMPAIGN_COMMITTEE_SORTING,
  payload: campaignCommittee,
});



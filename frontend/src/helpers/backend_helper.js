import { APIClient } from "./api_helper";
import * as url from "./url_helper";
import axios from "axios";

const api = new APIClient();
// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Login Method
// export const postJwtLogin = data => api.create(url.POST_JWT_LOGIN, data);
export const postJwtLogin = data => api.create(url.POST_JWT_LOGIN, data);

// Register Method
export const postFakeRegister = (data) => api.create(url.POST_REGISTER, data);
export const postFakeLogin = (data) => api.create(url.POST_LOGIN, data);
export const postFakeForgetPwd = (data) => api.create(url.POST_PASSWORD_FORGET, data);
export const postJwtProfile = (data) => api.create(url.POST_EDIT_JWT_PROFILE, data);
export const postFakeProfile = (data) => api.update(url.POST_EDIT_PROFILE + "/" + data.idx, data);

// Register Method
export const postJwtRegister = (url, data) => {
  return api.create(url, data).catch((err) => {
    var message;
    if (err.response && err.response.status) {
      switch (err.response.status) {
        case 404:
          message = "Sorry! the page you are looking for could not be found";
          break;
        case 500:
          message =
            "Sorry! something went wrong, please contact our support team";
          break;
        case 401:
          message = "Invalid credentials";
          break;
        default:
          message = err[1];
          break;
      }
    }
    throw message;
  });
};

export const postJwtForgetPwd = (data) => api.create(url.POST_JWT_PASSWORD_FORGET, data);
export const postSocialLogin = (data) => api.create(url.SOCIAL_LOGIN, data);
export const postResetPassword = (data) => api.create(url.RESET_PASSWORD, data);

// Elections  //////////////////////////////
// export const getElections = () => api.get(url.GET_ELECTIONS);
export const getElections = (view) => {
  const params = new URLSearchParams();
  if (view) params.append('view', view);
  return api.get(`${url.GET_ELECTIONS}?${params.toString()}`);
};

export const getElectionDetails = (electionSlug, view) => {
  const params = new URLSearchParams();
  if (view) params.append('view', view);
  return api.get(`${url.GET_ELECTION_DETAILS}/${electionSlug}?${params.toString()}`);
};

export const addElection = (election) => api.create(url.ADD_ELECTION, election);
export const updateElection = (election) => api.update(url.UPDATE_ELECTION + "/" + election.id, election);
export const deleteElection = (election) => api.delete(url.DELETE_ELECTION + "/" + election);

// ElectionCandidates
export const getElectionCandidates = (electionCandidate) => api.get(url.GET_ELECTION_CANDIDATES + "/" + electionCandidate.id);
export const getElectionCandidateDetails = (electionCandidate) => api.get(url.GET_ELECTION_CANDIDATE_DETAILS + "/" + electionCandidate.id);
export const addNewElectionCandidate = (electionCandidate) => api.create(url.ADD_NEW_ELECTION_CANDIDATE, electionCandidate);
export const updateElectionCandidate = (electionCandidate) => api.update(url.UPDATE_ELECTION_CANDIDATE + "/" + electionCandidate.id, electionCandidate);
export const deleteElectionCandidate = (electionCandidate) => api.delete(url.DELETE_ELECTION_CANDIDATE + "/" + electionCandidate);
export const updateElectionCandidateVotes = (electionCandidateVotes) => api.update(url.UPDATE_ELECTION_CANDIDATE_VOTES + "/" + "votes", electionCandidateVotes);

// ElectionParty
export const getElectionParties = (electionParty) => api.get(url.GET_ELECTION_PARTIES + "/" + electionParty.id);
export const getElectionPartyDetails = (electionParty) => api.get(url.GET_ELECTION_PARTY_DETAILS + "/" + electionParty.id);
export const addElectionParty = (electionParty) => api.create(url.ADD_ELECTION_PARTY, electionParty);
export const updateElectionParty = (electionParty) => api.update(url.UPDATE_ELECTION_PARTY + "/" + electionParty.id, electionParty);
export const deleteElectionParty = (electionParty) => api.delete(url.DELETE_ELECTION_PARTY + "/" + electionParty);
export const updateElectionPartyResults = (electionPartyResults) => api.update(url.UPDATE_ELECTION_PARTY_RESULTS + "/" + electionPartyResults.id, electionPartyResults);


// ElectionPartyCandidates
export const getElectionPartyCandidates = (electionPartyCandidate) => api.get(url.GET_ELECTION_PARTY_CANDIDATES + "/" + electionPartyCandidate.id);
export const getElectionPartyCandidateDetails = (electionPartyCandidate) => api.get(url.GET_ELECTION_PARTY_CANDIDATE_DETAILS + "/" + electionPartyCandidate.id);
export const addElectionPartyCandidate = (electionPartyCandidate) => api.create(url.ADD_ELECTION_PARTY_CANDIDATE, electionPartyCandidate);
export const updateElectionPartyCandidate = (electionPartyCandidate) => api.update(url.UPDATE_ELECTION_PARTY_CANDIDATE + "/" + electionPartyCandidate.id, electionPartyCandidate);
export const deleteElectionPartyCandidate = (electionPartyCandidate) => api.delete(url.DELETE_ELECTION_PARTY_CANDIDATE + "/" + electionPartyCandidate);
export const updateElectionPartyCandidateVotes = (electionPartyCandidateVotes) => api.update(url.UPDATE_ELECTION_PARTY_CANDIDATE_VOTES + "/" + "votes", electionPartyCandidateVotes);


// ElectionCommittees
export const getElectionCommittees = (electionCommittee) => api.get(url.GET_ELECTION_COMMITTEES + "/" + electionCommittee.id);
export const getElectionCommitteeDetails = (electionCommittee) => api.get(url.GET_ELECTION_COMMITTEE_DETAILS + "/" + electionCommittee.id);
export const addNewElectionCommittee = (electionCommittee) => api.create(url.ADD_NEW_ELECTION_COMMITTEE, electionCommittee);
export const updateElectionCommittee = (electionCommittee) => api.update(url.UPDATE_ELECTION_COMMITTEE + "/" + electionCommittee.id, electionCommittee);
export const deleteElectionCommittee = (electionCommittee) => api.delete(url.DELETE_ELECTION_COMMITTEE + "/" + electionCommittee);

// ElectionCommittees
export const updateElectionResults = (electionResult) => api.update(url.UPDATE_ELECTION_RESULTS + "/" + electionResult.id, electionResult);

// ElectionCampaigns
export const getElectionCampaigns = (campaign) => api.get(url.GET_ELECTION_CAMPAIGNS + "/" + campaign.id);
export const getElectionCampaignDetails = (campaign) => api.get(url.GET_CAMPAIGN_DETAILS + "/" + campaign.id);
export const addNewElectionCampaign = (campaign) => api.create(url.ADD_CAMPAIGN, campaign);
export const updateElectionCampaign = (campaign) => api.update(url.UPDATE_CAMPAIGN + "/" + campaign.id, campaign);
export const deleteElectionCampaign = (campaign) => api.delete(url.DELETE_CAMPAIGN + "/" + campaign);

// ElectionAttendee
export const getAllElectionAttendees = (electionAttendee) => api.get(url.GET_ELECTION_ATTENDEES, electionAttendee);
export const deleteElectionAttendee = (electionAttendee) => api.delete(url.DELETE_ELECTION_ATTENDEE + "/" + electionAttendee);
export const addNewElectionAttendee = (electionAttendee) => api.create(url.ADD_NEW_ELECTION_ATTENDEE, electionAttendee);
export const updateElectionAttendee = (electionAttendee) => api.put(url.UPDATE_ELECTION_ATTENDEE, electionAttendee);

// ELECTION  SCHEMA
export const getElectionSchemas = (electionSlug) => api.get(url.GET_ELECTION_SCHEMAS + "/" + electionSlug);
export const getElectionSchemaDetails = (electionSlug) => api.get(url.GET_ELECTION_SCHEMA_DETAILS + "/" + electionSlug);
export const addElectionSchema = (electionSlug) => api.get(url.ADD_ELECTION_SCHEMA + "/" + electionSlug);
export const updateElectionSchema = (electionSlug) => api.update(url.UPDATE_ELECTION_SCHEMA + "/" + electionSlug);
export const deleteElectionSchema = (electionSlug) => api.delete(url.DELETE_ELECTION_SCHEMA + "/" + electionSlug);


// ELECTION STATISTICS
export const getElectors = (electionSlug) => api.get(url.GET_ELECTORS + "/" + electionSlug);
// export const getElectorsByCategory = (electorCategories) => api.get(url.GET_ELECTORS_BY_CATEGORY + "/" + electorCategories);

// export const getElectorsByCategory = ({ slug, families, areas }) => {
//   let queryString = `?`;

//   if (families.length > 0) {
//     queryString += `families=${families.join(',')}`;
//   }
//   // if (family !=="") {
//   //   queryString += `family=${family.join(',')}`;
//   // }
//   if (areas.length > 0) {
//     if (families.length > 0) queryString += '&';
//     queryString += `areas=${areas.join(',')}`;
//   }

//   return api.get(`${url.GET_ELECTORS_BY_CATEGORY}/${slug}/${queryString}`);
// };

export const addElector = (electionSlug) => api.get(url.ADD_ELECTOR + "/" + electionSlug);
export const updateElector = (electionSlug) => api.update(url.UPDATE_ELECTOR + "/" + electionSlug);
export const deleteElector = (electionSlug) => api.delete(url.DELETE_ELECTOR + "/" + electionSlug);
export const getElectorsByCategory = (electorData) => api.get(url.GET_ELECTORS_BY_CATEGORY, electorData);
export const getElectorsByAll = (electionSlug) => api.get(url.GET_ELECTOR_BY_ALL, electionSlug);
export const getElectorsBySearch = (elector) => api.create(url.GET_ELECTORS_BY_SEARCH, elector);
// export const addElection = (election) => api.create(url.ADD_ELECTION, election);

export const getElectorFamilyDivisions = (electorData) => api.get(url.GET_ELECTOR_FAMILY_DIVISIONS, electorData);


// // Voter
// export const getAllVoters = (voter) => api.get(url.GET_ALL_VOTERS, voter);
// export const getElectors = (voter) => api.get(url.GET_VOTERS, voter);
// export const deleteVoter = (voter) => api.delete(url.DELETE_VOTER + "/" + voter);
// export const addNewVoter = (voter) => api.create(url.ADD_NEW_VOTER, voter);
// export const updateVoter = (voter) => api.put(url.UPDATE_VOTER, voter);



// Candidates
export const getCandidates = () => api.get(url.GET_CANDIDATES);
export const getCandidateDetails = (candidate) => api.get(url.GET_CANDIDATE_DETAILS + "/" + candidate);
export const addNewCandidate = (candidate) => api.create(url.ADD_NEW_CANDIDATE, candidate);
export const updateCandidate = (candidate) => api.update(url.UPDATE_CANDIDATE + "/" + candidate.get('id'), candidate);
export const deleteCandidate = (candidate) => api.delete(url.DELETE_CANDIDATE + "/" + candidate);

// Parties
export const getParties = () => api.get(url.GET_PARTIES);
export const getPartyDetails = (party) => api.get(url.GET_PARTY_DETAILS + "/" + party);
export const addParty = (party) => api.create(url.ADD_PARTY, party);
export const updateParty = (party) => api.update(url.UPDATE_PARTY + "/" + party.get('id'), party);
export const deleteParty = (party) => api.delete(url.DELETE_PARTY + "/" + party);


// Campaigns
export const getCampaigns = () => api.get(url.GET_CAMPAIGNS);
export const getCampaignDetails = (campaign) => api.get(url.GET_CAMPAIGN_DETAILS + "/" + campaign);
export const addCampaign = (campaign) => api.create(url.ADD_CAMPAIGN, campaign);
export const updateCampaign = (campaign) => api.update(url.UPDATE_CAMPAIGN + "/" + campaign.id, campaign);
export const deleteCampaign = (campaign) => api.delete(url.DELETE_CAMPAIGN + "/" + campaign);

// CampaignMember
export const getAllCampaignMembers = (member) => api.get(url.GET_ALL_CAMPAIGN_MEMBERS + "/" + member.id);
export const addCampaignMember = (member) => api.create(url.ADD_CAMPAIGN_MEMBER, member);
export const updateCampaignMember = (member) => api.update(url.UPDATE_CAMPAIGN_MEMBER + "/" + member.id, member);
export const deleteCampaignMember = (member) => api.delete(url.DELETE_CAMPAIGN_MEMBER + "/" + member);
export const getCampaignMemberDetails = (member) => api.get(url.GET_CAMPAIGN_MEMBER_DETAILS + "/" + member.id);

// CampaignGuarantee
export const getAllCampaignGuarantees = (campaignGuarantee) => api.get(url.GET_ALL_CAMPAIGN_GUARANTEES, campaignGuarantee);
export const addCampaignGuarantee = (campaignGuarantee) => api.create(url.ADD_CAMPAIGN_GUARANTEE, campaignGuarantee);
export const updateCampaignGuarantee = (campaignGuarantee) => api.update(url.UPDATE_CAMPAIGN_GUARANTEE + "/" + campaignGuarantee.id, campaignGuarantee);
export const deleteCampaignGuarantee = (campaignGuarantee) => api.delete(url.DELETE_CAMPAIGN_GUARANTEE + "/" + campaignGuarantee);

// CampaignGuaranteeGroup
export const getAllCampaignGuaranteeGroups = (campaignGuaranteeGroup) => api.get(url.GET_ALL_CAMPAIGN_GUARANTEE_GROUPS, campaignGuaranteeGroup);
export const addCampaignGuaranteeGroup = (campaignGuaranteeGroup) => api.create(url.ADD_CAMPAIGN_GUARANTEE_GROUP, campaignGuaranteeGroup);
export const updateCampaignGuaranteeGroup = (campaignGuaranteeGroup) => api.update(url.UPDATE_CAMPAIGN_GUARANTEE_GROUP + "/" + campaignGuaranteeGroup.id, campaignGuaranteeGroup);
export const deleteCampaignGuaranteeGroup = (campaignGuaranteeGroup) => api.delete(url.DELETE_CAMPAIGN_GUARANTEE_GROUP + "/" + campaignGuaranteeGroup);


// CampaignElectionAttendee
export const getAllCampaignAttendees = (campaignAttendee) => api.get(url.GET_CAMPAIGN_ATTENDEES, campaignAttendee);
export const addCampaignAttendee = (campaignAttendee) => api.create(url.ADD_CAMPAIGN_ATTENDEE, campaignAttendee);
export const updateCampaignAttendee = (campaignAttendee) => api.update(url.UPDATE_CAMPAIGN_ATTENDEE + "/" + campaignAttendee.id, campaignAttendee);
export const deleteCampaignAttendee = (campaignAttendee) => api.delete(url.DELETE_CAMPAIGN_ATTENDEE + "/" + campaignAttendee);

// CampaignSorting
export const getAllCampaignSorting = () => api.get(url.GET_ALL_CAMPAIGN_SORTING);
export const getCampaignCommitteeSorting = () => api.get(url.GET_CAMPAIGN_COMMITTEE_SORTING);
// export const deleteCampaignSorting = (campaignSorting) => api.delete(url.DELETE_CAMPAIGN_SORTING + "/" + campaignSorting);
// export const addCampaignSorting = (campaignSorting) => api.create(url.ADD_CAMPAIGN_SORTING, campaignSorting);
// export const updateCampaignSorting = (campaignSorting) => api.update(url.UPDATE_CAMPAIGN_SORTING + "/" + campaignSorting.id, campaignSorting);

// Notifications
export const getUserNotifications = () => api.get(url.GET_USER_NOTIFICATIONS);

// Users
export const getUsers = () => api.get(url.GET_USERS);
export const getUserDetails = (user) => api.get(url.GET_USER_DETAILS + "/" + user.id);

export const addNewUser = (user) => api.create(url.ADD_NEW_USER, user);
// export const updateUser = (user) => api.update(url.UPDATE_USER_PROFILE + "/" + user.id, user);
export const updateUser = (user) => api.put(url.UPDATE_USER_PROFILE, user);
export const changeUserPassword = (user) => api.update(url.CHANGE_USER_PASSWORD + "/" + user.id, user);
export const deleteUser = (user) => api.delete(url.DELETE_USER + "/" + user);

// Specific User(s)
export const getCurrentUser = () => api.get(url.GET_CURRENT_USER);
export const getModeratorUsers = () => api.get(url.GET_MODERATOR_USERS);
export const getCampaignModerators = () => api.get(url.GET_CAMPAIGN_MODERATORS);
export const getCampaignSorters = () => api.get(url.GET_CAMPAIGN_SORTERS);


// Groups
export const getGroups = () => api.get(url.GET_GROUPS);
export const addNewGroup = (group) => api.upload(url.ADD_NEW_GROUP, group);
export const updateGroup = (group) => api.update(url.UPDATE_GROUP + "/" + group.id, group);
export const deleteGroup = (group) => api.delete(url.DELETE_GROUP + "/" + group);


// GroupPermissions
export const getGroupPermissions = () => api.get(url.GET_GROUP_PERMISSIONS);
export const addNewGroupPermission = (groupPermission) => api.upload(url.ADD_NEW_GROUP_PERMISSION, groupPermission);
export const updateGroupPermission = (groupPermission) => api.update(url.UPDATE_GROUP_PERMISSION + "/" + groupPermission.id, groupPermission);
export const deleteGroupPermission = (groupPermission) => api.delete(url.DELETE_GROUP_PERMISSION + "/" + groupPermission);


// Images
export const uploadNewImage = (formData) => api.imageUpload(url.UPLOAD_IMAGE, formData);
export const getImages = () => api.get(url.GET_IMAGES);
// export const uploadNewImage = (formData) => api.create(url.UPLOAD_NEW_IMAGE, formData);
// export const uploadNewImage = (formData) => api.post("/uploadImage", formData);
export const updateImage = () => api.get(url.DELETE_IMAGE);
export const deleteImage = () => api.get(url.UPDATE_IMAGE);

// Category
export const getCategories = () => api.get(url.GET_CATEGORIES);
export const addNewCategory = (category) => api.create(url.ADD_NEW_CATEGORY, category);
export const updateCategory = (category) => api.update(url.UPDATE_CATEGORY + "/" + category.id, category);
export const deleteCategory = (category) => api.delete(url.DELETE_CATEGORY + "/" + category);


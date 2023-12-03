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
export const postFakeForgetPwd = (data) =>
  api.create(url.POST_PASSWORD_FORGET, data);
export const postJwtProfile = (data) =>
  api.create(url.POST_EDIT_JWT_PROFILE, data);
export const postFakeProfile = (data) =>
  api.update(url.POST_EDIT_PROFILE + "/" + data.idx, data);

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

// Election Candidate Votes
export const updateElectionCandidateVotes = (electionCandidateVotes) => api.update(url.UPDATE_ELECTION_CANDIDATE_VOTES + "/" + "votes", electionCandidateVotes);

// ElectionCommittees
export const getElectionCommittees = (electionCommittee) => api.get(url.GET_ELECTION_COMMITTEES + "/" + electionCommittee.id);
export const getElectionCommitteeDetails = (electionCommittee) => api.get(url.GET_ELECTION_COMMITTEE_DETAILS + "/" + electionCommittee.id);
export const addNewElectionCommittee = (electionCommittee) => api.create(url.ADD_NEW_ELECTION_COMMITTEE, electionCommittee);
export const updateElectionCommittee = (electionCommittee) => api.update(url.UPDATE_ELECTION_COMMITTEE + "/" + electionCommittee.id, electionCommittee);
export const deleteElectionCommittee = (electionCommittee) => api.delete(url.DELETE_ELECTION_COMMITTEE + "/" + electionCommittee);

// ElectionCommittees
export const updateElectionCommitteeResults = (electionCommitteeResult) => api.update(url.UPDATE_ELECTION_COMMITTEE_RESULTS + "/" + electionCommitteeResult.id, electionCommitteeResult);

// ElectionCampaigns
export const getElectionCampaigns = (campaign) => api.get(url.GET_ELECTION_CAMPAIGNS + "/" + campaign.id);
export const getElectionCampaignDetails = (campaign) => api.get(url.GET_CAMPAIGN_DETAILS + "/" + campaign.id);
export const addNewElectionCampaign = (campaign) => api.create(url.ADD_NEW_CAMPAIGN, campaign);
export const updateElectionCampaign = (campaign) => api.update(url.UPDATE_CAMPAIGN + "/" + campaign.id, campaign);
export const deleteElectionCampaign = (campaign) => api.delete(url.DELETE_CAMPAIGN + "/" + campaign);

// ElectionAttendee
export const getAllElectionAttendees = (electionAttendee) => api.get(url.GET_ELECTION_ATTENDEES, electionAttendee);
export const deleteElectionAttendee = (electionAttendee) => api.delete(url.DELETE_ELECTION_ATTENDEE + "/" + electionAttendee);
export const addNewElectionAttendee = (electionAttendee) => api.create(url.ADD_NEW_ELECTION_ATTENDEE, electionAttendee);
export const updateElectionAttendee = (electionAttendee) => api.put(url.UPDATE_ELECTION_ATTENDEE, electionAttendee);


// Candidates
export const getCandidates = () => api.get(url.GET_CANDIDATES);
export const getCandidateDetails = (candidate) => api.get(url.GET_CANDIDATE_DETAILS + "/" + candidate);
export const addNewCandidate = (candidate) => api.create(url.ADD_NEW_CANDIDATE, candidate);
export const updateCandidate = (candidate) => api.update(url.UPDATE_CANDIDATE + "/" + candidate.get('id'), candidate);
export const deleteCandidate = (candidate) => api.delete(url.DELETE_CANDIDATE + "/" + candidate);

// Campaigns
export const getCampaigns = () => api.get(url.GET_CAMPAIGNS);
export const getCampaignDetails = (campaign) => api.get(url.GET_CAMPAIGN_DETAILS + "/" + campaign);
export const addNewCampaign = (campaign) => api.create(url.ADD_NEW_CAMPAIGN, campaign);
export const updateCampaign = (campaign) => api.update(url.UPDATE_CAMPAIGN + "/" + campaign.id, campaign);
export const deleteCampaign = (campaign) => api.delete(url.DELETE_CAMPAIGN + "/" + campaign);

// CampaignMember
export const getAllCampaignMembers = (member) => api.get(url.GET_ALL_CAMPAIGN_MEMBERS + "/" + member.id);
export const addNewCampaignMember = (member) => api.create(url.ADD_NEW_CAMPAIGN_MEMBER, member);
export const updateCampaignMember = (member) => api.update(url.UPDATE_CAMPAIGN_MEMBER + "/" + member.id, member);
export const deleteCampaignMember = (member) => api.delete(url.DELETE_CAMPAIGN_MEMBER + "/" + member);
export const getCampaignMemberDetails = (member) => api.get(url.GET_CAMPAIGN_MEMBER_DETAILS + "/" + member.id);

// CampaignGuarantee
export const getAllCampaignGuarantees = (campaignGuarantee) => api.get(url.GET_ALL_CAMPAIGN_GUARANTEES, campaignGuarantee);
export const deleteCampaignGuarantee = (campaignGuarantee) => api.delete(url.DELETE_CAMPAIGN_GUARANTEE + "/" + campaignGuarantee);
export const addNewCampaignGuarantee = (campaignGuarantee) => api.create(url.ADD_NEW_CAMPAIGN_GUARANTEE, campaignGuarantee);
export const updateCampaignGuarantee = (campaignGuarantee) => api.update(url.UPDATE_CAMPAIGN_GUARANTEE + "/" + campaignGuarantee.id, campaignGuarantee);

// CampaignElectionAttendee
export const getAllCampaignAttendees = (campaignAttendee) => api.get(url.GET_CAMPAIGN_ATTENDEES, campaignAttendee);
export const deleteCampaignAttendee = (campaignAttendee) => api.delete(url.DELETE_CAMPAIGN_ATTENDEE + "/" + campaignAttendee);
export const addNewCampaignAttendee = (campaignAttendee) => api.create(url.ADD_NEW_CAMPAIGN_ATTENDEE, campaignAttendee);
export const updateCampaignAttendee = (campaignAttendee) => api.put(url.UPDATE_CAMPAIGN_ATTENDEE, campaignAttendee);

// CampaignSorting
export const getAllCampaignSorting = () => api.get(url.GET_ALL_CAMPAIGN_SORTING);
export const getCampaignCommitteeSorting = () => api.get(url.GET_CAMPAIGN_COMMITTEE_SORTING);
// export const deleteCampaignSorting = (campaignSorting) => api.delete(url.DELETE_CAMPAIGN_SORTING + "/" + campaignSorting);
// export const addNewCampaignSorting = (campaignSorting) => api.create(url.ADD_NEW_CAMPAIGN_SORTING, campaignSorting);
// export const updateCampaignSorting = (campaignSorting) => api.update(url.UPDATE_CAMPAIGN_SORTING + "/" + campaignSorting.id, campaignSorting);

// Users
export const getUsers = () => api.get(url.GET_USERS);
export const getUserDetails = (user) => api.get(url.GET_USER_DETAILS + "/" + user.id);

export const addNewUser = (user) => api.create(url.ADD_NEW_USER, user);
export const updateUser = (user) => api.update(url.UPDATE_USER_PROFILE + "/" + user.id, user);
export const changeUserPassword = (user) => api.update(url.CHANGE_USER_PASSWORD + "/" + user.id, user);
export const deleteUser = (user) => api.delete(url.DELETE_USER + "/" + user);

// Specific User(s)
export const getCurrentUser = () => api.get(url.GET_CURRENT_USER);
export const getModeratorUsers = () => api.get(url.GET_MODERATOR_USERS);
export const getCampaignModerators = () => api.get(url.GET_CAMPAIGN_MODERATORS);


// Groups
export const getGroups = () => api.get(url.GET_GROUPS);
export const getGroupDetails = (group) => api.get(url.GET_GROUP_DETAILS + "/" + group.id);
export const addNewGroup = (group) => api.upload(url.ADD_NEW_GROUP, group);
export const updateGroup = (group) => api.update(url.UPDATE_GROUP + "/" + group.id, group);
export const deleteGroup = (group) => api.delete(url.DELETE_GROUP + "/" + group);

// Images
export const uploadNewImage = (formData) => api.upload(url.UPLOAD_IMAGE, formData);
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

// Elector
export const getAllElectors = (elector) => api.get(url.GET_ALL_ELECTORS, elector);
export const getElectors = (elector) => api.get(url.GET_ELECTORS, elector);
export const deleteElector = (elector) => api.delete(url.DELETE_ELECTOR + "/" + elector);
export const addNewElector = (elector) => api.create(url.ADD_NEW_ELECTOR, elector);
export const updateElector = (elector) => api.put(url.UPDATE_ELECTOR, elector);

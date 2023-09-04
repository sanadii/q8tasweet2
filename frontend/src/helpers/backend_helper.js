import { APIClient } from "./api_helper";
import * as url from "./url_helper";
import axios from "axios";

const restapi = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: { "Content-Type": "multipart/form-data" },
});

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
export const getElections = () => api.get(url.GET_ELECTIONS);
export const addElection = (election) => api.create(url.ADD_ELECTION, election);
export const updateElection = (election) => api.update(url.UPDATE_ELECTION + "/" + election.id, election);
export const deleteElection = (election) => api.delete(url.DELETE_ELECTION + "/" + election);
export const getElectionDetails = (election) => api.get(url.GET_ELECTION_DETAILS + "/" + election.id);
export const getElectionCount = () => api.get(url.GET_ELECTION_COUNT);

// ElectionCandidates
export const getElectionCandidates = (electionCandidate) => api.get(url.GET_ELECTION_CANDIDATES + "/" + electionCandidate.id);
export const addNewElectionCandidate = (electionCandidate) => api.create(url.ADD_NEW_ELECTION_CANDIDATE, electionCandidate);
export const deleteElectionCandidate = (electionCandidate) => api.delete(url.DELETE_ELECTION_CANDIDATE + "/" + electionCandidate);
export const updateElectionCandidate = (electionCandidate) => api.update(url.UPDATE_ELECTION_CANDIDATE + "/" + electionCandidate.id, electionCandidate);
export const getElectionCandidateDetails = (electionCandidate) =>
  api.get(url.GET_ELECTION_CANDIDATE_DETAILS + "/" + electionCandidate.id);
export const getElectionCandidateCount = () => api.get(url.GET_ELECTION_COUNT);

// ElectionCampaigns
export const getElectionCampaigns = (campaign) => api.get(url.GET_ELECTION_CAMPAIGNS + "/" + campaign.id);
export const addNewElectionCampaign = (campaign) => api.create(url.ADD_NEW_CAMPAIGN, campaign);
export const deleteElectionCampaign = (campaign) => api.delete(url.DELETE_CAMPAIGN + "/" + campaign);
export const updateElectionCampaign = (campaign) => api.update(url.UPDATE_CAMPAIGN + "/" + campaign.id, campaign);
export const getElectionCampaignDetails = (campaign) => api.get(url.GET_CAMPAIGN_DETAILS + "/" + campaign.id);
export const getElectionCampaignCount = () => api.get(url.GET_ELECTION_CAMPAIGN_COUNT);

// ElectionAttendee
export const getAllElectionAttendees = (electionAttendee) => api.get(url.GET_ELECTION_ATTENDEES, electionAttendee);
export const deleteElectionAttendee = (electionAttendee) => api.delete(url.DELETE_ELECTION_ATTENDEE + "/" + electionAttendee);
export const addNewElectionAttendee = (electionAttendee) => api.create(url.ADD_NEW_ELECTION_ATTENDEE, electionAttendee);
export const updateElectionAttendee = (electionAttendee) => api.put(url.UPDATE_ELECTION_ATTENDEE, electionAttendee);


// --------------- Candidates  ---------------
// Candidates
export const getCandidates = () => api.get(url.GET_CANDIDATES);
export const addNewCandidate = (candidate) => api.create(url.ADD_NEW_CANDIDATE, candidate);
export const updateCandidate = (candidate) => api.update(url.UPDATE_CANDIDATE + "/" + candidate.id, candidate);
export const deleteCandidate = (candidate) => api.delete(url.DELETE_CANDIDATE + "/" + candidate);
export const getCandidateDetails = (candidate) => api.get(url.GET_CANDIDATE_DETAILS + "/" + candidate.id);
export const getCandidateCount = () => api.get(url.GET_CANDIDATE_COUNT);

// CandidateElections
export const getCandidateElections = (candidate) => api.get(url.GET_CANDIDATE_ELECTIONS + "/" + candidate.id);
export const addNewCandidateElection = (candidate) => api.create(url.ADD_NEW_CANDIDATE_ELECTION, candidate);
export const deleteCandidateElection = (candidate) => api.delete(url.DELETE_CANDIDATE_ELECTION + "/" + candidate);
export const updateCandidateElection = (candidate) => api.update(url.UPDATE_CANDIDATE_ELECTION + "/" + candidate.id, candidate);
export const getCandidateElectionDetails = (candidate) => api.get(url.GET_CANDIDATE_ELECTION_DETAILS + "/" + candidate.id);
export const getCandidateElectionCount = () => api.get(url.GET_ELECTION_COUNT);

// CandidateCampaigns
export const getCandidateCampaigns = (campaign) => api.get(url.GET_CANDIDATE_CAMPAIGNS + "/" + campaign.id);
export const addNewCandidateCampaign = (campaign) => api.create(url.ADD_NEW_CAMPAIGN, campaign);
export const deleteCandidateCampaign = (campaign) => api.delete(url.DELETE_CAMPAIGN + "/" + campaign);
export const updateCandidateCampaign = (campaign) => api.update(url.UPDATE_CAMPAIGN + "/" + campaign.id, campaign);
export const getCandidateCampaignDetails = (campaign) => api.get(url.GET_CAMPAIGN_DETAILS + "/" + campaign.id);
export const getCandidateCampaignCount = () => api.get(url.GET_CANDIDATE_CAMPAIGN_COUNT);


// --------------- Campaigns  ---------------
// Campaign
export const getCampaigns = () => api.get(url.GET_CAMPAIGNS);
export const addNewCampaign = (campaign) =>
  api.create(url.ADD_NEW_CAMPAIGN, campaign);
export const updateCampaign = (campaign) =>
  api.update(url.UPDATE_CAMPAIGN + "/" + campaign.id, campaign);
export const deleteCampaign = (campaign) =>
  api.delete(url.DELETE_CAMPAIGN + "/" + campaign);
export const getCampaignDetails = (campaign) =>
  api.get(url.GET_CAMPAIGN_DETAILS + "/" + campaign.id);
export const getCampaignCount = () => api.get(url.GET_CAMPAIGN_COUNT);

// --------------- CampaignMember  ---------------
export const getAllCampaignMembers = (member) =>
  api.get(url.GET_ALL_CAMPAIGN_MEMBERS + "/" + member.id);
export const addNewCampaignMember = (member) =>
  api.create(url.ADD_NEW_CAMPAIGN_MEMBER, member);
export const updateCampaignMember = (member) =>
  api.update(url.UPDATE_CAMPAIGN_MEMBER + "/" + member.id, member);
export const deleteCampaignMember = (member) =>
  api.delete(url.DELETE_CAMPAIGN_MEMBER + "/" + member);
export const getCampaignMemberDetails = (member) =>
  api.get(url.GET_CAMPAIGN_MEMBER_DETAILS + "/" + member.id);
export const getCampaignMemberCount = () =>
  api.get(url.GET_CAMPAIGN_MEMBER_COUNT);

// --------------- CampaignGuarantee  ---------------
export const getAllCampaignGuarantees = (campaignGuarantee) =>
  api.get(url.GET_ALL_CAMPAIGN_GUARANTEES, campaignGuarantee);
export const deleteCampaignGuarantee = (campaignGuarantee) =>
  api.delete(url.DELETE_CAMPAIGN_GUARANTEE + "/" + campaignGuarantee);
export const addNewCampaignGuarantee = (campaignGuarantee) =>
  api.create(url.ADD_NEW_CAMPAIGN_GUARANTEE, campaignGuarantee);
export const updateCampaignGuarantee = (campaignGuarantee) =>
  api.update(
    url.UPDATE_CAMPAIGN_GUARANTEE + "/" + campaignGuarantee.id,
    campaignGuarantee
  );

// --------------- Users  ---------------
export const getUsers = () => api.get(url.GET_USERS);
export const getCurrentUser = () => api.get(url.GET_CURRENT_USER);
export const getUserDetails = (user) => api.get(url.GET_USER_DETAILS + "/" + user.id);
export const getModeratorUsers = () => api.get(url.GET_MODERATOR_USERS);

export const addNewUser = (user) => api.upload(url.ADD_NEW_USER, user);
export const updateUser = (user) => api.update(url.UPDATE_USER + "/" + user.id, user);
export const deleteUser = (user) => api.delete(url.DELETE_USER + "/" + user);

// UserCandidates
export const getUserCandidates = (user) =>
  api.get(url.GET_USER_CANDIDATES + "/" + user.id);
export const addNewUserCandidate = (user) =>
  api.create(url.ADD_NEW_USER_CANDIDATE, user);
export const deleteUserCandidate = (user) =>
  api.delete(url.DELETE_USER_CANDIDATE + "/" + user);
export const updateUserCandidate = (user) =>
  api.update(url.UPDATE_USER_CANDIDATE + "/" + user.id, user);
export const getUserCandidateDetails = (user) =>
  api.get(url.GET_USER_CANDIDATE_DETAILS + "/" + user.id);

// UserCampaign
export const getUserCampaigns = (user) =>
  api.get(url.GET_USER_CAMPAIGNS + "/" + user.id);
export const addNewUserCampaign = (user) =>
  api.create(url.ADD_NEW_USER_CAMPAIGN, user);
export const updateUserCampaign = (user) =>
  api.update(url.UPDATE_USER_CAMPAIGN + "/" + user.id, user);
export const deleteUserCampaign = (user) =>
  api.delete(url.DELETE_USER_CAMPAIGN + "/" + user);
export const getUserCampaignDetails = (user) =>
  api.get(url.GET_USER_CAMPAIGN_DETAILS + "/" + user.id);
export const getUserCampaignCount = () => api.get(url.GET_USER_CAMPAIGN_COUNT);

// Images
// export const uploadNewImage = (formData) => {
//   return restapi.post("/uploadImage", formData);
// };

export const uploadNewImage = (formData) => api.upload(url.UPLOAD_IMAGE, formData);

export const getImages = () => api.get(url.GET_IMAGES);
// export const uploadNewImage = (formData) => api.create(url.UPLOAD_NEW_IMAGE, formData);
// export const uploadNewImage = (formData) => api.post("/uploadImage", formData);

export const updateImage = () => api.get(url.DELETE_IMAGE);
export const deleteImage = () => api.get(url.UPDATE_IMAGE);

// Category
export const getCategories = (category) => api.get(url.GET_CATEGORIES, category);
export const deleteCategory = (category) =>
  api.delete(url.DELETE_CATEGORY, { headers: { category } });
export const addNewCategory = (category) =>
  api.create(url.ADD_NEW_CATEGORY, category);
export const updateCategory = (category) =>
  api.put(url.UPDATE_CATEGORY, category);

// Elector
export const getAllElectors = (elector) => api.get(url.GET_ALL_ELECTORS, elector);
export const getElectors = (elector) => api.get(url.GET_ELECTORS, elector);
export const deleteElector = (elector) => api.delete(url.DELETE_ELECTOR + "/" + elector);
export const addNewElector = (elector) => api.create(url.ADD_NEW_ELECTOR, elector);
export const updateElector = (elector) => api.put(url.UPDATE_ELECTOR, elector);

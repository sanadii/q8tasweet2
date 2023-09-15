// Authentications
export const POST_LOGIN = "/auth/signin";
export const POST_JWT_LOGIN = "/auth/userLogin";
export const POST_PASSWORD_FORGET = "/auth/forgot-password";
export const POST_JWT_PASSWORD_FORGET = "/auth/forget-pwd";
export const SOCIAL_LOGIN = "/auth/social-login";
export const POST_REGISTER = "/auth/signup";

// Proterm
export const POST_EDIT_JWT_PROFILE = "/postProfile";
export const POST_EDIT_PROFILE = "/user";


// --------------- Elections ---------------
// Elections
export const GET_ELECTIONS = "/elections/getElections";
export const ADD_ELECTION = "/elections/addElection";
export const UPDATE_ELECTION = "/elections/updateElection";
export const DELETE_ELECTION = "/elections/deleteElection";
export const GET_ELECTION_COUNT = "/elections/getElectionCount";
export const GET_ELECTION_DETAILS = "/elections/getElectionDetails";

// Election Candidate
export const GET_ELECTION_CANDIDATES = "/elections/getElectionCandidates";
export const ADD_NEW_ELECTION_CANDIDATE = "/elections/addNewElectionCandidate";
export const UPDATE_ELECTION_CANDIDATE = "/elections/updateElectionCandidate";
export const DELETE_ELECTION_CANDIDATE = "/elections/deleteElectionCandidate";
export const GET_ELECTION_CANDIDATE_DETAILS = "/elections/getElectionCandidateDetails";
export const GET_ELECTION_CANDIDATE_COUNT = "/elections/getElectionCandidateCount";

// Election Committee
export const GET_ELECTION_COMMITTEES = "/elections/getElectionCommittees";
export const ADD_NEW_ELECTION_COMMITTEE = "/elections/addNewElectionCommittee";
export const UPDATE_ELECTION_COMMITTEE = "/elections/updateElectionCommittee";
export const DELETE_ELECTION_COMMITTEE = "/elections/deleteElectionCommittee";
export const GET_ELECTION_COMMITTEE_DETAILS = "/elections/getElectionCommitteeDetails";
export const GET_ELECTION_COMMITTEE_COUNT = "/elections/getElectionCommitteeCount";

// Election Campaign
export const GET_ELECTION_CAMPAIGNS = "/elections/getElectionCampaigns";
export const ADD_NEW_ELECTION_CAMPAIGN = "/elections/addNewElectionCampaign";
export const UPDATE_ELECTION_CAMPAIGN = "/elections/updateElectionCampaign";
export const DELETE_ELECTION_CAMPAIGN = "/elections/deleteElectionCampaign";
export const GET_ELECTION_CAMPAIGN_DETAILS = "/elections/getElectionCampaignDetails";
export const GET_ELECTION_CAMPAIGN_COUNT = "/elections/getElectionCampaignCount";


// --------------- Candidates ---------------
// Candidates
export const GET_CANDIDATES = "/elections/getCandidates";
export const ADD_NEW_CANDIDATE = "/elections/addNewCandidate";
export const UPDATE_CANDIDATE = "/elections/updateCandidate";
export const DELETE_CANDIDATE = "/elections/deleteCandidate";
export const GET_CANDIDATE_COUNT = "/elections/getCandidateCount";
export const GET_CANDIDATE_DETAILS = "/elections/getCandidateDetails";
// Candidate Candidate
export const GET_CANDIDATE_ELECTIONS = "/elections/getCandidateElections";
export const ADD_NEW_CANDIDATE_ELECTION = "/elections/addNewCandidateElection";
export const UPDATE_CANDIDATE_ELECTION = "/elections/updateCandidateElection";
export const DELETE_CANDIDATE_ELECTION = "/elections/deleteCandidateElection";
export const GET_CANDIDATE_ELECTION_DETAILS = "/elections/getCandidateElectionDetails";
export const GET_CANDIDATE_ELECTION_COUNT = "/elections/getCandidateElectionCount";

// Candidate Campaign
export const GET_CANDIDATE_CAMPAIGNS = "/elections/getCandidateCampaigns";
export const ADD_NEW_CANDIDATE_CAMPAIGN = "/elections/addNewCandidateCampaign";
export const UPDATE_CANDIDATE_CAMPAIGN = "/elections/updateCandidateCampaign";
export const DELETE_CANDIDATE_CAMPAIGN = "/elections/deleteCandidateCampaign";
export const GET_CANDIDATE_CAMPAIGN_DETAILS = "/elections/getCandidateCampaignDetails";
export const GET_CANDIDATE_CAMPAIGN_COUNT = "/elections/getCandidateCampaignCount";


// --------------- Campaigns ---------------
// Campaigns
export const GET_CAMPAIGNS = "/elections/getCampaigns";
export const ADD_NEW_CAMPAIGN = "/elections/addNewCampaign";
export const UPDATE_CAMPAIGN = "/elections/updateCampaign";
export const DELETE_CAMPAIGN = "/elections/deleteCampaign";
export const GET_CAMPAIGN_COUNT = "/elections/getCampaignCount";
export const GET_CAMPAIGN_DETAILS = "/elections/getCampaignDetails";
// export const GET_CAMPAIGN_CANDIDATES = "/campaigns/getCampaignCandidates";

// Campaign Members
export const GET_ALL_CAMPAIGN_MEMBERS = "/elections/getElectionMembers";
export const ADD_NEW_CAMPAIGN_MEMBER = "/elections/addNewCampaignMember";
export const UPDATE_CAMPAIGN_MEMBER = "/elections/updateCampaignMember";
export const DELETE_CAMPAIGN_MEMBER = "/elections/deleteCampaignMember";
export const GET_CAMPAIGN_MEMBER_DETAILS =
  "/elections/getCampaignMemberDetails";
export const GET_CAMPAIGN_MEMBER_COUNT = "/elections/getCampaignMemberCount";

// Campaign Guarantees
export const GET_ALL_CAMPAIGN_GUARANTEES =
  "/elections/getAllCampaignGuarantees";
export const DELETE_CAMPAIGN_GUARANTEE = "/elections/deleteCampaignGuarantee";
export const ADD_NEW_CAMPAIGN_GUARANTEE = "/elections/addNewCampaignGuarantee";
export const UPDATE_CAMPAIGN_GUARANTEE = "/elections/updateCampaignGuarantee";

// ElectionAttendee
export const GET_ELECTION_ATTENDEES = "/elections/getAllElectionAttendees";
export const DELETE_ELECTION_ATTENDEE = "/elections/deleteElectionAttendee";
export const ADD_NEW_ELECTION_ATTENDEE = "/elections/addNewElectionAttendee";
export const UPDATE_ELECTION_ATTENDEE = "/elections/updateElectionAttendee";

// USERS
export const GET_USERS = "/users/getUsers";
export const GET_CURRENT_USER = "/users/getCurrentUser";
export const GET_USER_DETAILS = "/users/getUserDetails";
export const GET_MODERATOR_USERS = "/users/getModeratorUsers";

export const ADD_NEW_USER = "/users/addNewUser";
export const UPDATE_USER = "/users/updateUser";
export const DELETE_USER = "/users/deleteUser";

// User Candidate
export const GET_USER_CANDIDATES = "/users/getUserCandidates";
export const ADD_NEW_USER_CANDIDATE = "/users/addNewUserCandidate";
export const UPDATE_USER_CANDIDATE = "/users/updateUserCandidate";
export const DELETE_USER_CANDIDATE = "/users/deleteUserCandidate";
export const GET_USER_CANDIDATE_DETAILS = "/users/getUserCandidateDetails";

// User Campaign
export const GET_USER_CAMPAIGNS = "/users/getUserCampaigns";
export const ADD_NEW_USER_CAMPAIGN = "/users/addNewUserCampaign";
export const UPDATE_USER_CAMPAIGN = "/users/updateUserCampaign";
export const DELETE_USER_CAMPAIGN = "/users/deleteUserCampaign";
export const GET_USER_CAMPAIGN_DETAILS = "/users/getUserCampaignDetails";
export const GET_USER_CAMPAIGN_COUNT = "/users/getUserCampaignCount";

// Images
export const UPLOAD_IMAGE = "/uploadImage";
export const GET_IMAGES = "/uploadImage";
export const DELETE_IMAGE = "/uploadImage";
export const UPDATE_IMAGE = "/uploadImage";

// Category
export const GET_CATEGORIES = "/elections/getCategories";
export const DELETE_CATEGORY = "/elections/deleteCategory";
export const ADD_NEW_CATEGORY = "/elections/addCategory";
export const UPDATE_CATEGORY = "/elections/updateCategory";

// Elector
export const GET_ALL_ELECTORS = "/elections/getAllElectors";
export const GET_ELECTORS = "/elections/getElectors";
export const DELETE_ELECTOR = "/elections/deleteElector";
export const ADD_NEW_ELECTOR = "/elections/addElector";
export const UPDATE_ELECTOR = "/elections/updateElector";

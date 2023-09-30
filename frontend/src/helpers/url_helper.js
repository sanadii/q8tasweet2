// Authentications
export const POST_LOGIN = "/users/auth/signin";
export const POST_JWT_LOGIN = "/users/auth/userLogin";
export const POST_PASSWORD_FORGET = "/users/auth/forgot-password";
export const POST_JWT_PASSWORD_FORGET = "/users/auth/forget-pwd";
export const SOCIAL_LOGIN = "/users/auth/social-login";
export const POST_REGISTER = "/users/auth/signup";

// Proterm
export const POST_EDIT_JWT_PROFILE = "/users/postProfile";
export const POST_EDIT_PROFILE = "/users/user";


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

// Election Committee Results
export const UPDATE_ELECTION_COMMITTEE_RESULTS = "/elections/updateElectionCommitteeResults";

// Election Campaign
export const GET_ELECTION_CAMPAIGNS = "/elections/getElectionCampaigns";
export const ADD_NEW_ELECTION_CAMPAIGN = "/elections/addNewElectionCampaign";
export const UPDATE_ELECTION_CAMPAIGN = "/elections/updateElectionCampaign";
export const DELETE_ELECTION_CAMPAIGN = "/elections/deleteElectionCampaign";
export const GET_ELECTION_CAMPAIGN_DETAILS = "/elections/getElectionCampaignDetails";
export const GET_ELECTION_CAMPAIGN_COUNT = "/elections/getElectionCampaignCount";


// --------------- Candidates ---------------
// Candidates
export const GET_CANDIDATES = "/candidates/getCandidates";
export const ADD_NEW_CANDIDATE = "/candidates/addNewCandidate";
export const UPDATE_CANDIDATE = "/candidates/updateCandidate";
export const DELETE_CANDIDATE = "/candidates/deleteCandidate";
export const GET_CANDIDATE_COUNT = "/candidates/getCandidateCount";
export const GET_CANDIDATE_DETAILS = "/candidates/getCandidateDetails";
// Candidate Candidate
export const GET_CANDIDATE_ELECTIONS = "/candidates/getCandidateElections";
export const ADD_NEW_CANDIDATE_ELECTION = "/candidates/addNewCandidateElection";
export const UPDATE_CANDIDATE_ELECTION = "/candidates/updateCandidateElection";
export const DELETE_CANDIDATE_ELECTION = "/candidates/deleteCandidateElection";
export const GET_CANDIDATE_ELECTION_DETAILS = "/candidates/getCandidateElectionDetails";
export const GET_CANDIDATE_ELECTION_COUNT = "/candidates/getCandidateElectionCount";

// Candidate Campaign
export const GET_CANDIDATE_CAMPAIGNS = "/candidates/getCandidateCampaigns";
export const ADD_NEW_CANDIDATE_CAMPAIGN = "/candidates/addNewCandidateCampaign";
export const UPDATE_CANDIDATE_CAMPAIGN = "/candidates/updateCandidateCampaign";
export const DELETE_CANDIDATE_CAMPAIGN = "/candidates/deleteCandidateCampaign";
export const GET_CANDIDATE_CAMPAIGN_DETAILS = "/candidates/getCandidateCampaignDetails";
export const GET_CANDIDATE_CAMPAIGN_COUNT = "/candidates/getCandidateCampaignCount";

// Campaigns ---------------
export const GET_CAMPAIGNS = "/campaigns/getCampaigns";
export const ADD_NEW_CAMPAIGN = "/campaigns/addNewCampaign";
export const UPDATE_CAMPAIGN = "/campaigns/updateCampaign";
export const DELETE_CAMPAIGN = "/campaigns/deleteCampaign";
export const GET_CAMPAIGN_COUNT = "/campaigns/getCampaignCount";
export const GET_CAMPAIGN_DETAILS = "/campaigns/getCampaignDetails";
// export const GET_CAMPAIGN_CANDIDATES = "/campaigns/getCampaignCandidates";

// Campaign Members
export const GET_ALL_CAMPAIGN_MEMBERS = "/campaigns/getElectionMembers";
export const ADD_NEW_CAMPAIGN_MEMBER = "/campaigns/addNewCampaignMember";
export const UPDATE_CAMPAIGN_MEMBER = "/campaigns/updateCampaignMember";
export const DELETE_CAMPAIGN_MEMBER = "/campaigns/deleteCampaignMember";
export const GET_CAMPAIGN_MEMBER_DETAILS = "/campaigns/getCampaignMemberDetails";
export const GET_CAMPAIGN_MEMBER_COUNT = "/campaigns/getCampaignMemberCount";

// Campaign Guarantees
export const GET_ALL_CAMPAIGN_GUARANTEES = "/campaigns/getAllCampaignGuarantees";
export const DELETE_CAMPAIGN_GUARANTEE = "/campaigns/deleteCampaignGuarantee";
export const ADD_NEW_CAMPAIGN_GUARANTEE = "/campaigns/addNewCampaignGuarantee";
export const UPDATE_CAMPAIGN_GUARANTEE = "/campaigns/updateCampaignGuarantee";

// ElectionAttendee
export const GET_ELECTION_ATTENDEES = "/campaigns/getAllElectionAttendees";
export const DELETE_ELECTION_ATTENDEE = "/campaigns/deleteElectionAttendee";
export const ADD_NEW_ELECTION_ATTENDEE = "/campaigns/addNewElectionAttendee";
export const UPDATE_ELECTION_ATTENDEE = "/campaigns/updateElectionAttendee";

// USERS
export const GET_USERS = "//users/getUsers";
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
export const UPLOAD_IMAGE = "/media/uploadImage";
export const GET_IMAGES = "/media/uploadImage";
export const DELETE_IMAGE = "/media/uploadImage";
export const UPDATE_IMAGE = "/media/uploadImage";

// Category
export const GET_CATEGORIES = "/categories/getCategories";
export const DELETE_CATEGORY = "/categories/deleteCategory";
export const ADD_NEW_CATEGORY = "/categories/addCategory";
export const UPDATE_CATEGORY = "/categories/updateCategory";

// Elector
export const GET_ALL_ELECTORS = "/electors/getAllElectors";
export const GET_ELECTORS = "/electors/getElectors";
export const DELETE_ELECTOR = "/electors/deleteElector";
export const ADD_NEW_ELECTOR = "/electors/addElector";
export const UPDATE_ELECTOR = "/electors/updateElector";

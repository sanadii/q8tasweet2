// Authentications
export const POST_LOGIN = "/auth/signin";
export const POST_JWT_LOGIN = "/auth/userLogin";
export const POST_PASSWORD_FORGET = "/auth/forgot-password";
// export const POST_JWT_PASSWORD_FORGET = "/auth/forget-pwd";
export const POST_JWT_PASSWORD_FORGET = "/auth/forgot-password";
export const SOCIAL_LOGIN = "/auth/social-login";
export const POST_REGISTER = "/auth/signup";
export const RESET_PASSWORD = "/auth/reset-password";

// Proterm
export const POST_EDIT_JWT_PROFILE = "/auth/postProfile";
export const POST_EDIT_PROFILE = "/auth/user";


// Elections
export const GET_ELECTIONS = "/elections/getElections";
export const GET_ELECTION_DETAILS = "/elections/getElectionDetails";
export const ADD_ELECTION = "/elections/addElection";
export const UPDATE_ELECTION = "/elections/updateElection";
export const DELETE_ELECTION = "/elections/deleteElection";

// Election Candidate
export const GET_ELECTION_CANDIDATES = "/elections/getElectionCandidates";
export const GET_ELECTION_CANDIDATE_DETAILS = "/elections/getElectionCandidateDetails";
export const ADD_NEW_ELECTION_CANDIDATE = "/elections/addNewElectionCandidate";
export const UPDATE_ELECTION_CANDIDATE = "/elections/updateElectionCandidate";
export const DELETE_ELECTION_CANDIDATE = "/elections/deleteElectionCandidate";
export const UPDATE_ELECTION_CANDIDATE_VOTES = "/elections/updateElectionCandidateVotes";

// Election Party
export const GET_ELECTION_PARTIES = "/elections/getElectionParty";
export const GET_ELECTION_PARTY_DETAILS = "/elections/getElectionPartyDetails";
export const ADD_ELECTION_PARTY = "/elections/addElectionParty";
export const UPDATE_ELECTION_PARTY = "/elections/updateElectionParty";
export const DELETE_ELECTION_PARTY = "/elections/deleteElectionParty";
export const UPDATE_ELECTION_PARTY_RESULTS = "/elections/updateElectionPartyResults";

// Election Party Candidate
export const GET_ELECTION_PARTY_CANDIDATES = "/elections/getElectionPartyCandidates";
export const GET_ELECTION_PARTY_CANDIDATE_DETAILS = "/elections/getElectionPartyCandidateDetails";
export const ADD_ELECTION_PARTY_CANDIDATE = "/elections/addElectionPartyCandidate";
export const UPDATE_ELECTION_PARTY_CANDIDATE = "/elections/updateElectionPartyCandidate";
export const DELETE_ELECTION_PARTY_CANDIDATE = "/elections/deleteElectionPartyCandidate";
export const UPDATE_ELECTION_PARTY_CANDIDATE_VOTES = "/elections/updateElectionPartyCandidateVotes";


// Election Committee
export const GET_ELECTION_COMMITTEES = "/elections/getElectionCommittees";
export const GET_ELECTION_COMMITTEE_DETAILS = "/elections/getElectionCommitteeDetails";
export const ADD_NEW_ELECTION_COMMITTEE = "/elections/addNewElectionCommittee";
export const UPDATE_ELECTION_COMMITTEE = "/elections/updateElectionCommittee";
export const DELETE_ELECTION_COMMITTEE = "/elections/deleteElectionCommittee";

// Election Committee Results
export const UPDATE_ELECTION_RESULTS = "/committees/updateElectionResults";


// ElectionAttendee
export const GET_ELECTION_ATTENDEES = "/campaigns/getAllElectionAttendees";
export const DELETE_ELECTION_ATTENDEE = "/campaigns/deleteElectionAttendee";
export const ADD_NEW_ELECTION_ATTENDEE = "/campaigns/addNewElectionAttendee";
export const UPDATE_ELECTION_ATTENDEE = "/campaigns/updateElectionAttendee";


// Election Campaign
export const GET_ELECTION_CAMPAIGNS = "/elections/getElectionCampaigns";
export const GET_ELECTION_CAMPAIGN_DETAILS = "/elections/getElectionCampaignDetails";
export const ADD_NEW_ELECTION_CAMPAIGN = "/elections/addNewElectionCampaign";
export const UPDATE_ELECTION_CAMPAIGN = "/elections/updateElectionCampaign";
export const DELETE_ELECTION_CAMPAIGN = "/elections/deleteElectionCampaign";


// Election  Schema
export const GET_ELECTION_SCHEMAS = "/electionSchemas/getElectionSchemas";
export const ADD_SCHEMA_TABLES = "/electionSchemas/addSchemaTables";
export const GET_ELECTION_SCHEMA_DETAILS = "/electionSchemas/getElectionSchemaDetails";
export const ADD_ELECTION_SCHEMA = "/electionSchemas/addElectionSchema";
// export const ADD_ELECTION_SCHEMA_TABLES = "/electors/addElectionSchemaTables";
export const UPDATE_ELECTION_SCHEMA = "/electionSchemas/updateElectionSchema";
export const DELETE_ELECTION_SCHEMA = "/electionSchemas/deleteElectionSchema";


// Election Data
export const GET_ELECTORS = "/electors/getElectors";
export const ADD_ELECTOR = "/electors/addElector";
export const UPDATE_ELECTOR = "/electors/updateElector";
export const DELETE_ELECTOR = "/electors/deleteElector";
export const GET_ELECTOR_BY_ALL = "/electors/getElectorsByAll";
export const GET_ELECTORS_BY_CATEGORY = "/electors/getElectorsByCategory";
export const GET_ELECTORS_BY_SEARCH = "/electors/getElectorsBySearch";
export const GET_ELECTOR_RELATED_ELECTORS = "/electors/getElectorRelatedElectors";

// Candidates
export const GET_CANDIDATES = "/candidates/getCandidates";
export const GET_CANDIDATE_DETAILS = "/candidates/getCandidateDetails";
export const ADD_NEW_CANDIDATE = "/candidates/addNewCandidate";
export const UPDATE_CANDIDATE = "/candidates/updateCandidate";
export const DELETE_CANDIDATE = "/candidates/deleteCandidate";

// Parties
export const GET_PARTIES = "/candidates/getParties";
export const GET_PARTY_DETAILS = "/candidates/getPartyDetails";
export const ADD_PARTY = "/candidates/addParty";
export const UPDATE_PARTY = "/candidates/updateParty";
export const DELETE_PARTY = "/candidates/deleteParty";

// Campaigns
export const GET_CAMPAIGNS = "/campaigns/getCampaigns";
export const GET_CAMPAIGN_DETAILS = "/campaigns/getCampaignDetails";
export const ADD_CAMPAIGN = "/campaigns/ADD_CAMPAIGN";
export const UPDATE_CAMPAIGN = "/campaigns/updateCampaign";
export const DELETE_CAMPAIGN = "/campaigns/deleteCampaign";
// export const GET_CAMPAIGN_CANDIDATES = "/campaigns/getcampaignCandidates";

// Campaign Members
export const GET_ALL_CAMPAIGN_MEMBERS = "/campaigns/getElectionMembers";
export const ADD_CAMPAIGN_MEMBER = "/campaigns/ADD_CAMPAIGNMember";
export const UPDATE_CAMPAIGN_MEMBER = "/campaigns/updateCampaignMember";
export const DELETE_CAMPAIGN_MEMBER = "/campaigns/deleteCampaignMember";
export const GET_CAMPAIGN_MEMBER_DETAILS = "/campaigns/getCampaignMemberDetails";

// Campaign Guarantees
export const GET_ALL_CAMPAIGN_GUARANTEES = "/campaigns/getAllCampaignGuarantees";
export const DELETE_CAMPAIGN_GUARANTEE = "/campaigns/deleteCampaignGuarantee";
export const ADD_CAMPAIGN_GUARANTEE = "/campaigns/addCampaignGuarantee";
export const UPDATE_CAMPAIGN_GUARANTEE = "/campaigns/updateCampaignGuarantee";

// Campaign GuaranteeGroups
export const GET_ALL_CAMPAIGN_GUARANTEE_GROUPS = "/campaigns/getAllCampaignGuaranteeGroups";
export const DELETE_CAMPAIGN_GUARANTEE_GROUP = "/campaigns/deleteCampaignGuaranteeGroup";
export const ADD_CAMPAIGN_GUARANTEE_GROUP = "/campaigns/addCampaignGuaranteeGroup";
export const UPDATE_CAMPAIGN_GUARANTEE_GROUP = "/campaigns/updateCampaignGuaranteeGroup";


// CampaignAttendee
export const GET_CAMPAIGN_ATTENDEES = "/campaigns/getAllCampaignAttendees";
export const DELETE_CAMPAIGN_ATTENDEE = "/campaigns/deleteCampaignAttendee";
export const ADD_CAMPAIGN_ATTENDEE = "/campaigns/addCampaignAttendee";
export const UPDATE_CAMPAIGN_ATTENDEE = "/campaigns/updateCampaignAttendee";

// CampaignSorting
export const GET_ALL_CAMPAIGN_SORTING = "/campaigns/getAllCampaignSorting";
export const GET_CAMPAIGN_COMMITTEE_SORTING = "/campaigns/getCampaignCommitteeSorting";
// export const DELETE_CAMPAIGN_SORTING = "/campaigns/deleteCampaignSorting";
// export const ADD_CAMPAIGN_SORTING = "/campaigns/ADD_CAMPAIGNSorting";
// export const UPDATE_CAMPAIGN_SORTING = "/campaigns/updateCampaignSorting";


// Notifications
export const GET_USER_NOTIFICATIONS = "/campaigns/getUserNotifications";


// Images
// export const UPLOAD_IMAGE = "/media/uploadImage";
export const UPLOAD_IMAGE = "/auth/uploadImage";
export const GET_IMAGES = "/media/uploadImage";
export const DELETE_IMAGE = "/media/uploadImage";
export const UPDATE_IMAGE = "/media/uploadImage";

// Category
export const GET_CATEGORIES = "/elections/getCategories";
export const DELETE_CATEGORY = "/elections/deleteCategory";
export const ADD_NEW_CATEGORY = "/elections/addCategory";
export const UPDATE_CATEGORY = "/elections/updateCategory";

// Voter
export const GET_ALL_VOTERS = "/voters/getAllvoters";
export const GET_VOTERS = "/voters/getvoters";
export const DELETE_VOTER = "/voters/deletevoter";
export const ADD_NEW_VOTER = "/voters/addvoter";
export const UPDATE_VOTER = "/voters/updatevoter";

// USERS
export const GET_USERS = "/auth/getUsers";
export const GET_USER_DETAILS = "/auth/getUserDetails";
export const ADD_NEW_USER = "/auth/addNewUser";
export const UPDATE_USER = "/auth/updateUser";
export const UPDATE_USER_PROFILE = "/auth/updateUserProfile";
// export const UPDATE_USER_PROFILE = "/auth/update-profile";

export const CHANGE_USER_PASSWORD = "/auth/changeUserPassword";
export const DELETE_USER = "/auth/deleteUser";

// SPECIFIC USER(S)
export const GET_CURRENT_USER = "/auth/getCurrentUser";
export const GET_MODERATOR_USERS = "/auth/getModeratorUsers";
export const GET_CAMPAIGN_MODERATORS = "/auth/getCampaignModerators";
export const GET_CAMPAIGN_SORTERS = "/auth/getCampaignSorters";



// Group & permissions

// GROUPS
export const GET_GROUPS = "/auth/getGroups";
export const GET_GROUP_DETAILS = "/auth/getGroupDetails";
export const ADD_NEW_GROUP = "/auth/addNewGroup";
export const UPDATE_GROUP = "/auth/updateGroup";
export const DELETE_GROUP = "/auth/deleteGroup";



// GROUP_PERMISSIONS
export const GET_GROUP_PERMISSIONS = "/auth/getGroupPermissions";
export const ADD_NEW_GROUP_PERMISSION = "/auth/addNewPermission";
export const UPDATE_GROUP_PERMISSION = "/auth/updatePermission";
export const DELETE_GROUP_PERMISSION = "/auth/deletePermission";
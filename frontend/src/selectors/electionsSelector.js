import { createSelector } from 'reselect';

const selectElectionsState = state => state.Elections;
const selectCandidatesState = state => state.Candidates;
const selectCampaignsState = state => state.Campaigns;

const selectCategoriesState = state => state.Categories;
const selectUsersState = state => state.Users;

export const electionsSelector = createSelector(
  selectElectionsState,
  selectCandidatesState,
  selectCampaignsState,
  selectCategoriesState,
  selectUsersState,
  (electionsState, candidateState, campaignsState, categoriesState, usersState,) => ({
    // Election Selectors
    elections: electionsState.elections,
    electionDetails: electionsState.electionDetails,
    electionCommittees: electionsState.electionCommittees,
    electionCandidates: electionsState.electionCandidates,
    electionCampaigns: electionsState.electionCampaigns,

    electionAttendees: electionsState.electionAttendees,
    electionCommitteeResults: electionsState.electionCommitteeResults,

    isElectionSuccess: electionsState.isElectionSuccess,
    error: electionsState.error,


    // Taxonomy Selectors
    categories: categoriesState.categories,
    subCategories: categoriesState.subCategories,


    // Candidate Selectors
    candidates: candidateState.candidates,

    // Campaign Selectors
    campaigns: campaignsState.campaigns,
    campaign: campaignsState.campaignDetails,
    campaignDetails: campaignsState.campaignDetails,
    campaignMembers: campaignsState.campaignMembers,
    campaignGuarantees: campaignsState.campaignGuarantees,
    campaignAttendees: campaignsState.campaignAttendees,

    
    campaignElectionCommittees: campaignsState.campaignElectionCommittees,
    campaignElectionCandidates: campaignsState.campaignElectionCandidates,

    isCampaignSuccess: campaignsState.isCampaignSuccess,
    campaignError: campaignsState.error,


    // User electors
    moderators: usersState.moderators,
    currentUser: usersState.currentUser,
    currentCampaignUser: campaignsState.currentCampaignUser,
    electors: campaignsState.electors,

  })
);

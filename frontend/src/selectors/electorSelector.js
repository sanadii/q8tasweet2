// Selectors/electionSelectors.js
import { createSelector } from 'reselect';

const selectElectorState = state => state.Electors;

export const electorSelector = createSelector(
  selectElectorState,
  (electorsState) => ({
    // Election
    electionStatistics: electorsState.electionStatistics,

    // Election Selectors
    // electorsByFamily: electorsState.electorsByFamily,
    // electorsByArea: electorsState.electorsByArea,
    // electorsByCommittee: electorsState.electorsByCommittee,
    // electorsByCategories: electorsState.electorsByCategories,
    // electorsByFamiliesArea: electorsState.electorsByCategories?.electorsByFamily || [],

    // electorsByCategory
    electorsByCategory: electorsState.electorsByCategory,
    electorsByBranchFamilies: electorsState.electorsByCategory?.electorFamilyDivisionFamilies || [],

    // 
    // electorsByAll
    //  
    // electorsByAll: One field
    electorsByAll: electorsState.electorsByAll || [],
    electorsByAllFamilies: electorsState.electorsByAll?.electorsByAllFamilies || [],
    electorsByAllBranches: electorsState.electorsByAll?.electorsByAllBranches || [],
    electorsByAllAreas: electorsState.electorsByAll?.electorsByAllAreas || [],
    electorsByAllCommittees: electorsState.electorsByAll?.electorsByAllCommittees || [],


    // electorsByAll: Two field
    electorsByAllFamilyAreas: electorsState.electorsByAll?.electorsByAllFamilyAreas || [],
    electorsByAllFamilyCommittees: electorsState.electorsByAll?.electorsByAllFamilyCommittees || [],
    electorsByAllBranchAreas: electorsState.electorsByAll?.electorsByAllBranchAreas || [],
    electorsByAllBranchCommittees: electorsState.electorsByAll?.electorsByAllBranchCommittees || [],


    // electorsByAllAreas: electorsState.electorsByAll?.electorsByAllAreas || [],
    // electorsByAllCommittees: electorsState.electorsByAll?.electorsByAllCommittees || [],

    // 
    // electorsByCategory:
    // 
    // electorsByCategory: One Field
    electorsByFamily: electorsState.electorsByCategory?.electorsByFamily || [],
    electorsByBranch: electorsState.electorsByCategory?.electorsByBranch || [],
    electorsByyArea: electorsState.electorsByCategory?.electorsByArea || [],
    electorsByyCommitttee: electorsState.electorsByCategory?.electorsByyCommitttee || [],

    // electorsByCategory: One Field
    electorsByFamilyArea: electorsState.electorsByCategory?.electorsByFamilyArea || [],
    electorsByFamilyCommittee: electorsState.electorsByCategory?.electorsByFamilyCommittee || [],
    electorsByBranchArea: electorsState.electorsByCategory?.electorsByBranchArea || [],
    electorsByBranchCommittee: electorsState.electorsByCategory?.electorsByBranchCommittee || [],

    // Options
    familyOptions: electorsState.familyOptions || [],
    branchOptions: electorsState.electorsByCategory?.branchOptions || [],
    areaOptions: electorsState.electorsByCategory?.areaOptions || [],
    committeeOptions: electorsState.electorsByCategory?.committeeOptions || [],


    // electorsBySearch
    electorsBySearch: electorsState.electorsBySearch || [],
    electorRelatedElectors: electorsState.electorRelatedElectors || [],
    // electorFamilyBranches: electorsState.electorsByCategory?.electorFamilyBranches || [],

    // // Elections
    // electionCommittees: electionStatisticsState.electionCommittees,
    // // futureElections: electionStatisticsState.futureElections,


    voters: electorsState.voters,
    isElectorSuccess: electorsState.isElectorSuccess,
    isElectorerror: electorsState.error,

  })
);

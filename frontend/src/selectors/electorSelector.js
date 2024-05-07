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


    // electorsByAll
    // 1 field
    electorsByAll: electorsState.electorsByAll || [],
    electorsByAllFamilies: electorsState.electorsByAll?.electorsByAllFamilies || [],
    electorsByAllBranches: electorsState.electorsByAll?.electorsByAllBranches || [],
    electorsByAllAreas: electorsState.electorsByAll?.electorsByAllAreas || [],
    electorsByAllCommittees: electorsState.electorsByAll?.electorsByAllCommittees || [],


    // 2 fields
    electorsByAllFamilyAreas: electorsState.electorsByAll?.electorsByAllFamilyAreas || [],
    electorsByAllFamilyCommittees: electorsState.electorsByAll?.electorsByAllFamilyCommittees || [],
    electorsByAllBranchAreas: electorsState.electorsByAll?.electorsByAllBranchAreas || [],
    electorsByAllBranchCommittees: electorsState.electorsByAll?.electorsByAllBranchCommittees || [],


    electorsByAllAreas: electorsState.electorsByAll?.electorsByAllAreas || [],
    electorsByAllCommittees: electorsState.electorsByAll?.electorsByAllCommittees || [],

    // 2 fields
    electorsByBranch: electorsState.electorsByCategory?.electorsByBranch || [],
    electorsByFamily: electorsState.electorsByCategory?.electorsByFamily || [],
    electorsByyArea: electorsState.electorsByCategory?.electorsByArea || [],

    electorsByBranchArea: electorsState.electorsByCategory?.electorsByBranchArea || [],
    electorsByAreaBranch: electorsState.electorsByCategory?.electorsByAreaBranch || [],

    electorsByBranchCommittee: electorsState.electorsByCategory?.electorsByBranchCommittee || [],
    electorsByCommitteeBranch: electorsState.electorsByCategory?.electorsByCommitteeBranch || [],

    familyBranches: electorsState.electorsByCategory?.familyBranches || [],
    familyAreas: electorsState.electorsByCategory?.familyAreas || [],
    familyCommittees: electorsState.electorsByCategory?.familyCommittees || [],

    // electorFamilyBranches: electorsState.electorsByCategory?.electorFamilyBranches || [],

    // // Elections
    // electionCommittees: electionStatisticsState.electionCommittees,
    // // futureElections: electionStatisticsState.futureElections,


    voters: electorsState.voters,
    isElectorSuccess: electorsState.isElectorSuccess,
    isElectorerror: electorsState.error,

  })
);

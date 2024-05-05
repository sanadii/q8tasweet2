// Selectors/electionSelectors.js
import { createSelector } from 'reselect';

const selectElectorState = state => state.Electors;

export const electorSelector = createSelector(
  selectElectorState,
  (electorsState) => ({
    // Election
    electionStatistics: electorsState.electionStatistics,

    // Election Selectors
    electorsByFamily: electorsState.electorsByFamily,
    electorsByArea: electorsState.electorsByArea,
    electorsByCommittee: electorsState.electorsByCommittee,
    electorsByCategories: electorsState.electorsByCategories,
    electorsByFamiliesArea: electorsState.electorsByCategories?.electorsByFamily || [],

    // electorsByCategory
    electorsByCategory: electorsState.electorsByCategory,
    electorsByBranchFamilies: electorsState.electorsByCategory?.electorFamilyDivisionFamilies || [],

    electorsByFamilyAllBranches: electorsState.electorsByCategory?.electorsByFamilyAllBranches || [],
    electorsByFamilyAllAreas: electorsState.electorsByCategory?.electorsByFamilyAllAreas || [],
    electorsByFamilyAllCommittees: electorsState.electorsByCategory?.electorsByFamilyAllCommittees || [],

    electorsByFamilyBranch: electorsState.electorsByCategory?.electorsByFamilyBranch || [],
    electorsByFamilyArea: electorsState.electorsByCategory?.electorsByFamilyArea || [],

    electorsByFamilyBranchArea: electorsState.electorsByCategory?.electorsByFamilyBranchArea || [],
    electorsByAreaBranch: electorsState.electorsByCategory?.electorsByAreaBranch || [],

    electorsByFamilyBranchCommittee: electorsState.electorsByCategory?.electorsByFamilyBranchCommittee || [],
    electorsByFamilyCommitteeBranch: electorsState.electorsByCategory?.electorsByFamilyCommitteeBranch || [],
    
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

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
    electorsByFamilyArea: electorsState.electorsByCategories?.electorsByFamily || [],

    // ElectorsByFamilyDivision
    electorsByFamilyDivision: electorsState.electorsByFamilyDivision,
    electorsByBranchFamilies: electorsState.electorsByFamilyDivision?.electorFamilyDivisionFamilies || [],



    electorsByFamilyAllBranches: electorsState.electorsByFamilyDivision?.electorsByFamilyAllBranches || [],
    electorsByFamilyAllAreas: electorsState.electorsByFamilyDivision?.electorsByFamilyAllAreas || [],
    electorsByFamilyAllCommittees: electorsState.electorsByFamilyDivision?.electorsByFamilyAllCommittees || [],



    electorsByFamilyBranch: electorsState.electorsByFamilyDivision?.electorsByFamilyBranch || [],
    electorsByFamilyBranchArea: electorsState.electorsByFamilyDivision?.electorsByFamilyBranchArea || [],
    electorsByAreaFamilyBranch: electorsState.electorsByFamilyDivision?.electorsByFamilyBranchArea || [],
    familyBranches: electorsState.electorsByFamilyDivision?.familyBranches || [],
    familyBranchesAreas: electorsState.electorsByFamilyDivision?.familyBranchesAreas || [],
    // electorFamilyBranches: electorsState.electorsByFamilyDivision?.electorFamilyBranches || [],

    // // Elections
    // electionCommittees: electionStatisticsState.electionCommittees,
    // // futureElections: electionStatisticsState.futureElections,


    voters: electorsState.voters,
    isElectorSuccess: electorsState.isElectorSuccess,
    isElectorerror: electorsState.error,

  })
);

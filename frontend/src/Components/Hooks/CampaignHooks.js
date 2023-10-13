// hooks/CampaignHooks.js

import { useMemo } from 'react';

const useSupervisorMembers = (campaignRanks, campaignMembers) => {
    const supervisorRankId = useMemo(() => {
        return campaignRanks.find(rank => rank.role === "CampaignSupervisor")?.id;
    }, [campaignRanks]);

    const supervisorMembers = useMemo(() => {
        return campaignMembers.filter(member => member.rank === supervisorRankId);
    }, [campaignMembers, supervisorRankId]);

    return supervisorMembers;
};



// create a hooks, 
// Dont show currentCampaignMember.rank
// if campaignAdmin, show all ranks
// if candidateAdmin, Show All except campaignAdmin, and candidateAdmin
// if candidate, Show All Except campaignAdmin, and candidateAdmin, candidate
// if supervisor, show all ranks except campaignAdmin, candidateAdmin, candidate, and supervisor

const useCampaignRanks = (campaignRanks, currentCampaignMember) => {

    return useMemo(() => {
      const currentRankId = currentCampaignMember?.rank;
  
      // Based on the rank ID of the currentCampaignMember, 
      // derive the rank IDs that should not be displayed.
      let excludedRankIds = [];
      switch (currentRankId) {
        case 1: // campaignAdmin
          break;
        case 2: // candidateAdmin
          excludedRankIds = [1, 2];
          break;
        case 3: // candidate
          excludedRankIds = [1, 2, 3];
          break;
        case 4: // supervisor
          excludedRankIds = [1, 2, 3, 4];
          break;
        default:
          break;
      }
  
      return campaignRanks.filter(rank => !excludedRankIds.includes(rank.id));
    }, [campaignRanks, currentCampaignMember]);
  
  };
  

export { useSupervisorMembers, useCampaignRanks };

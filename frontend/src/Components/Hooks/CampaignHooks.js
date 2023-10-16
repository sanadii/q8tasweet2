// hooks/CampaignHooks.js

import { useMemo } from 'react';

const useSupervisorMembers = (campaignRoles, campaignMembers) => {
  const supervisorRoleId = useMemo(() => {
    return campaignRoles.find(role => role.role === "CampaignCoordinator")?.id;
  }, [campaignRoles]);

  const supervisorMembers = useMemo(() => {
    return campaignMembers.filter(member => member.role === supervisorRoleId);
  }, [campaignMembers, supervisorRoleId]);

  return supervisorMembers;
};

// const useAttendantMembers = (campaignRoles, campaignMembers) => {
//   const attendantRoleId = useMemo(() => {
//     return campaignRoles.find(role => role.role === "campaignAttendant")?.id;
//   }, [campaignRoles]);

//   const attendantMembers = useMemo(() => {
//     return campaignMembers.filter(member => member.role === attendantRoleId);
//   }, [campaignMembers, attendantRoleId]);

//   return attendantMembers;
// };

const useCampaignRoles = (campaignRoles, currentCampaignMember) => {
  return useMemo(() => {
    const currentRoleId = currentCampaignMember?.role;
    let excludedRoleStrings = [];
    let excludedRoleIds = [];

    const currentRoleObject = campaignRoles.find(role => role.id === currentRoleId);
    const currentRole = currentRoleObject?.role;

    switch (currentRole) {
      case "CampaignDirector":
        // No roles excluded for CampaignDirector.
        break;
      case "candidateAdmin":
        excludedRoleStrings = ["CampaignDirector", "CampaignCoordinator"];
        break;
      case "campaignCandidate":
        excludedRoleStrings = ["CampaignDirector", "CampaignCoordinator", "campaignCandidate"];
        break;
      case "CampaignCoordinator":
        excludedRoleStrings = ["CampaignDirector", "candidateAdmin", "campaignCandidate", "CampaignCoordinator"];
        break;
      default:
        break;
    }

    excludedRoleIds = campaignRoles
      .filter(role => {
        const isExcluded = excludedRoleStrings.includes(role.role);
        if (isExcluded) {
          console.log("Excluding role:", role.role);
        }
        return isExcluded;
      })
      .map(role => role.id);

    const allRoleStrings = campaignRoles.map(role => role.role);

    const displayedRoles = campaignRoles.filter(role => !excludedRoleIds.includes(role.id));

    return displayedRoles;

  }, [campaignRoles, currentCampaignMember]);
};




export {
  useSupervisorMembers,
  // useAttendantMembers,
  useCampaignRoles
};

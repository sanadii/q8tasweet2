// hooks/CampaignHooks.js

import { useMemo } from 'react';

const useSupervisorMembers = (campaignRoles, campaignMembers) => {
  const supervisorRoleId = useMemo(() => {
    return campaignRoles.find(role => role.role === "campaignSupervisor")?.id;
  }, [campaignRoles]);

  const supervisorMembers = useMemo(() => {
    return campaignMembers.filter(member => member.role === supervisorRoleId);
  }, [campaignMembers, supervisorRoleId]);

  return supervisorMembers;
};

const useCampaignRoles = (campaignRoles, currentCampaignMember) => {
  return useMemo(() => {
    const currentRoleId = currentCampaignMember?.role;
    let excludedRoleStrings = [];
    let excludedRoleIds = [];

    const currentRoleObject = campaignRoles.find(role => role.id === currentRoleId);
    const currentRole = currentRoleObject?.role;
    console.log("currentMemberRole:", currentRole);

    switch (currentRole) {
      case "campaignAdmin":
        // No roles excluded for campaignAdmin.
        break;
      case "candidateAdmin":
        excludedRoleStrings = ["campaignAdmin", "campaignSupervisor"];
        break;
      case "campaignCandidate":
        excludedRoleStrings = ["campaignAdmin", "campaignSupervisor", "campaignCandidate"];
        break;
      case "campaignSupervisor":
        excludedRoleStrings = ["campaignAdmin", "candidateAdmin", "campaignCandidate", "campaignSupervisor"];
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
    console.log("All Role Strings:", allRoleStrings);

    const displayedRoles = campaignRoles.filter(role => !excludedRoleIds.includes(role.id));
    console.log("Displayed Roles:", displayedRoles);

    return displayedRoles;

  }, [campaignRoles, currentCampaignMember]);
};




export { useSupervisorMembers, useCampaignRoles };

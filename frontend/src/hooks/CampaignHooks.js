// hooks/CampaignHooks.js

import { useMemo } from 'react';
import { usePermission } from 'hooks';



const useSupervisorMembers = (campaignRoles, campaignMembers) => {
  const supervisorRoleId = useMemo(() => {
    return campaignRoles.find(role => role.name === "campaignSupervisor")?.id;
  }, [campaignRoles]);

  const supervisorMembers = useMemo(() => {
    return campaignMembers.filter(member => member.role === supervisorRoleId);
  }, [campaignMembers, supervisorRoleId]);

  return supervisorMembers;
};


const useCampaignRoles = (campaignRoles, currentCampaignMember) => {
  // Permissions
  const {
    canChangeConfig,
    canChangeCampaign,
    canChangeMember,
    canChangeCampaignMember,
  } = usePermission();


  return useMemo(() => {
    const currentRoleId = currentCampaignMember?.role;
    console.log("currentRoleId:", currentRoleId)
    let excludedRoleStrings = ["campaignMember"]; // Excluded for all by default

    switch (true) {
      case canChangeConfig:
        excludedRoleStrings = ["campaignMember"];
        break;
      case canChangeCampaign:
        excludedRoleStrings = ["campaignMember", "campaignModerator", "campaignCandidate"];
        break;
      case canChangeCampaignMember:
        excludedRoleStrings = ["campaignMember", "campaignModerator", "campaignCoordinator", "campaignCandidate", "campaignSupervisor"];
        break;
      default:
        break;
    }

    const displayedRoles = campaignRoles.filter((role) => {
      const isExcluded = excludedRoleStrings.includes(role.name);
      if (isExcluded) {
        console.log("Excluding role:", role.name);
      }
      return !isExcluded;
    });

    return displayedRoles;
  }, [campaignRoles, currentCampaignMember, canChangeConfig, canChangeCampaign, canChangeMember]);
};

export {
  useSupervisorMembers,
  useCampaignRoles
};

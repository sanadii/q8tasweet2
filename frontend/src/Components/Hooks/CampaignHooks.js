// hooks/CampaignHooks.js

import { useMemo } from 'react';
import usePermission from './usePermission';



const useSupervisorMembers = (campaignRoles, campaignMembers) => {
  const supervisorRoleId = useMemo(() => {
    return campaignRoles.find(role => role.role === "campaignSupervisor")?.id;
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
  // Permissions
  const {
    canChangeConfig,
    canChangeConfigs,
    canChangeCampaign,
    canChangeMember,
    // canViewCampaignAttendees,
  } = usePermission();


  return useMemo(() => {
    const currentRoleId = currentCampaignMember?.role;
    let excludedRoleStrings = [];

    switch (true) {
      case canChangeConfig:
        // No roles excluded for CampaignDirector.
        break;
      case canChangeCampaign:
        excludedRoleStrings = ["campaignModerator", "campaignCandidate"];
        break;
      case canChangeMember:
        excludedRoleStrings = ["campaignModerator", "campaignCoordinator", "campaignCandidate", "campaignSupervisor"];
        break;
      default:
        break;
    }

    const displayedRoles = campaignRoles.filter((role) => {
      const isExcluded = excludedRoleStrings.includes(role.role);
      if (isExcluded) {
        console.log("Excluding role:", role.role);
      }
      return !isExcluded;
    });

    return displayedRoles;
  }, [campaignRoles, currentCampaignMember, canChangeConfig, canChangeCampaign, canChangeMember]);
};

export {
  useSupervisorMembers,
  // useAttendantMembers,
  useCampaignRoles
};

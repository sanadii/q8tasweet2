// hooks/CampaignHooks.js
import { useMemo } from 'react';
import { usePermission } from 'shared/hooks';
import { useEffect, useState } from "react";

// Get Member Options
const useMemberMembers = (campaignMembers, memberRole) => {
  return useMemo(() => {
    return campaignMembers.filter(member => member.roleCodename === memberRole);
  }, [campaignMembers, memberRole]);
};

// Custom Hook to get Selected Options
const useMemberOptions = (campaignMembers, memberRole) => {
  console.log("campaignMemberscampaignMembers: ", campaignMembers)
  const memberGroup = useMemberMembers(campaignMembers, memberRole);
  return useMemo(() => {
    const options = memberGroup.map(item => ({
      id: item.id,
      label: item.name,
      value: parseInt(item.id, 10) // Ensure the value is an integer
    }));

    // Add the first option as "اختر الوكيل" with value null
    return [{ id: null, label: "اختر الوكيل", value: null }, ...options];
  }, [memberGroup]);
};


// Old
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



// Committees
const getListOptions = (list) => {
  return [
    { id: null, label: '- اختر - ', value: null }, // Add this default option
    ...list.map(item => ({
      id: item.id,
      label: item.name,
      value: parseInt(item.id, 10)
    }))
  ];
};


const getAllCommittees = (electionCommitteeSites) => {
  return electionCommitteeSites.flatMap(site => site.committees);
};

const getCampaignAgentCommittees = (campaignAgent, electionCommitteeSites) => {
  return electionCommitteeSites.flatMap(site => site.committees);
};


const useCommitteeSiteCommittees = (committeeSites) => {
  const [groupedCommittees, setGroupedCommittees] = useState([]);

  useEffect(() => {
    if (!committeeSites) {
      setGroupedCommittees([]);
      return;
    }

    const newGroupedCommittees = committeeSites.reduce((acc, committeeSite) => {
      const label = committeeSite.name; // Use committeeSite name as the label

      // Create the committee option
      const committeeOptions = committeeSite.committees.map(committee => ({
        id: committee.id,
        label: `${committee.type} - ${committee.id}`,
        value: parseInt(committee.id, 10)
      }));


      // Otherwise, create a new category with the committee options
      acc.push({
        label: label,
        options: committeeOptions,
      });


      return acc;
    }, []);

    setGroupedCommittees(newGroupedCommittees);
  }, [committeeSites]);

  return groupedCommittees;
};



export {
  useSupervisorMembers,
  useCampaignRoles,
  useMemberOptions,

  // Committees
  getListOptions,
  getAllCommittees,
  getCampaignAgentCommittees,
  useCommitteeSiteCommittees,

};

// hooks/CampaignHooks.js
import { useMemo, useEffect, useState, useCallback } from 'react';
import { usePermission } from 'shared/hooks';

// Custom Hook to get Member Options
const useMemberOptions = (campaignMembers, memberRole) => {
  const memberGroup = useMemo(() => {
    return campaignMembers.filter(member => member.roleCodename === memberRole);
  }, [campaignMembers, memberRole]);

  return useMemo(() => {
    const options = memberGroup.map(item => ({
      id: item.id,
      name: item.name,
      value: parseInt(item.id, 10) // Ensure the value is an integer
    }));

    // Add the first option as "اختر الوكيل" with value null
    return [{ id: null, label: "اختر الوكيل", value: null }, ...options];
  }, [memberGroup]);
};

// Hook to get Campaign Roles based on permissions
const useCampaignRoles = (campaignRoles, currentCampaignMember) => {
  const { canChangeConfig, canChangeCampaign, canChangeCampaignMember } = usePermission();

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

    const displayedRoles = campaignRoles.filter(role => !excludedRoleStrings.includes(role.name));

    // Convert roles to options
    const roleOptions = displayedRoles.map(role => ({
      id: role.id,
      name: role.name,
      value: role.id,
    }));

    return roleOptions;
  }, [campaignRoles, currentCampaignMember, canChangeConfig, canChangeCampaign, canChangeCampaignMember]);
};

// Get Campaign Agent Members
const getCampaignAgentMembers = (campaignMemberRoleCodename, campaignFieldAgentOptions, campaignDigitalAgentOptions) => {
  switch (campaignMemberRoleCodename) {
    case "campaignFieldDelegate":
      return {
        options: campaignFieldAgentOptions,
        label: "الوكلاء الميدانيين",
      };
    case "campaignDigitalDelegate":
      return {
        options: campaignDigitalAgentOptions,
        label: "الوكلاء الرقميين",
      };
    default:
      return {
        options: [],
        label: "",
      };
  }
};

// Get Committee Site Options
const getCommitteeSiteOptions = (list) => {
  return list.map(item => ({
    id: item.id,
    label: item.name,
    value: parseInt(item.id, 10),
  }));
};

// Get All Committees
const getAllCommittees = (electionCommitteeSites) => {
  return electionCommitteeSites.flatMap(site => site.committees);
};




// Hook to get Committee Options
const useCommitteeOptions = (committeeSites) => {
  const [groupedCommittees, setGroupedCommittees] = useState([]);

  useEffect(() => {
    if (!committeeSites) {
      setGroupedCommittees([]);
      return;
    }

    const groupedCommitteeList = committeeSites.reduce((acc, committeeSite) => {
      const label = committeeSite.name; // Use committeeSite name as the label

      // Create the committee option
      const committeeOptions = committeeSite.committees.map(committee => ({
        id: committee.id,
        label: `${committeeSite.name} - ${committee.type} - ${committee.id}`,
        value: parseInt(committee.id, 10),
      }));

      // Add the committee options to the grouped list
      acc.push({
        label: label,
        options: committeeOptions,
      });

      return acc;
    }, []);

    setGroupedCommittees(groupedCommitteeList);
  }, [committeeSites]);

  return groupedCommittees;
};

// Deprecated: Get Supervisor Members
const useSupervisorMembers = (campaignRoles, campaignMembers) => {
  const supervisorRoleId = useMemo(() => {
    return campaignRoles.find(role => role.name === "campaignSupervisor")?.id;
  }, [campaignRoles]);

  const supervisorMembers = useMemo(() => {
    return campaignMembers.filter(member => member.role === supervisorRoleId);
  }, [campaignMembers, supervisorRoleId]);

  return supervisorMembers;
};

// Helper function to Show form fields based on selected role
const useCampaignRoleString = (roleId, roles) => {
  if (roleId == null) return null;
  const roleObj = roles.find((role) => role.id.toString() === roleId.toString());
  return roleObj ? roleObj.codename : null;
};

// Helper function to check if a member has a specific role
const isMemberRoleOption = (campaignRoles, roleCondition, roleId) => {
  const roleObj = campaignRoles.find(
    (role) => role.id.toString() === roleId.toString()
  );
  return roleObj ? roleCondition.includes(roleObj.codename) : false;
};


// Get Campaign Agent Committees
// Function to get Agent Member Committee Sites
const useAgentMemberCommitteeSites = (campaignAgentId, campaignMembers) => {
  const campaignAgentMember = campaignMembers.find(member => member.id === parseInt(campaignAgentId, 10));
  const agentMemberCommitteeSite = campaignAgentMember?.committeeSites || []
  return agentMemberCommitteeSite;
};




export {
  useMemberOptions,
  useCampaignRoles,
  getCampaignAgentMembers,
  getCommitteeSiteOptions,
  getAllCommittees,
  useAgentMemberCommitteeSites,
  useCommitteeOptions,
  useSupervisorMembers, // Deprecated: Keep for backward compatibility if needed
  useCampaignRoleString,
  isMemberRoleOption,
};

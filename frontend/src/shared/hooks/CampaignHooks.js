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
      label: item.name,
      value: parseInt(item.id, 10) // Ensure the value is an integer
    }));

    // Add the first option as "اختر الوكيل" with value null
    return [{ id: null, label: "اختر الوكيل", value: null }, ...options];
  }, [memberGroup]);
};

// Hook to get Campaign Roles based on permissions
const useCampaignRoleOptions = (campaignRoles, currentCampaignMember) => {
  const roleGroups = {
    managers: ["campaignModerator", "partyAdmin", "campaignCandidate", "campaignAdmin"],
    fieldMembers: ["campaignFieldAdmin", "campaignFieldAgent", "campaignFieldDelegate"],
    digitalMembers: ["campaignDigitalAdmin", "campaignDigitalAgent", "campaignDigitalDelegate"]
  };

  return useMemo(() => {
    const currentRole = currentCampaignMember?.roleCodename;

    let excludedRoleStrings = ["campaignMember"]; // Excluded for all by default

    switch (currentRole) {
      case "partyAdmin":
        excludedRoleStrings = ["campaignModerator", "partyAdmin"];
        break;
      case "campaignCandidate":
        excludedRoleStrings = roleGroups.managers.filter(role => role !== "campaignAdmin");
        break;
      case "campaignAdmin":
        excludedRoleStrings = [...roleGroups.managers];
        break;
      case "campaignFieldAdmin":
        excludedRoleStrings = [...roleGroups.managers, ...roleGroups.digitalMembers, "campaignFieldAdmin"];
        break;
      case "campaignFieldAgent":
        excludedRoleStrings = [...roleGroups.managers, ...roleGroups.digitalMembers, "campaignFieldAdmin", "campaignFieldAgent"];
        break;
      case "campaignDigitalAdmin":
        excludedRoleStrings = [...roleGroups.managers, ...roleGroups.fieldMembers, "campaignDigitalAdmin"];
        break;
      case "campaignDigitalAgent":
        excludedRoleStrings = [...roleGroups.managers, ...roleGroups.fieldMembers, "campaignDigitalAdmin", "campaignDigitalAgent"];
        break;
      default:
        break;
    }

    const displayedRoles = campaignRoles.filter(role => !excludedRoleStrings.includes(role.codename));

    // Convert roles to options
    const roleOptions = displayedRoles.map(role => ({
      id: role.id,
      label: role.name,
      value: role.id,
    }));

    return roleOptions;
  }, [campaignRoles, currentCampaignMember]);
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


// Function to get Agent Member Committee Sites
const getAgentMemberCommitteeSites = (campaignAgentId, campaignMembers) => {
  const campaignAgentMember = campaignMembers.find(member => member.id === parseInt(campaignAgentId, 10) || null);
  const agentMemberCommitteeSite = campaignAgentMember?.committeeSites || []
  return agentMemberCommitteeSite;
};

// Hook to get Committee Options
const getCommitteeOptions = (selectedSupervisor, campaignMembers, committeeSites) => {
  const campaignAgentCommittees = getAgentMemberCommitteeSites(selectedSupervisor, campaignMembers);

  const groupedCommittees = campaignAgentCommittees.reduce((acc, committeeSite) => {
    if (committeeSite && Array.isArray(committeeSite.committees)) {
      const label = committeeSite.name; // Use committeeSite name as the label

      // Create the committee option
      const committeeOptions = committeeSite.committees.map((committee) => ({
        id: committee.id,
        label: `${committeeSite.name} - ${committee.type} - ${committee.id}`,
        value: parseInt(committee.id, 10),
      }));

      // Add the committee options to the grouped list
      acc.push({
        label: label,
        options: committeeOptions,
      });
    }

    return acc;
  }, []);

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





export {
  useMemberOptions,
  useCampaignRoleOptions,
  getCampaignAgentMembers,
  getCommitteeSiteOptions,
  getAllCommittees,
  getAgentMemberCommitteeSites,
  getCommitteeOptions,
  useSupervisorMembers, // Deprecated: Keep for backward compatibility if needed
  useCampaignRoleString,
  isMemberRoleOption,
};

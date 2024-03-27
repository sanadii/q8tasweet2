import { useState, useEffect } from "react";

function useCampaignMemberRoles(roleName, campaignRoles = [], campaignMembers = []) {
    const [membersWithRole, setMembersWithRole] = useState([]);

    useEffect(() => {
        const foundRole = campaignRoles.find(roleObj => roleObj.name === roleName);
        const members = foundRole ? campaignMembers.filter(member => member.role === foundRole.id) : [];
        setMembersWithRole(members);
    }, [roleName, campaignRoles, campaignMembers]);

    return membersWithRole;
}

function useCurrentCampaignMemberRole(canChangeConfig, campaignRoles = [], currentCampaignMember = {}) {
    if (canChangeConfig) {
        return 'مدير النظام';
    } else {
        const roleObj = campaignRoles.find(role => role.id === currentCampaignMember.role);
        return roleObj?.name || 'مشترك';
    }
}

export { useCurrentCampaignMemberRole, useCampaignMemberRoles };

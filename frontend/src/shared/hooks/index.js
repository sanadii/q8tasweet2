// Components/Hooks/index.js

// Sockets
export { useWebSocket } from "./useWebSocket";
export { useChannelStatuses } from "./useChannelStatus";

// Users & Permissions
export { useProfile } from "./UserHooks";
export { usePermission } from "./usePermission";
export { useUserRoles } from "./useUserRoles";
export { useGroupManager } from "./GroupHook";

// Common
export { useFilter } from "./useFilter";

// Elections & Election Categories
export { useCategoryManager } from "./CategoryHooks";

<<<<<<< HEAD
=======
// Electors
export { useElectorData } from "./useElectorData"
export { useElectorDataSource } from "./useElectorDataSource"
>>>>>>> sanad

// Candidates

// Campaigns
<<<<<<< HEAD
export { useSupervisorMembers, useCampaignRoles } from "./CampaignHooks";
=======
export {
    useMemberOptions,
    useSupervisorMembers,
    useCampaignRoleOptions,
    getCommitteeSiteOptions,
    getAllCommittees,
    getAgentMemberCommitteeSites,
    getCommitteeOptions,
    getCampaignAgentMembers,
    useCampaignRoleString,
    isMemberRoleOption,
} from "./CampaignHooks";

>>>>>>> sanad
export { useCurrentCampaignMemberRole, useCampaignMemberRoles } from "./useCampaignMemberRoles";
export { calculatePercentage, calculateCampaignData, getAggregatedGuarantorData, constructStatusColumns, getStatusCountForMember, getBgClassForStatus } from "./campaignCalculation"

// Global
export { useDelete } from "./useDelete";
export { useFetchDataIfNeeded } from "./useFetchDataIfNeeded";
<<<<<<< HEAD
=======

// Forms
export { getFieldDynamicOptions } from "./FieldDynamicOptions";
export { getSelectedOptions, getFieldStaticOptions, getOptionBadge } from "./FieldStaticOptions"
>>>>>>> sanad

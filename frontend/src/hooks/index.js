// Components/Hooks/index.js

// Sockets
export { useWebSocket } from "./useWebSocket";

// Users & Permissions
export { useProfile } from "./UserHooks";
export { usePermission } from "./usePermission";
export { useUserRoles } from "./useUserRoles";
export { useGroupManager } from "./GroupHook";

// Common
export { useFilter } from "./useFilter";

// Elections & Election Categories
export { useCategoryManager } from "./CategoryHooks";


// Candidates

// Campaigns
export { useSupervisorMembers, useCampaignRoles } from "./CampaignHooks";
export { useCurrentCampaignMemberRole, useCampaignMemberRoles } from "./useCampaignMemberRoles";

// Global
export { useDelete } from "./useDelete";
export { useFetchDataIfNeeded } from "./useFetchDataIfNeeded";


// Socket
export { useChannelStatuses } from "./webSocket/useChannelStatus";
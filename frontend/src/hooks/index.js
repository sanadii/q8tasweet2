// Components/Hooks/index.js

// Sockets
export { useSocket } from "./useSocket";

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

// Global
export { useDelete } from "./useDelete";
export { useFetchDataIfNeeded } from "./useFetchDataIfNeeded";

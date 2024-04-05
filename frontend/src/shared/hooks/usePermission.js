// Components/Hooks/usePermission.js
import { useSelector } from 'react-redux';
import { userSelector, campaignSelector } from 'selectors';

// Define a List of Entities:
const entities = [
    'Config', 'User', 'Group', 'Permission',
    'Election', 'ElectionCandidate', 'ElectionCommittee', 'ElectionCommitteeResult',
    'Candidate',

    'Campaign', 'CampaignMember', 'CampaignGuarantee', 'CampaignAttendee',
    'CampaignModerator', 'CampaignCandidate', 'CampaignCoordinator', 'CampaignSupervisor',

    'Elector',
    'Area', 'Category', 'Tag',
];

// Define a List of Actions
const actions = ['canAdd', 'canView', 'canChange', 'canDelete'];

const computePermissions = (hasPermission) => {
    let permissionsObject = {};

    entities.forEach(entity => {
        actions.forEach(action => {
            const permission = `${action}${entity}`;
            permissionsObject[permission] = hasPermission(permission);
        });
    });

    return permissionsObject;
};


const usePermission = () => {
    const { currentUser } = useSelector(userSelector);
    const { currentCampaignMember } = useSelector(campaignSelector);

    // Extract permissions based on the user's roles
    const getPermissions = () => {
        const userPermissions = currentUser.permissions || [];
        const campaignPermissions = currentCampaignMember?.permissions || [];
        const combinedPermissions = [
            ...new Set([...userPermissions, ...campaignPermissions])
        ];
        return combinedPermissions;
    };

    const permissions = getPermissions();

    // Check if the user has a specific permission
    const hasPermission = (permission) => permissions.includes(permission);

    // Get the pre-computed permissions
    const specificPermissions = computePermissions(hasPermission);

    return {
        ...specificPermissions,  // spread out the specific permissions
        isActive: currentUser.isActive,  // add isActive flag
        isStaff: currentUser.isStaff,    // add isStaff flag
    };
};

export { usePermission };
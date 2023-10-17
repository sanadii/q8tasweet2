// Components/Hooks/usePermission.js
import { useSelector } from 'react-redux';
import { userSelector, campaignSelector } from 'Selectors';

// Define a List of Entities:
const entities = [
    'Configs', 'User', 'Group', 'Permission', 'ContentType',
    'Election', 'ElectionCandidate', 'ElectionCommittee', 'ElectionCommitteeResult',
    'Candidate',
    'Campaign', 'CampaignMember', 'CampaignGuarantee', 'CampaignAttendee',
    'Elector',
    'Area', 'Category', 'Tag',
    'OutStandingToken', 'LogEntry', 'Session', 'BlackListedToken',
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

    if (!currentUser) {
        return {
            isAdmin: false,
            isEditor: false,
            isContributor: false,
            isModerator: false,
            isSubscriber: false,
            // ... Add other defaults as needed.
        };
    }

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
        // hasPermission,
        ...specificPermissions,  // spread out the specific permissions
    };
};

export default usePermission;

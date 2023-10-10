// Components/Hooks/usePermission.js
import { useSelector } from 'react-redux';
import { electionsSelector } from '../../Selectors/electionsSelector';
import computePermissions from '../Utils/permissions'; // adjust the path accordingly

const usePermission = () => {
    const { currentUser, currentCampaignModerator, currentCampaignContributor, currentCampaignEditor, currentCampaignMember } = useSelector(electionsSelector);

    if (!currentUser || !currentUser.roles) {
        throw new Error("Current user or user roles are not available.");
    }

    const isAdmin = currentUser.roles.includes('isAdmin');
    const isEditor = currentUser.roles.includes('isEditor');
    const isModerator = currentUser.roles.includes('isModerator');
    const isContributor = currentUser.roles.includes('isContributor');
    const isSubscriber = currentUser.roles.includes('isSubscriber');

    // Extract permissions based on the user's roles
    const getPermissions = () => {
        if (isAdmin) return currentUser.permissions;
        if (isEditor) return currentCampaignEditor.permissions;
        if (isModerator) return currentCampaignModerator.permissions;
        if (isContributor) return currentCampaignContributor.permissions;
        return currentCampaignMember.rank.permissions;
    };

    const permissions = getPermissions();

    // Check if the user has a specific permission
    const hasPermission = (permission) => permissions.includes(permission);

    // Get the pre-computed permissions
    const specificPermissions = computePermissions(hasPermission);

    return {
        // hasPermission,
        ...specificPermissions,  // spread out the specific permissions
        isAdmin,
        isEditor,
        isContributor,
        isModerator,
        isSubscriber,
    };
};

export default usePermission;

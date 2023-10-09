// hooks/useCampaignPermission.js
import { useSelector } from 'react-redux';
import { electionsSelector } from '../../Selectors/electionsSelector';

const useCampaignPermission = () => {
    const { currentUser, currentCampaignModerator, currentCampaignMember } = useSelector(electionsSelector);

    // Extract permissions based on the user's roles
    const permissions = (() => {
        if (currentUser.roles.includes('isAdmin')) {
            return currentUser.permissions;
        } else if (currentUser.roles.includes('isModerator')) {
            return currentCampaignModerator.permissions;
        } else {
            return currentCampaignMember.rank.permissions;
        }
    })();

    // Check if the user has a specific permission
    const hasPermission = (permission) => {
        return permissions.includes(permission);
    };

    // Extract user roles for convenience
    const isAdmin = currentUser.roles.includes('isAdmin');
    const isModerator = currentUser.roles.includes('isModerator');
    const isContributor = !isAdmin && isModerator; // Modify this as per your logic

    return {
        hasPermission,
        isAdmin,
        isContributor,
        isModerator,
    };
};

export default useCampaignPermission;

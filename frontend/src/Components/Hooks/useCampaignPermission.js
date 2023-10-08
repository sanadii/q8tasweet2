// hooks/useCampaignPermission.js
import { useSelector } from 'react-redux';
import { electionsSelector } from '../../Selectors/electionsSelector';

const useCampaignPermission = () => {
    const { currentUser, currentCampaignModerator, currentCampaignMember } = useSelector(electionsSelector);

    // Initialize permissions based on the user's roles
    let permissions = [];

    if (currentUser.roles.includes('isAdmin')) {
        permissions = currentUser.permissions;
    } else if (currentUser.roles.includes('isModerator')) {
        permissions = currentCampaignModerator.permissions;
    } else {
        permissions = currentCampaignMember.rank.permissions;
    }

    // Define a function to check if the user has a specific permission
    const hasPermission = (permission) => {
        console.log(`Checking permission "${permission}"`);
        const has = permissions.includes(permission);
        console.log(`Has permission "${permission}": ${has}`);
        return has;
    };

    // Export the constants for specific roles
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

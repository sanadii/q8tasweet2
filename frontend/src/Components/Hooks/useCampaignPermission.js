// hooks/useUserRoles.js
// React & Redux core
import { useSelector } from 'react-redux';

// Store & Selectors
import { electionsSelector } from '../../Selectors/electionsSelector';

const useCampaignPermission = () => {
    const { currentUser, currentCampaignModerator, currentCampaignMember } = useSelector(electionsSelector);

    let permissions = {};

    if (currentUser.roles.isAdmin) {
        permissions = currentUser.permissions;
    } else if (currentUser.roles.isContributor) {
        permissions = currentCampaignModerator.permissions;
    } else {
        permissions = currentCampaignMember.rank.permissions;
    }

    return {
        hasPermission: (permission) => permissions[permission],
    };
};

export default useCampaignPermission;

import { useSelector } from 'react-redux';
import { electionsSelector } from '../../Selectors/electionsSelector';
import { ROLES } from '../constants/roles';

const useCampaignPermission = () => {
    const { currentUser, currentCampaignModerator, currentCampaignMember } = useSelector(electionsSelector);

    const isAdmin = currentUser.roles.includes(ROLES.ADMIN);
    const isModerator = currentUser.roles.includes(ROLES.MODERATOR);
    const isContributor = !isAdmin && isModerator;  // Modify this as per your logic

    let permissions = [];
    if (isAdmin) {
        permissions = currentUser.permissions;
    } else if (isModerator) {
        permissions = currentCampaignModerator.permissions;
    } else {
        permissions = currentCampaignMember.rank.permissions;
    }

    const hasPermission = (permission) => permissions.includes(permission);

    return {
        hasPermission,
        isAdmin,
        isContributor,
        isModerator,
    };
};

export default useCampaignPermission;

// hooks/useUserRoles.js
// React & Redux core
import { useSelector } from 'react-redux';

// Store & Selectors
import { electionsSelector } from '../../Selectors/electionsSelector';

const useUserRoles = () => {
    const { currentUser, currentCampaignUser } = useSelector(electionsSelector);
    const rank = currentCampaignUser?.rank;

    // If user is an admin, don't evaluate subscriber roles
    if (currentUser?.isStaff === true) {
        return {
            isAdmin: true,
            isSubscriber: false,
        };
    }
    
    // canEditCampaign,
    // canViewGuarantees,
    // canViewGuarantees,
    // canViewAttendees,
    // canViewSorting,

    // If user is not an admin, evaluate subscriber roles
    return {
        isAdmin: false,
        isSubscriber: true,
        isModerator: rank === 10,
        isParty: rank === 1,
        isCandidate: rank === 2,
        isSupervisor: rank === 3,
        isGuarantor: rank === 4,
        isAttendant: rank === 5,
        isSorter: rank === 6,
        isBelowSupervisor: rank > 3,
        isAttendantOrSorter: [5, 6].includes(rank),
    };
}

export default useUserRoles;

// hooks/useUserRoles.js
// React & Redux core
import { useSelector } from 'react-redux';

// Store & Selectors
import { userSelector, campaignSelector } from 'Selectors';

const useUserRoles = () => {
    const { currentUser } = useSelector(userSelector);
    const { currentCampaignModerator, currentCampaignMember } = useSelector(campaignSelector);
    const role = currentCampaignMember?.role;

    // If user is an admin, don't evaluate subscriber roles
    if (currentUser?.isStaff === true) {
        return {
            isAdmin: true,
            isSubscriber: false,
        };
    }
    // If user is not an admin, evaluate subscriber roles
    return {
        isAdmin: false,
        isSubscriber: true,
        isModerator: role === 10,
        isParty: role === 1,
        isCandidate: role === 2,
        isSupervisor: role === 3,
        isGuarantor: role === 4,
        isAttendant: role === 5,
        isSorter: role === 6,
        isBelowSupervisor: role > 3,
        isAttendantOrSorter: [5, 6].includes(role),
    };
}

export default useUserRoles;

// hooks/useUserRoles.js

import { useSelector } from 'react-redux';  // Assuming you're using Redux

const useUserRoles = () => {
    const currentUser = useSelector(state => state.Users.currentUser);
    const currentMember = useSelector(state => state.Campaigns.currentCampaignMember);

    return {
        // Staff Roles
        isAdmin: currentUser?.isStaff === true,
        isSubscriber: currentUser?.isStaff === false,

        // Subscriber Roles
        isModerator: currentMember?.rank === 10,
        isParty: currentMember?.rank === 1,
        isCandidate: currentMember?.rank === 2,
        isSupervisor: currentMember?.rank === 3,
        isGuarantor: currentMember?.rank === 4,
        isAttendant: currentMember?.rank === 5,
        isSorter: currentMember?.rank === 6,
        isBelowSupervisor: currentMember?.rank > 3,
        isAttendantOrSorter: currentMember?.rank === 5 || currentMember?.rank === 6,
    };
}

export default useUserRoles;

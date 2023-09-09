// hooks/useUserRoles.js

import { useSelector } from 'react-redux';  // Assuming you're using Redux

const useUserRoles = () => {
    const currentUser = useSelector(state => state.Users.currentUser);

    return {
        isAdmin: currentUser?.is_staff === true,
        isSubscriber: currentUser?.is_staff === false
    };
}

export default useUserRoles;

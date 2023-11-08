// PermissionsContext.js
import React, { createContext, useContext } from 'react';
import usePermission from './hooks/usePermission';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
    const permissionsHook = usePermission();
    return (
        <PermissionsContext.Provider value={permissionsHook}>
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = () => {
    const context = useContext(PermissionsContext);
    if (!context) {
        throw new Error('usePermissions must be used within a PermissionsProvider');
    }
    return context;
};

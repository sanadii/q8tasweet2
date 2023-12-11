export const messageTypes = [
    {
        type: 'primary',
        color: 'primary',
        className: 'alert-solid alert-dismissible bg-primary text-white alert-label-icon',
        iconClass: 'ri-user-smile-line',
        label: 'Primary'
    },
    {
        type: 'secondary',
        color: 'secondary',
        className: 'alert-solid alert-dismissible bg-secondary text-white alert-label-icon',
        iconClass: 'ri-check-double-line',
        label: 'Secondary'
    },
    {
        type: 'success',
        color: 'success',
        className: 'alert-solid alert-dismissible bg-success text-white alert-label-icon',
        iconClass: 'ri-notification-off-line',
        label: 'Success'
    },
    {
        type: 'danger',
        color: 'danger',
        className: 'alert-solid alert-dismissible bg-danger text-white alert-label-icon',
        iconClass: 'ri-error-warning-line',
        label: 'Danger'
    },
    {
        type: 'warning',
        color: 'warning',
        className: 'alert-solid alert-dismissible bg-warning text-white alert-label-icon',
        iconClass: 'ri-alert-line',
        label: 'Warning'
    },
    {
        type: 'info',
        color: 'info',
        className: 'alert-solid alert-dismissible bg-info text-white alert-label-icon',
        iconClass: 'ri-airplay-line',
        label: 'Info'
    },
    {
        type: 'light',
        color: 'light',
        className: 'alert-solid alert-dismissible bg-light text-white alert-label-icon',
        iconClass: 'ri-mail-line',
        label: 'Light'
    },
    {
        type: 'dark',
        color: 'dark',
        className: 'alert-solid alert-dismissible bg-dark text-white alert-label-icon',
        iconClass: 'ri-refresh-line',
        label: 'Dark'
    },
];


// This is used to differentiation [userGroups] to specific channel in the backend
export const socketChannels = [
    'Global',
    'Client',
    // 'Campaign',
    // 'Elections',
    // 'Candidate',
    // 'Chat',
];

export const notificationGroup = [
    'users',        // userGroups
    'elections',     // electionSlug
    'campaigns',     // All active / Active campaignSlug
];

export const dataTypes =
    [
        'notification',
        'electionSort',
        'campaignUpdate',
        'chat',
    ];

export const userGroups = [
    {
        id: '1',
        label: 'All Users',
        value: 'allUsers',
    },
    {
        id: '2',
        label: 'Admin Users',
        value: 'adminUsers',
    },
    {
        id: '3',
        label: 'Non Admin Users',
        value: 'nonAdminUsers',
    },
    {
        id: '4',
        label: 'Registered Users',
        value: 'registeredUsers',
    },
];
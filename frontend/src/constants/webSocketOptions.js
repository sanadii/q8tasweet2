export const messageTypes = [
    {
        id: '1',
        label: 'Info',
        value: 'info',
        color: 'info',
        className: 'alert-solid alert-dismissible bg-info text-white alert-label-icon',
        iconClass: 'ri-airplay-line',
    },
    {
        id: '2',
        value: 'warning',
        color: 'warning',
        className: 'alert-solid alert-dismissible bg-warning text-white alert-label-icon',
        iconClass: 'ri-alert-line',
        label: 'Warning'
    },
    {
        id: '3',
        label: 'Danger',
        value: 'danger',
        color: 'danger',
        className: 'alert-solid alert-dismissible bg-danger text-white alert-label-icon',
        iconClass: 'ri-error-warning-line',
    },
    {
        id: '4',
        label: 'Success',
        value: 'success',
        color: 'success',
        className: 'alert-solid alert-dismissible bg-success text-white alert-label-icon',
        iconClass: 'ri-notification-off-line',
    },
];


// This is used to differentiation [userGroups] to specific channel in the backend
export const socketChannels = [
    'Global',
    'Client',
];

export const dataGroup = [
    {
        id: '1',
        label: 'Users',
        value: 'users',
    },
    {
        id: '2',
        label: 'Elections',
        value: 'elections',
    },
    {
        id: '3',
        label: 'Campaigns',
        value: 'campaigns',
    }
];

export const dataTypes =
    [
        'notification',
        'electionSorting',
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
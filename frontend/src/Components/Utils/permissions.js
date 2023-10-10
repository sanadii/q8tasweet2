// permissions.js

// Define a List of Entities:
const entities = [
    // System
    'OutStandingToken',
    'LogEntry',
    'Session',
    'ContentType',
    'Permission',
    'Group',
    'BlackListedToken',

    // Elections
    'Election',
    'ElectionCandidate',
    'ElectionCommittee',
    'ElectionCommitteeResult',

    // Candidates
    'Candidate',

    // Campaigns
    'Campaign',
    'CampaignMember',
    'CampaignGuarantee',
    'CampaignAttendee',

    // Electors
    'Elector',

    // Users
    'User',

    // Others
    'Configs',
    'Area',
    'Category',
    'Tag',
];



// Define a List of Actions
const actions = ['canAdd', 'canView', 'canChange', 'canDelete'];

const computePermissions = (hasPermission) => {
    let permissionsObject = {};

    entities.forEach(entity => {
        actions.forEach(action => {
            const permission = `${action}${entity}`;
            permissionsObject[permission] = hasPermission(permission);
        });
    });

    return permissionsObject;
};

export default computePermissions;

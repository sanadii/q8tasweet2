# core/adminReorder.py
ADMIN_REORDER = (
    # Keep original label and models
    'sites',

    # Election
    {'app': 'restapi', 'label': 'Election', 'models': (
        'restapi.Election',
        'restapi.ElectionCandidate',
        'restapi.ElectionCommittee',
        'restapi.ElectionCommitteeResult'
    )},

    # Candidate
    {'app': 'restapi', 'label': 'Candidate', 'models': (
        'restapi.Candidate',
    )},

    # Campaign
    {'app': 'restapi', 'label': 'Campaign', 'models': (
        'restapi.Campaign',
        'restapi.CampaignMember',
        'restapi.CampaignGuarantee',
        'restapi.CampaignAttendee'
    )},

    # Elector
    {'app': 'restapi', 'label': 'Elector', 'models': (
        'restapi.Elector',
    )},

    # Taxonomy
    {'app': 'restapi', 'label': 'Taxonomies', 'models': (
        'restapi.Category',
        'restapi.Tag',
        'restapi.Area',
    )},
    
    # Auth
    {'app': 'auth', 'label': 'Authorisation','models': (
        'restapi.User',
        'auth.Group',
    )},

    # Configurations
    {'app': 'restapi', 'label': 'Configurations','models': (
        'restapi.Config',
    )},
)

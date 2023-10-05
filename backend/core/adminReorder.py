# core/adminReorder.py
ADMIN_REORDER = (
    # Keep original label and models
    'sites',

    # Elections
    {'app': 'restapi', 'label': 'Elections', 'models': (
        'restapi.Elections',
        'restapi.ElectionCandidates',
        'restapi.ElectionCommittees',
        'restapi.ElectionCommitteeResults'
    )},

    # Candidates
    {'app': 'restapi', 'label': 'Candidates', 'models': (
        'restapi.Candidates',
    )},

    # Campaigns
    {'app': 'restapi', 'label': 'Campaigns', 'models': (
        'restapi.Campaigns',
        'restapi.CampaignMembers',
        'restapi.CampaignGuarantees',
        'restapi.CampaignAttendees'
    )},

    # Electors
    {'app': 'restapi', 'label': 'Electors', 'models': (
        'restapi.Electors',
    )},

    # Taxonomy
    {'app': 'restapi', 'label': 'Taxonomies', 'models': (
        'restapi.Categories',
        'restapi.Tags',
        'restapi.Areas',
    )},
    
    # Auth
    {'app': 'auth', 'label': 'Authorisation','models': (
        'restapi.User',
        'auth.Group',
    )},

    # Configurations
    {'app': 'restapi', 'label': 'Configurations','models': (
        'restapi.Configs',
    )},
)

# core/adminReorder.py
ADMIN_REORDER = (
    # Keep original label and models
    'sites',

    # Election
    {'app': 'elections', 'label': 'Election', 'models': (
        'apps.election.Election',
        'apps.election.ElectionCandidate',
        'apps.election.ElectionCommittee',
        'apps.election.ElectionCommitteeResult'
    )},

    # Candidate
    {'app': 'candidates', 'label': 'Candidate', 'models': (
        'apps.candidates.Candidate',
    )},

    # Campaign
    {'app': 'campaigns', 'label': 'Campaign', 'models': (
        'apps.campaigns.Campaign',
        'apps.campaigns.CampaignMember',
        'apps.campaigns.CampaignGuarantee',
        'apps.campaigns.CampaignAttendee'
    )},

    # Voter
    {'app': 'voters', 'label': 'Voter', 'models': (
        'appas.voters.Voter',
    )},

    # Taxonomy
    {'app': 'categories', 'label': 'Taxonomies', 'models': (
        'apps.categories.Category',
        'apps.categories.Tag',
        'apps.categories.Area',
    )},
    
    # Auth
    {'app': 'auth', 'label': 'Authorisation','models': (
        'apps.auths.User',
        'apps.auths.Group',
        'apps.auths.Permission',
    )},

    # Configurations
    {'app': 'configs', 'label': 'Configurations','models': (
        'apps.configs.Configs',
    )},
)

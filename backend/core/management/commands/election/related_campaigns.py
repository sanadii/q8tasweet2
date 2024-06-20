import pandas as pd
from apps.elections.candidates.models import ElectionCandidate
from apps.campaigns.models import Campaign
from ..utils.helper import read_excel_file, check_required_columns
from ..utils.logging import log_reading_file, log_imported_fields, log_error

def import_election_related_campaigns(file_name, file_path, command):
    log_reading_file(command, file_name, file_path, "campaign")
    campaign_sheet_name = "campaign"
    required_data_campaign = [
        "id", "candidate", "description", "target_votes", "twitter", "instagram", "website"
    ]

    df_campaign = read_excel_file(file_path, campaign_sheet_name, required_data_campaign, command)
    if df_campaign is None or not check_required_columns(df_campaign, required_data_campaign, command):
        log_error(command, f"Missing required columns in DataFrame. Required: {required_data_campaign}, Found: {df_campaign.columns.tolist() if df_campaign is not None else 'None'}")
        return []

    log_imported_fields(command, df_campaign)

    created_campaigns = []

    for _, row in df_campaign.iterrows():
        candidate_id = row["candidate"]
        try:
            election_candidates = ElectionCandidate.objects.filter(candidate_id=candidate_id)
            if election_candidates.exists():
                for election_candidate in election_candidates:
                    campaign = create_update_campaign(election_candidate, row, command)
                    if campaign:
                        command.stdout.write(command.style.SUCCESS(f"Campaign ID {campaign.id} for ElectionCandidate ID {election_candidate.id}"))
                        created_campaigns.append(campaign)
            else:
                log_error(command, f"ElectionCandidate for Candidate ID {candidate_id} does not exist. Skipping.")
        except Exception as e:
            log_error(command, f"An error occurred while processing Candidate ID {candidate_id}: {str(e)}")
            continue

    return created_campaigns

def create_update_campaign(election_candidate, row, command):
    # Try to find an existing campaign
    campaign, created = Campaign.objects.update_or_create(
        election_candidate=election_candidate,
        defaults={
            'description': row.get('description', ''),
            'target_votes': row.get('target_votes', 0),
            'twitter': row.get('twitter', ''),
            'instagram': row.get('instagram', ''),
            'website': row.get('website', '')
        }
    )
    
    action = "Created" if created else "Updated"
    command.stdout.write(command.style.SUCCESS(f"{action} Campaign for ElectionCandidate ID {election_candidate.id}"))
    
    return campaign

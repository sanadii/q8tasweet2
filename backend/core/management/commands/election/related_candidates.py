import pandas as pd
from apps.elections.candidates.models import ElectionCandidate
from apps.candidates.models import Candidate
from ..utils.helper import read_excel_file, check_required_columns, import_objects_from_df
from ..utils.logging import log_reading_file, log_imported_fields, log_import_summary, log_error

def import_election_related_candidates(file_name, file_path, election_id, command):
    log_reading_file(command, file_name, file_path, "candidates")

    required_data_candidate = [
        "id", "slug", "name", "denomination", "family", "tribe", "gender", "image",
        "status", "priority", "tags",
    ]

    required_data_election_candidate = [
        "position", "votes", "result", "notes"
    ]

    df_candidates = read_excel_file(file_path, "candidates", required_data_candidate + required_data_election_candidate, command)
    if df_candidates is None or not check_required_columns(df_candidates, required_data_candidate, command):
        log_error(command, f"Missing required columns in DataFrame. Required: {required_data_candidate}, Found: {df_candidates.columns.tolist() if df_candidates is not None else 'None'}")
        return []

    log_imported_fields(command, df_candidates)

    missing_columns = [col for col in required_data_candidate if col not in df_candidates.columns]
    if missing_columns:
        log_error(command, f"Missing columns in DataFrame: {missing_columns}")
        return []

    created_count, updated_count, processed_candidates = import_objects_from_df(df_candidates[required_data_candidate], Candidate, command)
    log_import_summary(command, "candidates", created_count, updated_count)

    election_candidates = update_election_candidates(df_candidates, election_id, command)

    command.stdout.write(command.style.SUCCESS("ElectionCandidate update completed."))

    return election_candidates

def update_election_candidates(df, election_id, command):
    created_count = 0
    updated_count = 0
    election_candidates = []

    for _, row in df.iterrows():
        candidate_id = row["id"]
        try:
            candidate = Candidate.objects.get(id=candidate_id)
        except Candidate.DoesNotExist:
            log_error(command, f"Candidate with ID {candidate_id} does not exist. Skipping.")
            continue

        election_candidate, created = ElectionCandidate.objects.update_or_create(
            candidate=candidate,
            election_id=election_id,
            defaults={
                'position': row['position'] if 'position' in row and pd.notna(row['position']) else None,
                'result': row['result'] if 'result' in row and pd.notna(row['result']) else None,
                'votes': row['votes'] if 'votes' in row and pd.notna(row['votes']) else None,
                'notes': row['notes'] if 'notes' in row and pd.notna(row['notes']) else None,
            }
        )
        action = "Created" if created else "Updated"
        command.stdout.write(command.style.SUCCESS(f"{action} ElectionCandidate for Candidate ID {candidate.id}"))

        election_candidates.append(election_candidate)

        if created:
            created_count += 1
        else:
            updated_count += 1

    log_import_summary(command, "ElectionCandidate", created_count, updated_count)
    command.stdout.write(command.style.SUCCESS(f"ElectionCandidates: {election_candidates}"))
    return election_candidates

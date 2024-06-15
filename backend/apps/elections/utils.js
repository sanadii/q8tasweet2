<<<<<<< HEAD
# utils.py

def get_election_committee_results(committees):
    transformed_results = {}

    # Get a list of all candidate IDs
    all_candidates = ElectionCandidate.objects.all()
    all_candidate_ids = [str(candidate.id) for candidate in all_candidates]

    # Create a dictionary to store total votes for each candidate
    total_votes_per_candidate = {candidate_id: 0 for candidate_id in all_candidate_ids}

    for committee in committees:
        committee_id = str(committee["id"])
        committee_results = ElectionCommitteeResult.objects.filter(election_committee=committee_id)
        results_serializer = ElectionCommitteeResultSerializer(committee_results, many=True)

        # Initialize the committee in the results with default votes for each candidate
        transformed_results[committee_id] = {candidate_id: 0 for candidate_id in all_candidate_ids}

        for result in results_serializer.data:
            candidate_id = str(result["election_candidate"])
            votes = result["votes"]

            # Update votes for the current candidate in the current committee
            transformed_results[committee_id][candidate_id] = votes

            # Update total votes for the candidate
            total_votes_per_candidate[candidate_id] += votes

    # Sort candidates based on total votes
    sorted_candidates_by_votes = sorted(total_votes_per_candidate, key=total_votes_per_candidate.get)

    # Reconstruct the results based on sorted candidate order
    sorted_transformed_results = {}
    for committee_id, results in transformed_results.items():
        sorted_transformed_results[committee_id] = {candidate_id: results[candidate_id] for candidate_id in sorted_candidates_by_votes}

    return sorted_transformed_results
=======
// # utils.py

// def get_election_committee_results(committees):
//     transformed_results = {}

//     # Get a list of all candidate IDs
//     all_candidates = ElectionCandidate.objects.all()
//     all_candidate_ids = [str(candidate.id) for candidate in all_candidates]

//     # Create a dictionary to store total votes for each candidate
//     total_votes_per_candidate = {candidate_id: 0 for candidate_id in all_candidate_ids}

//     for committee in committees:
//         committee_id = str(committee["id"])
//         committee_results = ElectionCommitteeResult.objects.filter(election_committee=committee_id)
//         results_serializer = ElectionCommitteeResultSerializer(committee_results, many=True)

//         # Initialize the committee in the results with default votes for each candidate
//         transformed_results[committee_id] = {candidate_id: 0 for candidate_id in all_candidate_ids}

//         for result in results_serializer.data:
//             candidate_id = str(result["election_candidate"])
//             votes = result["votes"]

//             # Update votes for the current candidate in the current committee
//             transformed_results[committee_id][candidate_id] = votes

//             # Update total votes for the candidate
//             total_votes_per_candidate[candidate_id] += votes

//     # Sort candidates based on total votes
//     sorted_candidates_by_votes = sorted(total_votes_per_candidate, key=total_votes_per_candidate.get)

//     # Reconstruct the results based on sorted candidate order
//     sorted_transformed_results = {}
//     for committee_id, results in transformed_results.items():
//         sorted_transformed_results[committee_id] = {candidate_id: results[candidate_id] for candidate_id in sorted_candidates_by_votes}

//     return sorted_transformed_results
>>>>>>> sanad

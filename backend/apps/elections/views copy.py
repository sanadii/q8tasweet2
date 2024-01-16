# Before removing candidate vote calulation & commitee results (after updating the models for calcuation)
# class GetElectionDetails(APIView):
#     def get(self, request, id):
#         election = get_object_or_404(Election, id=id)
        
#         # Passing the context with the request to the serializer
#         context = {"request": request}

#         # Getting candidats, committees and campaigns only once
#         election_candidates = ElectionCandidate.objects.filter(election=election)
#         election_committees = ElectionCommittee.objects.filter(election=election)
#         # election_campaigns = Campaign.objects.filter(election=election)

#         return Response({
#             "data": {
#                 "electionDetails": self.get_election_data(election, context),
#                 "electionCandidates": self.get_election_candidates(election, election_candidates, context),
#                 "electionCommittees": self.get_election_committees(election_committees, context),
#                 "electionResults": self.get_election_committee_results(election, election_committees),
#                 "electionCampaigns": self.get_election_campaigns_for_election(election, context),
#             },
#             "code": 200
#         })

#     def get_election_data(self, election, context):
#         return ElectionSerializer(election, context=context).data

#     def get_election_candidates(self, election, election_candidates, context):

#         # Process the queryset object before serialization
#         for candidate in election_candidates:
#             related_results = candidate.committee_result_candidates.all()
#             total_votes = sum([result.votes for result in related_results]) or 0
#             candidate.total_votes = total_votes  # assuming total_votes is a property of ElectionCandidate
        
#         # sort before serialization
#         election_candidates = sorted(election_candidates, key=lambda x: x.total_votes, reverse=True)
        
#         # Now serialize
#         election_candidates_serialized = ElectionCandidateSerializer(election_candidates, many=True, context=context).data
        
#         number_of_seats = election.seats or 0
#         for idx, candidate in enumerate(election_candidates_serialized, start=1):
#             candidate["position"] = str(idx)
#             candidate["is_winner"] = idx <= number_of_seats
        
#         return election_candidates_serialized

#     def get_election_committees(self, election_committees, context):
#         return ElectionCommitteeSerializer(election_committees, many=True, context=context).data

#     # Showing Committee Results for Candidate of This Election Only
#     def get_election_committee_results(self, election, election_committees):
        
#         transformed_results = {}
#         all_candidates = ElectionCandidate.objects.filter(election=election).prefetch_related("committee_result_candidates", "candidate_campaigns")

#         candidate_data = {str(candidate.id): {"votes": 0, "position": None} for candidate in all_candidates}
        
#         for committee in election_committees:
#             committee_id = str(committee.id)
#             transformed_results[committee_id] = {candidate_id: 0 for candidate_id in candidate_data.keys()}
            
#             for candidate in all_candidates:
#                 for result in candidate.committee_result_candidates.all():
#                     if result.election_committee_id == committee_id:
#                         candidate_id = str(result.election_candidate_id)
#                         votes = result.votes
#                         transformed_results[committee_id][candidate_id] = votes
#                         candidate_data[candidate_id]["votes"] += votes
        
#         sorted_candidates = sorted(candidate_data.keys(), key=lambda cid: (candidate_data[cid]["position"], candidate_data[cid]["votes"]), reverse=True)
        
#         sorted_transformed_results = {}
#         for committee_id, results in transformed_results.items():
#             sorted_transformed_results[committee_id] = {candidate_id: results[candidate_id] for candidate_id in sorted_candidates}
        
#         return sorted_transformed_results


#     def get_election_campaigns_for_election(self, election, context):
#         election_candidate_ids = election.electioncandidates_set.values_list("id", flat=True)
#         election_campaigns = Campaign.objects.filter(election_candidate__in=election_candidate_ids)
#         return CampaignSerializer(election_campaigns, many=True, context=context).data


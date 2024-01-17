# Election Database

## electingMethod
**Description:** 
Defines the voting system used in the election. Each method has distinct characteristics in terms of how votes are cast and counted.

- **candidateOnlySystem**: Electors vote exclusively for individual candidates. Ideal for elections focusing on candidate merits.
- **partyOnlySystem**: Voting is restricted to political parties. This system emphasizes party policies over individual candidates.
- **combinedCandidatePartySystem**: A hybrid system allowing votes for both parties and individual candidates, offering a blend of the two approaches.
- **proportionalRepresentationSystem**: Seats are distributed based on the proportion of votes each party secures, ensuring a more representative allocation.
- **mixedElectoralSystem**: Merges majoritarian and proportional elements, catering to both individual candidate and party preferences.
- **singleTransferableVoteSystem**: A preferential system where voters rank candidates. Votes are redistributed based on these preferences until all seats are filled.

## electionResult
**Description:** 
Details how election results are formatted and displayed. The structure combines primary and secondary types, with an additional sorting parameter for real-time updates.

### Result Types
- **total**: Shows cumulative election results. Used for presenting final, conclusive outcomes.
- **detailed**: Offers a breakdown of results by committees or stages, suitable for complex elections with multiple phases.

### Party Result Type
(Used for PartyOnlySystem and CombinedCandidatePartySystem)
- **combinedPartyCandidate**: Focuses solely on individual candidate votes, omitting party-based results.
- **candidateOnly**: Focuses solely on individual candidate votes, omitting party-based results.
- **partyOnly**: Provides insights into party-based voting patterns, essential in block voting scenarios.



### Sorting Status
- **true**: For live sorting and updates during vote counting, offering a dynamic view of the evolving results.
- **false**: Indicates finalized results, be it 'Total' or 'Detailed', signifying the end of the vote counting process.

### Examples
- Final results with party data: `{"resultType": "total", "partyResultType": "partyVotingResults", "sorting_status": false}`
- Live, detailed results, candidate-focused: `{"election_result": "detailed", "election_party_result": "candidateOnly" , "election_sorting_result": true}`

### Implementation Notes
- The `resultType` structure is designed for versatility in representing different election result scenarios.
- Validating the JSON structure is crucial for ensuring data consistency and alignment with frontend display requirements.
- This approach aims to provide a nuanced and comprehensive depiction of election results, adaptable to various election formats.



<!-- DATABASE -->
class ElectionTypeOptions(models.TextChoices):
    CANDIDATE_ONLY_SYSTEM = 'COS', _('Candidate Only System')
    PARTY_ONLY_SYSTEM = 'POS', _('Party Only System')
    COMBINED_CANDIDATE_PARTY_SYSTEM = 'CCPS', _('Combined Candidate Party System')
    PROPORTIONAL_REPRESENTATION_SYSTEM = 'PRS', _('Proportional Representation System')
    MIXED_ELECTORAL_SYSTEM = 'MES', _('Mixed Electoral System')
    SINGLE_TRANSFERABLE_VOTE_SYSTEM = 'STVS', _('Single Transferable Vote System')

class ElectionResultsOptions(models.TextChoices):
    TOTAL = 'Total', _('Total')
    DETAILED = 'Detailed', _('Detailed')
    PARTY_VOTING_RESULTS = 'PVR', _('Party Voting Results')
    INDIVIDUAL_ONLY = 'IO', _('Individual Only')
    # Add other options as needed


class Election(models.Model):
    # ... other fields ...

    election_method = models.CharField(
        max_length=50,
        choices=ElectionTypeOptions.choices,
        blank=True,
        null=True,
        verbose_name="Election Type"
    )
    election_result = models.CharField(
        max_length=50,
        choices=ElectionResultsOptions.choices,
        blank=True,
        null=True,
        verbose_name="Election Result Type"
    )

    # ... rest of your model ...

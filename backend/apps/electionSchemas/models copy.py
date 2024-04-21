from django.db import models

GENDER_CHOICES = [
    ('1', 'Male'),
    ('2', 'Female'),
]

class ElectionCommittee(models.Model):
    serial = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    circle = models.CharField(max_length=255, blank=True, null=True)
    area = models.CharField(max_length=255, blank=True, null=True)
    area_name = models.CharField(max_length=255, blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    voter_count = models.IntegerField(blank=True, null=True)
    committee_count = models.IntegerField(blank=True, null=True)
    tag = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "election_committee"
        verbose_name = "Election Committe"
        verbose_name_plural = "Election Committes"
        default_permissions = []
        permissions  = [
            ("canViewElectionCommittes", "Can View Election Committes"),
            ("canAddElectionCommitte", "Can Add Election Committe"),
            ("canChangeElectionCommitte", "Can Change Election Committe"),
            ("canDeleteElectionCommitte", "Can Delete Election Committe"),
            ]
    def __str__(self):
        return self.name


class ElectionCommitteeSubset(models.Model):
    area_name = models.TextField(blank=True, null=True)
    letters = models.TextField(blank=True, null=True)
    committee = models.ForeignKey(ElectionCommittee, on_delete=models.CASCADE, related_name='CommitteSubsetes')
    type = models.TextField(max_length=25, blank=True, null=True)
    main = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = "election_committee_subset"
        verbose_name = "Election Committe Subset"
        verbose_name_plural = "Election Subsets"
        default_permissions = []
        permissions  = [
            ("canViewElectionCommitteSubsets", "Can View Election Committe Subsets"),
            ("canAddElectionCommitteSubset", "Can Add Election Committe Subset"),
            ("canChangeElectionCommitteSubset", "Can Change Election Committe Subset"),
            ("canDeleteElectionCommitteSubset", "Can Delete Election Committe Subset"),
            ]
    def __str__(self):
        return self.name
    
    def __init__(self, *args, **kwargs):
        schema_name = kwargs.pop('schema_name', 'public')  # Default to 'public' schema
        super().__init__(*args, **kwargs)
        self._meta.db_table = f'"{schema_name}"."election_committee"'


class ElectionElector(models.Model):
    full_name = models.TextField(blank=True, null=True)
    first_name = models.TextField(blank=True, null=True)
    second_name = models.TextField(blank=True, null=True)
    third_name = models.TextField(blank=True, null=True)
    fourth_name = models.TextField(blank=True, null=True)
    fifth_name = models.TextField(blank=True, null=True)
    sixth_name = models.TextField(blank=True, null=True)
    seventh_name = models.TextField(blank=True, null=True)
    eighth_name = models.TextField(blank=True, null=True)
    ninth_name = models.TextField(blank=True, null=True)
    tenth_name = models.TextField(blank=True, null=True)
    eleventh_name = models.TextField(blank=True, null=True)
    twelveth_name = models.TextField(blank=True, null=True)
    last_name = models.TextField(blank=True, null=True)
    tribe = models.TextField(blank=True, null=True)
    family = models.TextField(blank=True, null=True)
    sect = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    circle = models.TextField(blank=True, null=True)
    job = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    area = models.TextField(blank=True, null=True)
    block = models.TextField(blank=True, null=True)
    street = models.TextField(blank=True, null=True)
    lane = models.TextField(blank=True, null=True)
    house = models.TextField(blank=True, null=True)
    column6 = models.TextField(blank=True, null=True)
    committee_subset = models.ForeignKey(ElectionCommitteeSubset, on_delete=models.CASCADE, blank=True, null=True)
    national_table_name = models.TextField(blank=True, null=True)
    status_code = models.TextField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    committee = models.TextField(blank=True, null=True)
    letter = models.TextField(blank=True, null=True)
    code_char = models.TextField(blank=True, null=True)
    # check = models.TextField(blank=True, null=True)
    vote = models.TextField(blank=True, null=True)
    groups = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "election_electors"
        verbose_name = "Election Electors"
        verbose_name_plural = "Election Electorss"
        default_permissions = []
        permissions  = [
            ("canViewElectionElectors", "Can View Election Electors"),
            ("canAddElectionElectors", "Can Add Election Electors"),
            ("canChangeElectionElectors", "Can Change Election Electors"),
            ("canDeleteElectionElectors", "Can Delete Election Electors"),
            ]
    def __str__(self):
        return self.name

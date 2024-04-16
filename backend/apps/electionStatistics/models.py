from django.db import models

GENDER_CHOICES = [
    ('1', 'Male'),
    ('2', 'Female'),
]

class Committee(models.Model):
    serial = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    circle = models.CharField(max_length=255, blank=True, null=True)
    area = models.CharField(max_length=255, blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    voter_count = models.IntegerField(blank=True, null=True)
    committee_count = models.IntegerField(blank=True, null=True)
    total_voters = models.IntegerField(blank=True, null=True)
    tag = models.TextField(blank=True, null=True)

    class Meta:
        managed = False

class SubCommittee(models.Model):
    areas = models.TextField(blank=True, null=True)
    letters = models.TextField(blank=True, null=True)
    committee = models.ForeignKey(Committee, on_delete=models.CASCADE, related_name='subcommittees')
    main = models.BooleanField(default=False)

    class Meta:
        managed = False

class Elector(models.Model):
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
    sub_committee = models.ForeignKey(SubCommittee, on_delete=models.CASCADE, blank=True, null=True)
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

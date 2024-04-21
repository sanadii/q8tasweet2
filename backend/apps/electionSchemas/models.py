from django.db import models
from contextlib import contextmanager
from django.db import connection

from utils.models import GENDER_CHOICES


# class DynamicSchemaModel(models.Model):
#     class Meta:
#         abstract = True

#     _schema = None

#     def set_schema(self, schema):
#         self._schema = schema

#     def save(self, *args, **kwargs):
#         # Set the schema to be used for saving this instance
#         if self._schema:
#             with schema_context(self._schema):
#                 super().save(*args, **kwargs)
#         else:
#             super().save(*args, **kwargs)


class Committee(models.Model):
    serial = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    circle = models.CharField(max_length=255, blank=True, null=True)
    area = models.CharField(max_length=255, blank=True, null=True)
    area_name = models.CharField(max_length=255, blank=True, null=True)
    gender = models.CharField(
        max_length=1, choices=GENDER_CHOICES, blank=True, null=True
    )
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    voter_count = models.IntegerField(blank=True, null=True)
    committee_count = models.IntegerField(blank=True, null=True)
    tag = models.TextField(blank=True, null=True)
    election = models.IntegerField(
        null=True, blank=True
    )  # ID of the Election in the default database

    class Meta:
        managed = False
        db_table = "committee"
        verbose_name = "Committe"
        verbose_name_plural = "Committes"
        default_permissions = []

    def __str__(self):
        return self.name

    def get_election(self):
        from apps.elections.models import Election

        try:
            if self.election:
                return Election.objects.using("default").get(id=self.election)
        except Election.DoesNotExist:
            return None
        return None


class CommitteeSubset(models.Model):
    area_name = models.TextField(blank=True, null=True)
    letters = models.TextField(blank=True, null=True)
    committee = models.ForeignKey(
        Committee, on_delete=models.CASCADE, related_name="CommitteSubsetes"
    )
    type = models.TextField(max_length=25, blank=True, null=True)
    main = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = "committee_subset"
        verbose_name = "Committe Subset"
        verbose_name_plural = "Committe Subsets"
        default_permissions = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)  # Ensures base class initialization
        schema_name = kwargs.get("schema_name", "public")
        self.set_schema(schema_name)  # Dynamically sets the schema if provided

    def __str__(self):
        return self.name


    def set_schema(self, schema):
        self._schema = schema


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
    gender = models.CharField(
        max_length=1, choices=GENDER_CHOICES, blank=True, null=True
    )
    circle = models.TextField(blank=True, null=True)
    job = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    area = models.TextField(blank=True, null=True)
    block = models.TextField(blank=True, null=True)
    street = models.TextField(blank=True, null=True)
    lane = models.TextField(blank=True, null=True)
    house = models.TextField(blank=True, null=True)
    committee_subset = models.ForeignKey(
        CommitteeSubset, on_delete=models.CASCADE, blank=True, null=True
    )
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
        db_table = "electors"
        verbose_name = "Electors"
        verbose_name_plural = "Electorss"
        default_permissions = []

    def __str__(self):
        return self.name


# @contextmanager
# def schema_context(schema_name):
#     with connection.cursor() as cursor:
#         cursor.execute("SHOW search_path")
#         old_schema = cursor.fetchone()
#         if old_schema:
#             old_schema = old_schema[0]  # Ensure you get the string value of the search path
#         try:
#             cursor.execute(f"SET search_path TO {schema_name}")
#             yield
#         finally:
#             if old_schema:
#                 cursor.execute(f"SET search_path TO {old_schema}")

# # Usage
# with schema_context('dynamic_schema'):
#     committee = Committee(name="New Committee")
#     committee.save()

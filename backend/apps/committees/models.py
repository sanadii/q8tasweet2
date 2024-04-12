# from django.db import models
# from apps.areas.models import Area
# # from django.contrib.postgres.fields import ArrayField

# class CommitteeGroup(models.Model):
#     id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=255)
#     committee_no = models.IntegerField()
#     circle = models.IntegerField()
#     # Change area to a ForeignKey relation to the Area model
#     area = models.ForeignKey(Area, on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_areas')
#     gender = models.CharField(max_length=10)
#     description = models.CharField(max_length=255)
#     address = models.CharField(max_length=255)
#     voter_count = models.IntegerField()
#     committee_count = models.IntegerField()
#     total_voters = models.IntegerField()
#     tags = models.CharField(max_length=255, blank=True)

#     class Meta:
#         db_table = "committee_group"
#         verbose_name = "Committee Group"
#         verbose_name_plural = "Committee Groups"
#         default_permissions = []

#     def __str__(self):
#         return self.name

# class Committee(models.Model):
#     id = models.AutoField(primary_key=True)
#     serial = models.IntegerField()
#     letters=models.CharField(max_length=255)
#     areas=models.CharField(max_length=255)
#     committee_group = models.ForeignKey(CommitteeGroup, on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_committee_groups')

#     class Meta:
#         db_table = "committee"
#         verbose_name = "Committee Group"
#         verbose_name_plural = "Committee Groups"
#         default_permissions = []

#     def __str__(self):
#         return self.name

from django.db import models
from django.contrib.postgres.fields import JSONField

# voting_system:, voter_turnout, result, winning_candidate, campaign_budget, voting_committees, registration_deadline, special_instructions:

# def elections(instance, filename):
#     return 'elections/{filename}'.format(filename=filename)


# Project Information
class ProjectInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    data = models.JSONField()

    def __str__(self):
        return str(self.id)


# Database
class Elections(models.Model):
    id = models.BigAutoField(primary_key=True)
    image = models.ImageField(upload_to='elections/', blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    duedate = models.DateField(blank=True, null=True)

    category = models.CharField(max_length=255, blank=True, null=True)
    sub_category = models.CharField(max_length=255, blank=True, null=True)
    tags = models.CharField(max_length=255, blank=True, null=True)

    moderators = models.CharField(max_length=255, blank=True, null=True)
    candidates = models.CharField(max_length=255, blank=True, null=True)
    committees = models.CharField(max_length=255, blank=True, null=True)

    status = models.CharField(max_length=255, blank=True, null=True)
    priority = models.CharField(max_length=255, blank=True, null=True)

    del_flag = models.IntegerField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'elections'

# Terms
class Terms(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='terms/', null=True, blank=True)
    slug = models.SlugField(unique=True)
    group = models.CharField(max_length=255)
    sub_group = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Terms'

# Candidates
class Candidates(models.Model):
    id = models.BigAutoField(primary_key=True)
    image = models.ImageField(upload_to='elections/', blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)

    education = models.CharField(max_length=1000, blank=True, null=True)
    work = models.CharField(max_length=1000, blank=True, null=True)
    experience = models.CharField(max_length=2000, blank=True, null=True)

    email = models.EmailField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)

    tags = models.CharField(max_length=255, blank=True, null=True)

    status = models.CharField(max_length=255, blank=True, null=True)
    priority = models.CharField(max_length=255, blank=True, null=True)

    del_flag = models.IntegerField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'candidates'

# Guarantees List
class Guarantees(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_id = models.IntegerField(blank=True, null=True)
    election_id = models.IntegerField(blank=True, null=True)
    guarantor_id = models.IntegerField(blank=True, null=True)
    guarantee = models.IntegerField(blank=True, null=True)
    attended = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    del_flag = models.IntegerField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'guarantees'


class Menu(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    # Field name made lowercase.
    parentid = models.IntegerField(db_column='parentId', blank=True, null=True)
    del_flag = models.IntegerField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'menu'


class Permission(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    del_flag = models.IntegerField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'permission'


class Sorting(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    del_flag = models.IntegerField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'sorting'


class UserRank(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    # Field name made lowercase.
    permissionid = models.IntegerField(
        db_column='permissionId', blank=True, null=True)
    # Field name made lowercase.
    parentid = models.IntegerField(db_column='parentId', blank=True, null=True)
    del_flag = models.IntegerField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'user_rank'


# class Users(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     fname = models.CharField(max_length=255, blank=True, null=True)
#     lname = models.CharField(max_length=255, blank=True, null=True)
#     avatar = models.CharField(max_length=255, blank=True, null=True)
#     role = models.CharField(max_length=255, blank=True, null=True)
#     cid = models.IntegerField(blank=True, null=True)
#     mobile = models.CharField(max_length=255, blank=True, null=True)
#     email = models.CharField(max_length=255, blank=True, null=True)
#     username = models.CharField(max_length=255, blank=True, null=True)
#     password = models.CharField(max_length=255, blank=True, null=True)
#     rank = models.IntegerField(blank=True, null=True)
#     election_option = models.CharField(max_length=255, blank=True, null=True)
#     del_flag = models.IntegerField(blank=True, null=True)
#     created_by = models.IntegerField(blank=True, null=True)
#     created_date = models.DateTimeField(blank=True, null=True)
#     updated_by = models.IntegerField(blank=True, null=True)
#     updated_date = models.DateTimeField(blank=True, null=True)

#     class Meta:
#         # managed = False
#         db_table = 'users'


class UsersRole(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    # Field name made lowercase.
    permissionid = models.IntegerField(
        db_column='permissionId', blank=True, null=True)
    del_flag = models.IntegerField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'users_role'


class Voters(models.Model):
    id = models.BigAutoField(primary_key=True)
    election_id = models.IntegerField(blank=True, null=True)
    civil_id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    del_flag = models.IntegerField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'voters'


class PermissionMenu(models.Model):
    id = models.BigAutoField(primary_key=True)
    permissionid = models.IntegerField(
        db_column='permissionId', blank=True, null=True)
    menuid = models.IntegerField(db_column='menuId', blank=True, null=True)
    value = models.CharField(max_length=255, blank=True, null=True)
    label = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'permissionmenu'


class TeamMembers(models.Model):
    id = models.BigAutoField(primary_key=True)
    candidate_id = models.IntegerField(blank=True, null=True)
    teamuser_id = models.IntegerField(blank=True, null=True)
    del_flag = models.IntegerField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_date = models.DateField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    updated_date = models.DateField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'team_members'

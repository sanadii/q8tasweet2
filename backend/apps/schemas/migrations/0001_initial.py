# Generated by Django 4.2.2 on 2024-06-21 02:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Area',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('code', models.CharField(max_length=50)),
                ('governorate', models.IntegerField(choices=[(1, 'الأحمدي'), (2, 'العاصمة'), (3, 'الفروانية'), (4, 'حولي'), (5, 'الجهراء'), (6, 'مبارك الكبير')])),
                ('tags', models.CharField(blank=True, max_length=250, null=True)),
            ],
            options={
                'verbose_name': 'المنطقة',
                'verbose_name_plural': 'المناطق',
                'db_table': 'area',
                'managed': False,
                'default_permissions': [],
            },
        ),
        migrations.CreateModel(
            name='CampaignAttendee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('member', models.IntegerField(blank=True, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('attended', models.BooleanField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'الحضور',
                'verbose_name_plural': 'الحضور',
                'db_table': 'campaign_attendee',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='CampaignGuarantee',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('campaign', models.IntegerField(blank=True, null=True)),
                ('member', models.IntegerField(blank=True, null=True)),
                ('phone', models.CharField(blank=True, max_length=8, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('status', models.IntegerField(blank=True, choices=[(1, 'جديد'), (2, 'تم التواصل'), (3, 'تم التأكيد'), (4, 'غير مؤكد'), (5, 'غير معروف')], null=True)),
            ],
            options={
                'verbose_name': 'المضامين',
                'verbose_name_plural': 'المضامين',
                'db_table': 'campaign_guarantee',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='CampaignGuaranteeGroup',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=150)),
                ('member', models.IntegerField(blank=True, null=True)),
                ('phone', models.CharField(blank=True, max_length=8, null=True)),
                ('notes', models.CharField(blank=True, max_length=250)),
            ],
            options={
                'verbose_name': 'Campaign Guarantee Group',
                'verbose_name_plural': 'المجاميع',
                'db_table': 'campaign_guarantee_group',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='SortingCampaign',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('member', models.IntegerField(blank=True, null=True)),
                ('votes', models.PositiveIntegerField(default=0)),
                ('notes', models.TextField(blank=True, null=True)),
                ('election_candidate', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Campaign Sorting',
                'verbose_name_plural': 'Campaign Sortings',
                'db_table': 'campaign_sorting',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Committee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('area_name', models.TextField(blank=True, null=True)),
                ('letters', models.TextField(blank=True, null=True)),
                ('type', models.TextField(blank=True, max_length=25, null=True)),
            ],
            options={
                'verbose_name': 'اللجنة',
                'verbose_name_plural': 'اللجان',
                'db_table': 'committee',
                'managed': False,
                'default_permissions': [],
            },
        ),
        migrations.CreateModel(
            name='CommitteeResultCandidate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('election_candidate', models.IntegerField(blank=True, null=True)),
                ('votes', models.PositiveIntegerField(default=0)),
                ('notes', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Committee Result Candidate',
                'verbose_name_plural': 'نتائج اللجان',
                'db_table': 'committee_result_candidate',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='CommitteeResultParty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('election_party', models.IntegerField(blank=True, null=True)),
                ('votes', models.PositiveIntegerField(default=0)),
                ('notes', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Committee Result Party',
                'verbose_name_plural': 'Committee Result Parties',
                'db_table': 'committee_result_party',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='CommitteeResultPartyCandidate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('election_party_candidate', models.IntegerField(blank=True, null=True)),
                ('votes', models.PositiveIntegerField(default=0)),
                ('notes', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Committee Result Party Candidate',
                'verbose_name_plural': 'Committee Result Party Candidates',
                'db_table': 'committee_result_party_candidate',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='CommitteeSite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('serial', models.IntegerField(blank=True, null=True)),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('circle', models.CharField(blank=True, max_length=255, null=True)),
                ('area_name', models.CharField(blank=True, max_length=255, null=True)),
                ('gender', models.IntegerField(blank=True, choices=[(0, 'Undefined'), (1, 'رجال'), (2, 'نساء')], null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('tags', models.TextField(blank=True, null=True)),
                ('election', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'موقع اللجنة',
                'verbose_name_plural': 'مواقع اللجان',
                'db_table': 'committee_site',
                'managed': False,
                'default_permissions': [],
            },
        ),
        migrations.CreateModel(
            name='SortingElection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('member', models.IntegerField(blank=True, null=True)),
                ('votes', models.PositiveIntegerField(default=0)),
                ('notes', models.TextField(blank=True, null=True)),
                ('election_candidate', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Election Sorting',
                'verbose_name_plural': 'Election Sortings',
                'db_table': 'election_sorting',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Elector',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.TextField(blank=True, null=True)),
                ('first_name', models.TextField(blank=True, null=True)),
                ('second_name', models.TextField(blank=True, null=True)),
                ('third_name', models.TextField(blank=True, null=True)),
                ('fourth_name', models.TextField(blank=True, null=True)),
                ('fifth_name', models.TextField(blank=True, null=True)),
                ('sixth_name', models.TextField(blank=True, null=True)),
                ('last_name', models.TextField(blank=True, null=True)),
                ('family', models.TextField(blank=True, null=True)),
                ('branch', models.TextField(blank=True, null=True)),
                ('sect', models.TextField(blank=True, null=True)),
                ('gender', models.IntegerField(blank=True, choices=[(1, 'Male'), (2, 'Female')], null=True)),
                ('job', models.TextField(blank=True, null=True)),
                ('age', models.PositiveIntegerField(blank=True, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('block', models.TextField(blank=True, null=True)),
                ('street', models.TextField(blank=True, null=True)),
                ('lane', models.TextField(blank=True, null=True)),
                ('house', models.TextField(blank=True, null=True)),
                ('area_name', models.TextField(blank=True, null=True)),
                ('committee_area', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'الناخب',
                'verbose_name_plural': 'الناخبين',
                'db_table': 'elector',
                'managed': False,
                'default_permissions': [],
            },
        ),
        migrations.CreateModel(
            name='MemberCommittee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('member', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Member Committee',
                'verbose_name_plural': 'مناديب اللجان',
                'db_table': 'member_committee',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='MemberCommitteeSite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('member', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Member Committee Site',
                'verbose_name_plural': 'وكلاء اللجان',
                'db_table': 'member_committee_site',
                'managed': False,
            },
        ),
    ]

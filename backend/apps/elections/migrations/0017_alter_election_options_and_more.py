# Generated by Django 5.0.4 on 2024-04-12 17:29

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('areas', '0004_delete_committee'),
        ('elections', '0016_rename_electors_election_voters_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='election',
            options={'default_permissions': [], 'permissions': [('canViewElection', 'Can View Election'), ('canAddElection', 'Can Add Election'), ('canChangeElection', 'Can Change Election'), ('canDeleteElection', 'Can Delete Election')], 'verbose_name': 'Election', 'verbose_name_plural': 'Elections'},
        ),
        migrations.AlterModelOptions(
            name='electioncommittee',
            options={'default_permissions': [], 'verbose_name': 'Committee Group', 'verbose_name_plural': 'Committee Groups'},
        ),
        migrations.RenameField(
            model_name='electioncommittee',
            old_name='name',
            new_name='areas',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='deleted',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='deleted_at',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='deleted_by',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='election',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='gender',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='location',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='sorter',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='updated_at',
        ),
        migrations.RemoveField(
            model_name='electioncommittee',
            name='updated_by',
        ),
        migrations.AddField(
            model_name='electioncommittee',
            name='letters',
            field=models.CharField(default=django.utils.timezone.now, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='electioncommittee',
            name='serial',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='electioncommittee',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterModelTable(
            name='electioncommittee',
            table='committee',
        ),
        migrations.CreateModel(
            name='ElectionCommitteeGroup',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('committee_no', models.IntegerField()),
                ('circle', models.IntegerField()),
                ('gender', models.CharField(max_length=10)),
                ('description', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('voter_count', models.IntegerField()),
                ('committee_count', models.IntegerField()),
                ('total_voters', models.IntegerField()),
                ('tags', models.CharField(blank=True, max_length=255)),
                ('area', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='committee_areas', to='areas.area')),
            ],
            options={
                'verbose_name': 'Committee Group',
                'verbose_name_plural': 'Committee Groups',
                'db_table': 'committee_group',
                'default_permissions': [],
            },
        ),
        migrations.AddField(
            model_name='electioncommittee',
            name='committee_group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='committee_committee_groups', to='elections.electioncommitteegroup'),
        ),
    ]
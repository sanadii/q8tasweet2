# Generated by Django 4.2.2 on 2024-04-20 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('committees', '0005_remove_committeegroup_area_delete_committee_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Committee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('serial', models.IntegerField(blank=True, null=True)),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('circle', models.CharField(blank=True, max_length=255, null=True)),
                ('area', models.CharField(blank=True, max_length=255, null=True)),
                ('area_name', models.CharField(blank=True, max_length=255, null=True)),
                ('gender', models.CharField(blank=True, choices=[('1', 'Male'), ('2', 'Female')], max_length=1, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('voter_count', models.IntegerField(blank=True, null=True)),
                ('committee_count', models.IntegerField(blank=True, null=True)),
                ('tag', models.TextField(blank=True, null=True)),
                ('election', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Committe',
                'verbose_name_plural': 'Committes',
                'db_table': 'committee',
                'managed': False,
                'default_permissions': [],
            },
        ),
        migrations.CreateModel(
            name='CommitteeSubset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('area_name', models.TextField(blank=True, null=True)),
                ('letters', models.TextField(blank=True, null=True)),
                ('type', models.TextField(blank=True, max_length=25, null=True)),
                ('main', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'Committe Subset',
                'verbose_name_plural': 'Committe Subsets',
                'db_table': 'committee_subset',
                'managed': False,
                'default_permissions': [],
            },
        ),
    ]
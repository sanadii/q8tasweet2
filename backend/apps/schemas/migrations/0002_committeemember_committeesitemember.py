# Generated by Django 5.0.4 on 2024-06-01 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('schemas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CommitteeMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('member', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Committee Member',
                'verbose_name_plural': 'Committee Members',
                'db_table': 'committee_member',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='CommitteeSiteMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('member', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Committee Member',
                'verbose_name_plural': 'Committee Members',
                'db_table': 'committee_member',
                'managed': False,
            },
        ),
    ]
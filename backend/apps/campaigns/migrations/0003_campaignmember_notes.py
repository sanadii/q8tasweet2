# Generated by Django 4.2.2 on 2024-06-19 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0002_remove_campaign_campaign_campaig_b71203_idx_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaignmember',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
    ]

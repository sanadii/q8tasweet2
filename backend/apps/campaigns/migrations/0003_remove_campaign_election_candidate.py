# Generated by Django 4.2.2 on 2024-05-20 13:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0002_rename_object_id_campaign_campaigner_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='campaign',
            name='election_candidate',
        ),
    ]
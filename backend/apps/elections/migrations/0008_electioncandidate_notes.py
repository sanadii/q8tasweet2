# Generated by Django 4.2.2 on 2024-06-15 07:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0007_remove_electionpartycandidate_notes'),
    ]

    operations = [
        migrations.AddField(
            model_name='electioncandidate',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
    ]

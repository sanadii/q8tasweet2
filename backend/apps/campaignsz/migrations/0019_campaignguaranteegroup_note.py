# Generated by Django 4.2.2 on 2024-04-08 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0018_campaignguaranteegroup_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaignguaranteegroup',
            name='note',
            field=models.CharField(blank=True, max_length=250),
        ),
    ]
# Generated by Django 5.0.4 on 2024-04-12 12:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('areas', '0002_alter_area_options_alter_area_table'),
    ]

    operations = [
        migrations.CreateModel(
            name='Committee',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('school', models.CharField(max_length=255)),
                ('committee_no', models.IntegerField()),
                ('circle', models.IntegerField()),
                ('area', models.CharField(max_length=255)),
                ('gender', models.CharField(max_length=10)),
                ('description', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('voter_count', models.IntegerField()),
                ('committee_count', models.IntegerField()),
                ('total_voters', models.IntegerField()),
                ('tags', models.CharField(blank=True, max_length=255)),
            ],
        ),
    ]
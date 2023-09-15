from django.db import migrations, models

def set_status_to_one(apps, schema_editor):
    # Get the model from the versioned app registry
    CampaignGuarantees = apps.get_model('restapi', 'CampaignGuarantees')
    CampaignGuarantees.objects.update(status=1)

class Migration(migrations.Migration):


    dependencies = [
        ('restapi', '0093_alter_areas_options_alter_campaignguarantees_options_and_more'),
    ]

    operations = [
        migrations.RunPython(set_status_to_one),
    ]

# areas/apps.py
"""this app contains
Elections are in the default database

but sometimes i need extra tables, like commitee, committees, campaigns, and stuff

these extra tables are going to the new schema dynamically created

accessing schema by url "/electionSchema/{slug}"
schema_name : {election.slug}

schema_tables (SchemaModels) : 
Schema Apps
- Committee: Models {Committee, Committee, CommitteeResult}
- Campaign:  Models {campaign_guarantee, campaign_attendee, campaign_sorting, .....}"""
    
from django.apps import AppConfig



class SchemaConfig(AppConfig):


    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.schemas'

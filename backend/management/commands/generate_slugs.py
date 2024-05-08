# apps/common/management/commands/generate_slugs.py
from django.core.management.base import BaseCommand
from apps.candidates.models import Candidate
from apps.campaigns.models import Campaign
import random
import string

class Command(BaseCommand):
    help = 'Generate and replace slugs for Candidate and Campaign models'

    def handle(self, *args, **kwargs):
        # Update slugs for Candidate model
        candidates = Candidate.objects.all()
        for candidate in candidates:
            new_slug = self.generate_random_slug()
            candidate.slug = new_slug
            candidate.save()

        self.stdout.write(self.style.SUCCESS('Successfully updated Candidate slugs'))

        # Update slugs for Campaign model
        campaigns = Campaign.objects.all()
        for campaign in campaigns:
            new_slug = self.generate_random_slug()
            campaign.slug = new_slug
            campaign.save()

        self.stdout.write(self.style.SUCCESS('Successfully updated Campaign slugs'))

    def generate_random_slug(self, length=8):
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for _ in range(length))

# backend/management/commands/populate_categories.py
from django.core.files import File
from django.core.management.base import BaseCommand
from apps.elections.models import ElectionCategory
import os
from django.db import transaction
import random
import time


class Command(BaseCommand):
    help = 'Populate categories and sub-categories'

    # data was here
    
    def set_category_image(self, category, slug):
        category.image = f"elections/{slug}.png"
        category.save()
        self.stdout.write(self.style.SUCCESS(f'Image set for {category.name}: /elections/{slug}.png'))

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting population script...'))

        with transaction.atomic():
            # Create categories
            for category_data in self.CATEGORIES:
                parent_id = category_data.get('parent')
                parent = None if parent_id is None else ElectionCategory.objects.get(id=parent_id)
                category, created = ElectionCategory.objects.update_or_create(id=category_data['id'], defaults={
                    'name': category_data['name'],
                    'slug': category_data['slug'],
                    'parent': parent
                })

                self.set_category_image(category, category_data['slug'])

                # Pause for a moment (e.g., 1 second) before moving on to sub-categories
                time.sleep(1)

            self.stdout.write(self.style.SUCCESS('Parent categories created, pausing before sub-categories...'))

            # Create sub-categories
            for sub_category_data in self.SUB_CATEGORIES:
                parent_id = sub_category_data.get('parent')
                parent = ElectionCategory.objects.get(id=parent_id)
                category, created = ElectionCategory.objects.update_or_create(id=sub_category_data['id'], defaults={
                    'name': sub_category_data['name'],
                    'slug': sub_category_data.get('slug', str(random.randint(1, 1000000))),
                    'parent': parent
                })

                slug = sub_category_data.get('slug') or parent.slug
                self.set_category_image(category, slug)

        self.stdout.write(self.style.SUCCESS('Population complete!'))

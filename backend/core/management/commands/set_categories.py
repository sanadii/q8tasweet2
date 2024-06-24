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

    CATEGORIES = [
            {"id": 1, "name": "مجلس الأمة", "slug": "national-assembly"},
            {"id": 2, "name": "المجلس البلدي", "slug": "municipal-council"},
            {"id": 3, "name": "الجمعيات التعاونية", "slug": "cooperative"},
            {"id": 4, "name": "الأندية الرياضية", "slug": "sports-clubs"},
            {"id": 5, "name": "النقابات", "slug": "unions"},
            {"id": 6, "name": "جمعيات النفع العام", "slug": "public-benefit-associations"},
        ]

    SUB_CATEGORIES = [
            
            # مجلس الأمة
            {"id": 1001, "name": "الدائرة الأولى", "slug": "national-assembly-1", "parent": 1},
            {"id": 1002, "name": "الدائرة الثانية", "slug": "national-assembly-2", "parent": 1},
            {"id": 1003, "name": "الدائرة الثالثة", "slug": "national-assembly-3", "parent": 1},
            {"id": 1004, "name": "الدائرة الرابعة", "slug": "national-assembly-4", "parent": 1},
            {"id": 1005, "name": "الدائرة الخامسة", "slug": "national-assembly-5", "parent": 1},

            # المجلس البلدي
            {"id": 2001, "name": "الدائرة الأولى", "slug": "municipal-council-1", "parent": 2},
            {"id": 2002, "name": "الدائرة الثانية", "slug": "municipal-council-2", "parent": 2},
            {"id": 2003, "name": "الدائرة الثالثة", "slug": "municipal-council-3", "parent": 2},
            {"id": 2004, "name": "الدائرة الرابعة", "slug": "municipal-council-4", "parent": 2},
            {"id": 2005, "name": "الدائرة الخامسة", "slug": "municipal-council-5", "parent": 2},
            {"id": 2006, "name": "الدائرة السادسة", "slug": "municipal-council-6", "parent": 2},
            {"id": 2007, "name": "الدائرة السابعة", "slug": "municipal-council-7", "parent": 2},
            {"id": 2008, "name": "الدائرة الثامنة", "slug": "municipal-council-8", "parent": 2},
            {"id": 2009, "name": "الدائرة التاسعة", "slug": "municipal-council-9", "parent": 2},
            {"id": 2010, "name": "الدائرة العاشرة", "slug": "municipal-council-10", "parent": 2},

            # الجمعيات التعاونية
            # محافظة العاصمة
            {"id": 3101, "name": "الخالدية", "parent": 3},
            {"id": 3102, "name": "الروضة وحولي", "parent": 3},
            {"id": 3103, "name": "الشامية والشويخ", "parent": 3},
            {"id": 3104, "name": "الشرق", "parent": 3},
            {"id": 3105, "name": "الصليبخات والدوحة", "parent": 3},
            {"id": 3106, "name": "الصوابر", "parent": 3},
            {"id": 3107, "name": "العبدلي الزراعية", "parent": 3},
            {"id": 3108, "name": "النزهة", "parent": 3},
            {"id": 3109, "name": "الدعية", "parent": 3},
            {"id": 3100, "name": "الشويخ", "slug": "coop-shuwaikh", "parent": 3},
            {"id": 3111, "name": "العديلية", "slug": "coop-edeliya", "parent": 3},
            {"id": 3112, "name": "الفيحاء", "parent": 3},
            {"id": 3113, "name": "القادسية", "slug": "coop-qadsia", "parent": 3},
            {"id": 3114, "name": "اليرموك", "slug": "coop-yarmouk", "parent": 3},
            {"id": 3115, "name": "قرطبة", "slug": "coop-qurtuba", "parent": 3},
            {"id": 3116, "name": "كيفان", "slug": "coop-kaifan", "parent": 3},

            # محافظة حولي
            {"id": 3201, "name": "الجابرية", "slug": "coop-jabriya", "parent": 3},
            {"id": 3202, "name": "الرميثية", "slug": "coop-rumaithiya", "parent": 3},
            {"id": 3203, "name": "السالمية", "slug": "coop-salmiya", "parent": 3},
            {"id": 3204, "name": "الشعب", "slug": "coop-shaab", "parent": 3},
            {"id": 3205, "name": "بيان", "slug": "coop-bayan", "parent": 3},
            {"id": 3206, "name": "سلوى", "slug": "coop-salwa", "parent": 3},
            {"id": 3207, "name": "مشرف", "slug": "coop-mishref", "parent": 3},

            # محافظة الفروانية
            {"id": 3301, "name": "العارضية", "parent": 3},
            {"id": 3302, "name": "العمرية والرابية", "parent": 3},
            {"id": 3303, "name": "الاندلس", "parent": 3},
            {"id": 3304, "name": "الفروانية", "parent": 3},
            {"id": 3305, "name": "جليب الشيوخ", "parent": 3},
            {"id": 3306, "name": "خيطان", "parent": 3},

            # محافظة الأحمدي
            {"id": 3400, "name": "الاحمدي", "slug": "coop-ahmadi", "parent": 3},
            {"id": 3401, "name": "الصباحية", "slug": "coop-sabahiya", "parent": 3},
            {"id": 3402, "name": "الظهر", "slug": "coop-dhahar", "parent": 3},
            {"id": 3403, "name": "الفحيحيل", "slug": "coop-fahaheel", "parent": 3},
            {"id": 3404, "name": "الفنطاس", "slug": "coop-fintas", "parent": 3},
            {"id": 3405, "name": "ضاحية جابر العلي", "slug": "coop-jaberalali", "parent": 3},
            {"id": 3406, "name": "على صباح السالم", "slug": "coop-alisabahalsalem", "parent": 3},
            {"id": 3407, "name": "هديه", "slug": "coop-hadiya", "parent": 3},
            {"id": 3408, "name": "العقيلة", "slug": "coop-eqila", "parent": 3},

            # محافظة الجهراء
            {"id": 3501, "name": "الجهراء", "slug": "coop-jahra", "parent": 3},
            {"id": 3502, "name": "الصليبية", "slug": "coop-sulaibiya", "parent": 3},
            {"id": 3503, "name": "النسيم", "slug": "coop-naseem", "parent": 3},

            # محافظة مبارك الكبير
            {"id": 3601, "name": "صباح السالم", "parent": 3, "slug": "coop-sabahalsalem"},


            # الأندية الرياضية
            # محافظة العاصمة
            {"id": 4001, "name": "الكويت", "slug": "sportclub-kuwait", "parent": 4},
            {"id": 4002, "name": "العربي", "slug": "sportclub-arabi", "parent": 4},
            {"id": 4003, "name": "كاظمة", "slug": "sportclub-kazma", "parent": 4},
            {"id": 4004, "name": "الصليبيخات", "slug": "sportclub-sulaibekhat", "parent": 4},

            # محافظة حولي
            {"id": 4005, "name": "القادسية", "slug": "sportclub-qadsia", "parent": 4},
            {"id": 4006, "name": "اليرموك", "slug": "sportclub-yarmouk", "parent": 4},
            {"id": 4007, "name": "السالمية", "slug": "sportclub-salmiya", "parent": 4},

            # محافظة الفروانية
            {"id": 4008, "name": "التضامن", "slug": "sportclub-tadamon", "parent": 4},
            {"id": 4009, "name": "النصر", "slug": "sportclub-naser", "parent": 4},
            {"id": 4010, "name": "خيطان", "slug": "sportclub-khaitan", "parent": 4},

            # محافظة الأحمدي
            {"id": 4011, "name": "الشباب", "slug": "sportclub-shabab", "parent": 4},
            {"id": 4012, "name": "الساحل", "slug": "sportclub-sahel", "parent": 4},
            {"id": 4013, "name": "الفحيحيل", "slug": "sportclub-fahaheel", "parent": 4},

            # محافظة الجهراء
            {"id": 4014, "name": "الجهراء", "slug": "sportclub-jahra", "parent": 4},

            # محافظة مبارك الكبير
            {"id": 4015, "name": "القرين", "parent": 4},
            {"id": 4016, "name": "برقان", "parent": 4},


            # النقابات
            {"id": 5001, "name": "وزارة الصحة", "slug": "unions-kuwait-medical-association", "parent": 5},
            {"id": 5002, "name": "بلدية الكويت", "slug": "unions-Kuwait-municipality-labour-syndicate", "parent": 5},
            {"id": 5003, "name": "وزارة التربية", "slug": "unions-ministry-of-education", "parent": 5},
            {"id": 5004, "name": "وزارة الاشغال العامة", "slug": "unions-syndicate-of-public-workers", "parent": 5},
            {"id": 5005, "name": "الإدارة العامة للجمارك", "slug": "unions-workers-union-of-general-adminstration-of-customs", "parent": 5},
            {"id": 5006, "name": "وزارة الكهرباء والماء", "slug": "unions-ministry-of-electricity-and-water", "parent": 5},
            {"id": 5007, "name": "وزارة الاعلام", "slug": "unions-ministry-of-information", "parent": 5},
            {"id": 5008, "name": "وزارة الشؤون الاجتماعية والعمل", "slug": "unions-ministry-of-social-affairs", "parent": 5},
            {"id": 5009, "name": "وزارة المواصلات", "slug": "unions-ministry-of-communication", "parent": 5},
            {"id": 5010, "name": "شركة نفط الكويت", "slug": "unions-kuwait-oil-company", "parent": 5},
            {"id": 5011, "name": "شركة البترول الوطنية الكويتية", "slug": "unions-kuwait-national-petroleum-company", "parent": 5},
            {"id": 5012, "name": "عمال شركة صناعة الكيماويات البترولية", "slug": "unions-petrochemical-industries-cmpany", "parent": 5},
            {"id": 5013, "name": "شركة إيكويت للبتروكيماويات", "slug": "unions-oil-petrochemical-industries", "parent": 5},
            {"id": 5014, "name": "شركة ناقلات نفط الكويت", "slug": "unions-kuwait-oil-tanker-company", "parent": 5},
            {"id": 5015, "name": "الشركة الكويتية لنفط الخليج", "slug": "unions-kuwait-oil-gulf", "parent": 5}
        ]
    
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

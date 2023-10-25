# backend/management/commands/populate_categories.py
from django.core.management.base import BaseCommand
from apps.categories.models import Category
import random

class Command(BaseCommand):
    help = 'Populate categories and sub-categories'

    CATEGORIES = [
        {"id": 0, "name": "category", "slug": "category", "parent": None},
        {"id": 1, "name": "مجلس الأمة", "slug": "national-assembly"},
        {"id": 2, "name": "المجلس البلدي", "slug": "municipal-council"},
        {"id": 3, "name": "الجمعيات التعاونية", "slug": "cooperative"},
        {"id": 4, "name": "الأندية الرياضية", "slug": "sports-clubs"},
        {"id": 5, "name": "النقابات", "slug": "unions"},
        {"id": 6, "name": "جمعيات النفع العام", "slug": "public-benefit-associations"},
    ]

    SUB_CATEGORIES = [
        
        # مجلس الأمة
        {"id": 101, "name": "الدائرة الأولى", "slug": "national-assembly-1", "parent": 1},
        {"id": 102, "name": "الدائرة الثانية", "slug": "national-assembly-2", "parent": 1},
        {"id": 103, "name": "الدائرة الثالثة", "slug": "national-assembly-3", "parent": 1},
        {"id": 104, "name": "الدائرة الرابعة", "slug": "national-assembly-4", "parent": 1},
        {"id": 105, "name": "الدائرة الخامسة", "slug": "national-assembly-5", "parent": 1},

        # المجلس البلدي
        {"id": 201, "name": "الدائرة الأولى", "slug": "municipal-council-1", "parent": 2},
        {"id": 202, "name": "الدائرة الثانية", "slug": "municipal-council-2", "parent": 2},
        {"id": 203, "name": "الدائرة الثالثة", "slug": "municipal-council-3", "parent": 2},
        {"id": 204, "name": "الدائرة الرابعة", "slug": "municipal-council-4", "parent": 2},
        {"id": 205, "name": "الدائرة الخامسة", "slug": "municipal-council-5", "parent": 2},
        {"id": 206, "name": "الدائرة السادسة", "slug": "municipal-council-6", "parent": 2},
        {"id": 207, "name": "الدائرة السابعة", "slug": "municipal-council-7", "parent": 2},
        {"id": 208, "name": "الدائرة الثامنة", "slug": "municipal-council-8", "parent": 2},
        {"id": 209, "name": "الدائرة التاسعة", "slug": "municipal-council-9", "parent": 2},
        {"id": 210, "name": "الدائرة العاشرة", "slug": "municipal-council-10", "parent": 2},

        # الجمعيات التعاونية
        # محافظة الأحمدي
        {"id": 300, "name": "الاحمدي", "slug": "al-ahmadi", "parent": 3},
        {"id": 301, "name": "الصباحية", "slug": "al-sabahiya", "parent": 3},
        {"id": 302, "name": "الظهر", "slug": "al-dhahar", "parent": 3},
        {"id": 303, "name": "الفحيحيل", "slug": "al-fahaheel", "parent": 3},
        {"id": 304, "name": "الفنطاس", "slug": "al-fintas", "parent": 3},
        {"id": 305, "name": "ضاحية جابر العلي", "slug": "jaber-al-ali", "parent": 3},
        {"id": 306, "name": "على صباح السالم", "slug": "ali-sabah-al-salem", "parent": 3},
        {"id": 307, "name": "هديه", "slug": "hadiya", "parent": 3},

        # محافظة الجهراء
        {"id": 308, "name": "الجهراء", "parent": 3},
        {"id": 309, "name": "الصليبية", "parent": 3},
        {"id": 310, "name": "النسيم", "parent": 3},

        # محافظة العاصمة
        {"id": 311, "name": "الخالدية", "parent": 3},
        {"id": 312, "name": "الروضة وحولي", "parent": 3},
        {"id": 313, "name": "الشامية والشويخ", "parent": 3},
        {"id": 314, "name": "الشرق", "parent": 3},
        {"id": 315, "name": "الصليبخات والدوحة", "parent": 3},
        {"id": 316, "name": "الصوابر", "parent": 3},
        {"id": 317, "name": "العبدلي الزراعية", "parent": 3},
        {"id": 318, "name": "النزهة", "parent": 3},
        {"id": 319, "name": "الدعية", "parent": 3},
        {"id": 320, "name": "الشويخ", "parent": 3},
        {"id": 321, "name": "العديلية", "parent": 3},
        {"id": 322, "name": "الفيحاء", "parent": 3},
        {"id": 323, "name": "القادسية", "parent": 3},
        {"id": 324, "name": "اليرموك", "parent": 3},
        {"id": 325, "name": "قرطبة", "parent": 3},

        # محافظة الفروانية
        {"id": 326, "name": "العارضية", "parent": 3},
        {"id": 327, "name": "العمرية والرابية", "parent": 3},
        {"id": 328, "name": "الاندلس", "parent": 3},
        {"id": 329, "name": "الفروانية", "parent": 3},
        {"id": 330, "name": "جليب الشيوخ", "parent": 3},
        {"id": 331, "name": "خيطان", "parent": 3},

        # محافظة حولي
        {"id": 332, "name": "الجابرية", "parent": 3},
        {"id": 333, "name": "الرميثية", "parent": 3},
        {"id": 334, "name": "السالمية", "parent": 3},
        {"id": 335, "name": "الشعب", "parent": 3},
        {"id": 336, "name": "بيان", "parent": 3},
        {"id": 337, "name": "سلوى", "parent": 3},
        {"id": 338, "name": "مشرف", "parent": 3},

        # محافظة مبارك الكبير
        {"id": 339, "name": "صباح السالم", "parent": 3},


        # الأندية الرياضية
        # محافظة العاصمة
        {"id": 401, "name": "الكويت", "parent": 4},
        {"id": 402, "name": "العربي", "parent": 4},
        {"id": 403, "name": "كاظمة", "parent": 4},
        {"id": 404, "name": "الصليبيخات", "parent": 4},

        # محافظة حولي
        {"id": 405, "name": "القادسية", "parent": 4},
        {"id": 406, "name": "اليرموك", "parent": 4},
        {"id": 407, "name": "السالمية", "parent": 4},

        # محافظة الفروانية
        {"id": 408, "name": "التضامن", "parent": 4},
        {"id": 409, "name": "النصر", "parent": 4},
        {"id": 410, "name": "خيطان", "parent": 4},

        # محافظة الأحمدي
        {"id": 411, "name": "الشباب", "parent": 4},
        {"id": 412, "name": "الساحل", "parent": 4},
        {"id": 413, "name": "الفحيحيل", "parent": 4},

        # محافظة الجهراء
        {"id": 414, "name": "الجهراء", "parent": 4},

        # محافظة مبارك الكبير
        {"id": 415, "name": "القرين", "parent": 4},
        {"id": 416, "name": "برقان", "parent": 4},


        # النقابات
        {"id": 501, "name": "وزارة الصحة", "parent": 5},
        {"id": 502, "name": "بلدية الكويت", "parent": 5},
        {"id": 503, "name": "وزارة التربية", "parent": 5},
        {"id": 504, "name": "وزارة الاشغال العامة", "parent": 5},
        {"id": 505, "name": "الإدارة العامة للجمارك", "parent": 5},
        {"id": 506, "name": "وزارة الكهرباء والماء", "parent": 5},
        {"id": 507, "name": "وزارة الاعلام", "parent": 5},
        {"id": 508, "name": "وزارة الشؤون الاجتماعية والعمل", "parent": 5},
        {"id": 509, "name": "وزارة المواصلات", "parent": 5},
        {"id": 510, "name": "شركة نفط الكويت", "parent": 5},
        {"id": 511, "name": "شركة البترول الوطنية الكويتية", "parent": 5},
        {"id": 512, "name": "عمال شركة صناعة الكيماويات البترولية", "parent": 5},
        {"id": 513, "name": "شركة إيكويت للبتروكيماويات", "parent": 5},
        {"id": 514, "name": "شركة ناقلات نفط الكويت", "parent": 5},
        {"id": 515, "name": "الشركة الكويتية لنفط الخليج", "parent": 5}
    ]

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting population script...'))

        # Create categories
        for category_data in self.CATEGORIES:
            parent_id = category_data.get('parent')
            parent = None if parent_id is None else Category.objects.get(id=parent_id)
            Category.objects.update_or_create(id=category_data['id'], defaults={
                'name': category_data['name'],
                'slug': category_data['slug'],
                'parent': parent
            })

        # Create sub-categories
        for sub_category_data in self.SUB_CATEGORIES:
            parent = Category.objects.get(id=sub_category_data.get('parent'))
            print(sub_category_data)
            Category.objects.update_or_create(id=sub_category_data['id'], defaults={
                'name': sub_category_data['name'],
                'slug': sub_category_data['slug'] if sub_category_data.get('slug') else str(random.randint(1, 1000000)),
                'parent': parent
            })

        self.stdout.write(self.style.SUCCESS('Population complete!'))

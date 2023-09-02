import os
import django

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from restapi.models import Categories

def populate():

    # This line will delete all entries in the Categories table
    Categories.objects.all().delete()

    categories = [
        {"id": 0, "name": "category", "parent": None},
        {"id": 1, "name": "مجلس الأمة", "parent": 0},
        {"id": 2, "name": "المجلس البلدي", "parent": 0},
        {"id": 3, "name": "الجمعيات التعاونية", "parent": 0},
        {"id": 4, "name": "الأندية الرياضية", "parent": 0},
        {"id": 5, "name": "النقابات", "parent": 0},
    ]

    sub_categories = [
        # مجلس الأمة
        {"id": 101, "name": "الدائرة الأولى", "parent": 1},
        {"id": 102, "name": "الدائرة الثانية", "parent": 1},
        {"id": 103, "name": "الدائرة الثالثة", "parent": 1},
        {"id": 104, "name": "الدائرة الرابعة", "parent": 1},
        {"id": 105, "name": "الدائرة الخامسة", "parent": 1},

        # المجلس البلدي
        {"id": 201, "name": "الدائرة الأولى", "parent": 2},
        {"id": 202, "name": "الدائرة الثانية", "parent": 2},
        {"id": 203, "name": "الدائرة الثالثة", "parent": 2},
        {"id": 204, "name": "الدائرة الرابعة", "parent": 2},
        {"id": 205, "name": "الدائرة الخامسة", "parent": 2},
        {"id": 206, "name": "الدائرة السادسة", "parent": 2},
        {"id": 207, "name": "الدائرة السابعة", "parent": 2},
        {"id": 208, "name": "الدائرة الثامنة", "parent": 2},
        {"id": 209, "name": "الدائرة التاسعة", "parent": 2},
        {"id": 210, "name": "الدائرة العاشرة", "parent": 2},

    # الجمعيات التعاونية
        # Al-Ahmadi Governate
        {"id": 301, "name": "الاحمدي والصباحية", "parent": 3},
        {"id": 302, "name": "الظهر", "parent": 3},
        {"id": 303, "name": "الفحيحيل", "parent": 3},
        {"id": 304, "name": "الفنطاس", "parent": 3},
        {"id": 305, "name": "ضاحية جابر العلي", "parent": 3},
        {"id": 306, "name": "على صباح السالم", "parent": 3},
        {"id": 307, "name": "هديه", "parent": 3},
        # Al-Jahra Governate
        {"id": 308, "name": "الجهراء", "parent": 3},
        {"id": 309, "name": "الصليبية", "parent": 3},
        {"id": 310, "name": "النسيم", "parent": 3},
        # Al-Assima Governate
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
        # Al-Farwaniya Governate
        {"id": 326, "name": "العارضية", "parent": 3},
        {"id": 327, "name": "العمرية والرابية", "parent": 3},
        {"id": 328, "name": "الاندلس", "parent": 3},
        {"id": 329, "name": "الفروانية", "parent": 3},
        {"id": 330, "name": "جليب الشيوخ", "parent": 3},
        {"id": 331, "name": "خيطان", "parent": 3},
        # Hawalli Governate
        {"id": 332, "name": "الجابرية", "parent": 3},
        {"id": 333, "name": "الرميثية", "parent": 3},
        {"id": 334, "name": "السالمية", "parent": 3},
        {"id": 335, "name": "الشعب", "parent": 3},
        {"id": 336, "name": "بيان", "parent": 3},
        {"id": 337, "name": "سلوى", "parent": 3},
        {"id": 338, "name": "مشرف", "parent": 3},
        # Mubarak Al-Kabeer Governate
        {"id": 339, "name": "صباح السالم", "parent": 3},

    # الأندية الرياضية
        # Al-Assima Governate
        {"id": 401, "name": "الكويت", "parent": 4},
        {"id": 402, "name": "العربي", "parent": 4},
        {"id": 403, "name": "كاظمة", "parent": 4},
        {"id": 404, "name": "الصليبيخات", "parent": 4},
        # Hawalli Governate
        {"id": 405, "name": "القادسية", "parent": 4},
        {"id": 406, "name": "اليرموك", "parent": 4},
        {"id": 407, "name": "السالمية", "parent": 4},
        # Al-Farwaniya Governate
        {"id": 408, "name": "التضامن", "parent": 4},
        {"id": 409, "name": "النصر", "parent": 4},
        {"id": 410, "name": "خيطان", "parent": 4},
        # Al-Ahmadi Governate
        {"id": 411, "name": "الشباب", "parent": 4},
        {"id": 412, "name": "الساحل", "parent": 4},
        {"id": 413, "name": "الفحيحيل", "parent": 4},
        # Al-Jahra Governate
        {"id": 414, "name": "الجهراء", "parent": 4},
        # Mubarak Al Kabeer Governate
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

    # Create categories
    for category_data in categories:
        parent_id = category_data.get('parent')
        parent = None if parent_id is None else Categories.objects.get(id=parent_id)
        Categories.objects.create(id=category_data['id'], name=category_data['name'], parent=parent, deleted=False)

    # Create sub-categories
    # sub_categories = national_assembly + municipal_council + cooperative_societies + sport_clubs + unions

    for sub_category in sub_categories:
        parent = Categories.objects.get(id=sub_category.get('parent'))
        Categories.objects.get_or_create(id=sub_category['id'], name=sub_category['name'], parent=parent)


if __name__ == '__main__':
    print('Populating script!')
    populate()
    print('Populating complete!')

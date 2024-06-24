import os
import django

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()


from apps.tags.models import Areas

def populate():

    governorates = [
        { "id": 1, "name": "محافظة العاصمة", "parent": 0}, 
        { "id": 2, "name": "محافظة الأحمدي", "parent": 0}, 
        { "id": 3, "name": "محافظة الفروانية", "parent": 0}, 
        { "id": 4, "name": "محافظة الجهراء", "parent": 0}, 
        { "id": 5, "name": "محافظة حولي", "parent": 0}, 
        { "id": 6, "name": "محافظة مبارك الكبير", "parent": 0},
    ]

    areas = [
        # Asima
        { "id": 100, "name": "مدينة الكويت", "parent_id": 1, "is_deleted": False },
        { "id": 101, "name": "دسمان", "parent_id": 1, "is_deleted": False },
        { "id": 102, "name": "الشرق", "parent_id": 1, "is_deleted": False },
        { "id": 103, "name": "الصوابر", "parent_id": 1, "is_deleted": False },
        { "id": 104, "name": "المرقاب", "parent_id": 1, "is_deleted": False },
        { "id": 105, "name": "القبلة", "parent_id": 1, "is_deleted": False },
        { "id": 106, "name": "الصالحية", "parent_id": 1, "is_deleted": False },
        { "id": 107, "name": "الوطية", "parent_id": 1, "is_deleted": False },
        { "id": 108, "name": "بنيد القار", "parent_id": 1, "is_deleted": False },
        { "id": 109, "name": "كيفان", "parent_id": 1, "is_deleted": False },
        { "id": 110, "name": "الدوحة", "parent_id": 1, "is_deleted": False },
        { "id": 111, "name": "الدسمة", "parent_id": 1, "is_deleted": False },
        { "id": 112, "name": "الدعية", "parent_id": 1, "is_deleted": False },
        { "id": 113, "name": "المنصورية", "parent_id": 1, "is_deleted": False },
        { "id": 114, "name": "ضاحية عبد الله السالم", "parent_id": 1, "is_deleted": False },
        { "id": 115, "name": "النزهة", "parent_id": 1, "is_deleted": False },
        { "id": 116, "name": "الفيحاء", "parent_id": 1, "is_deleted": False },
        { "id": 117, "name": "الشامية", "parent_id": 1, "is_deleted": False },
        { "id": 118, "name": "الروضة", "parent_id": 1, "is_deleted": False },
        { "id": 119, "name": "العديلية", "parent_id": 1, "is_deleted": False },
        { "id": 120, "name": "الخالدية", "parent_id": 1, "is_deleted": False },
        { "id": 121, "name": "القادسية", "parent_id": 1, "is_deleted": False },
        { "id": 122, "name": "قرطبة", "parent_id": 1, "is_deleted": False },
        { "id": 123, "name": "السرة", "parent_id": 1, "is_deleted": False },
        { "id": 124, "name": "اليرموك", "parent_id": 1, "is_deleted": False },
        { "id": 125, "name": "الشويخ", "parent_id": 1, "is_deleted": False },
        { "id": 126, "name": "الري", "parent_id": 1, "is_deleted": False },
        { "id": 127, "name": "غرناطة", "parent_id": 1, "is_deleted": False },
        { "id": 128, "name": "الصليبيخات والدوحة", "parent_id": 1, "is_deleted": False },
        { "id": 129, "name": "النهضة", "parent_id": 1, "is_deleted": False },
        { "id": 130, "name": "مدينة جابر الأحمد", "parent_id": 1, "is_deleted": False },
        { "id": 131, "name": "القيروان", "parent_id": 1, "is_deleted": False },
        { "id": 132, "name": "شمال غرب الصليبيخات", "parent_id": 1, "is_deleted": False },
        { "id": 133, "name": "جزيرة فيلكا", "parent_id": 1, "is_deleted": False },
        { "id": 134, "name": "جزيرة كبر", "parent_id": 1, "is_deleted": False },
        { "id": 135, "name": "جزيرة عوهة", "parent_id": 1, "is_deleted": False },
        { "id": 136, "name": "جزيرة أم المرادم", "parent_id": 1, "is_deleted": False },
        { "id": 137, "name": "جزيرة مسكان", "parent_id": 1, "is_deleted": False },
        { "id": 138, "name": "جزيرة قاروه", "parent_id": 1, "is_deleted": False },
        { "id": 139, "name": "جزيرة أم النمل", "parent_id": 1, "is_deleted": False },
        { "id": 140, "name": "جزيرة الشويخ (عكاز أو القرين سابقًا)", "parent_id": 1, "is_deleted": False },

        # Ahmadi
        { "id": 200, "name": "أبو حليفة", "parent_id": 2, "is_deleted": False },
        { "id": 201, "name": "الأحمدي", "parent_id": 2, "is_deleted": False },
        { "id": 202, "name": "العقيلة", "parent_id": 2, "is_deleted": False },
        { "id": 203, "name": "الفحيحيل", "parent_id": 2, "is_deleted": False },
        { "id": 204, "name": "الفنطاس", "parent_id": 2, "is_deleted": False },
        { "id": 205, "name": "المقوع", "parent_id": 2, "is_deleted": False },
        { "id": 206, "name": "المهبولة", "parent_id": 2, "is_deleted": False },
        { "id": 207, "name": "المنقف", "parent_id": 2, "is_deleted": False },
        { "id": 208, "name": "النويصيب", "parent_id": 2, "is_deleted": False },
        { "id": 209, "name": "الهدية", "parent_id": 2, "is_deleted": False },
        { "id": 210, "name": "الوفرة", "parent_id": 2, "is_deleted": False },
        { "id": 211, "name": "الوفرة الزراعية", "parent_id": 2, "is_deleted": False },
        { "id": 212, "name": "الرقة", "parent_id": 2, "is_deleted": False },
        { "id": 213, "name": "الزور", "parent_id": 2, "is_deleted": False },
        { "id": 214, "name": "الضباعية", "parent_id": 2, "is_deleted": False },
        { "id": 215, "name": "الصباحية", "parent_id": 2, "is_deleted": False },
        { "id": 216, "name": "الشعيبة", "parent_id": 2, "is_deleted": False },
        { "id": 217, "name": "الظهر", "parent_id": 2, "is_deleted": False },
        { "id": 218, "name": "الخيران", "parent_id": 2, "is_deleted": False },
        { "id": 219, "name": "الجليعة", "parent_id": 2, "is_deleted": False },
        { "id": 220, "name": "بنيدر", "parent_id": 2, "is_deleted": False },
        { "id": 221, "name": "ضاحية جابر العلي", "parent_id": 2, "is_deleted": False },
        { "id": 222, "name": "ضاحية فهد الأحمد", "parent_id": 2, "is_deleted": False },
        { "id": 223, "name": "ضاحية علي صباح السالم أم الهيمان سابقاً", "parent_id": 2, "is_deleted": False },
        { "id": 224, "name": "مدينة صباح الأحمد", "parent_id": 2, "is_deleted": False },
        { "id": 225, "name": "مدينة الخيران", "parent_id": 2, "is_deleted": False },
        { "id": 226, "name": "مدينة صباح الأحمد البحرية", "parent_id": 2, "is_deleted": False },
        { "id": 227, "name": "ميناء عبد الله", "parent_id": 2, "is_deleted": False },
        { "id": 228, "name": "واره", "parent_id": 2, "is_deleted": False },

        # Farwaniya
        { "id": 300, "name": "أبرق خيطان", "parent_id": 3, "is_deleted": False },
        { "id": 301, "name": "الأندلس", "parent_id": 3, "is_deleted": False },
        { "id": 302, "name": "اشبيلية", "parent_id": 3, "is_deleted": False },
        { "id": 303, "name": "العارضية", "parent_id": 3, "is_deleted": False },
        { "id": 304, "name": "العارضية الصناعية", "parent_id": 3, "is_deleted": False },
        { "id": 305, "name": "العباسية", "parent_id": 3, "is_deleted": False },
        { "id": 306, "name": "العمرية", "parent_id": 3, "is_deleted": False },
        { "id": 307, "name": "الفردوس", "parent_id": 3, "is_deleted": False },
        { "id": 308, "name": "الفروانية", "parent_id": 3, "is_deleted": False },
        { "id": 309, "name": "الحساوي", "parent_id": 3, "is_deleted": False },
        { "id": 310, "name": "الرابية", "parent_id": 3, "is_deleted": False },
        { "id": 311, "name": "الرحاب", "parent_id": 3, "is_deleted": False },
        { "id": 312, "name": "الرقعي", "parent_id": 3, "is_deleted": False },
        { "id": 313, "name": "الري الصناعية", "parent_id": 3, "is_deleted": False },
        { "id": 314, "name": "الشدادية", "parent_id": 3, "is_deleted": False },
        { "id": 315, "name": "جليب الشيوخ", "parent_id": 3, "is_deleted": False },
        { "id": 316, "name": "خيطان", "parent_id": 3, "is_deleted": False },
        { "id": 317, "name": "خيطان الجديدة", "parent_id": 3, "is_deleted": False },
        { "id": 318, "name": "الضجيج", "parent_id": 3, "is_deleted": False },
        { "id": 319, "name": "ضاحية عبد الله المبارك", "parent_id": 3, "is_deleted": False },
        { "id": 320, "name": "ضاحية صباح الناصر", "parent_id": 3, "is_deleted": False },


        # Aljahra
        { "id": 400, "name": "الصليبية", "parent_id": 4, "disabled": False },
        { "id": 401, "name": "أمغرة", "parent_id": 4, "disabled": False },
        { "id": 402, "name": "النعيم", "parent_id": 4, "disabled": False },
        { "id": 403, "name": "القصر", "parent_id": 4, "disabled": False },
        { "id": 404, "name": "الواحة", "parent_id": 4, "disabled": False },
        { "id": 405, "name": "تيماء", "parent_id": 4, "disabled": False },
        { "id": 406, "name": "النسيم", "parent_id": 4, "disabled": False },
        { "id": 407, "name": "العيون", "parent_id": 4, "disabled": False },
        { "id": 408, "name": "القيصرية", "parent_id": 4, "disabled": False },
        { "id": 409, "name": "العبدلي", "parent_id": 4, "disabled": False },
        { "id": 410, "name": "الجهراء القديمة", "parent_id": 4, "disabled": False },
        { "id": 411, "name": "الجهراء الجديدة", "parent_id": 4, "disabled": False },
        { "id": 412, "name": "كاظمة", "parent_id": 4, "disabled": False },
        { "id": 413, "name": "مدينة سعد العبد الله", "parent_id": 4, "disabled": False },
        { "id": 414, "name": "السالمي", "parent_id": 4, "disabled": False },
        { "id": 415, "name": "المطلاع", "parent_id": 4, "disabled": False },
        { "id": 416, "name": "مدينة الحرير", "parent_id": 4, "disabled": False },
        { "id": 417, "name": "كبد", "parent_id": 4, "disabled": False },
        { "id": 418, "name": "الروضتين", "parent_id": 4, "disabled": False },
        { "id": 419, "name": "الصبية", "parent_id": 4, "disabled": False },
        { "id": 420, "name": "جزيرة بوبيان", "parent_id": 4, "disabled": False },
        { "id": 421, "name": "جزيرة وربة", "parent_id": 4, "disabled": False },


        # Hawalli
        { "id": 500, "name": "حولي", "parent_id": 5, "disabled": 0 },
        { "id": 501, "name": "الشعب", "parent_id": 5, "disabled": 0 },
        { "id": 502, "name": "السالمية", "parent_id": 5, "disabled": 0 },
        { "id": 503, "name": "الرميثية", "parent_id": 5, "disabled": 0 },
        { "id": 504, "name": "الجابرية", "parent_id": 5, "disabled": 0 },
        { "id": 505, "name": "وكيل", "parent_id": 5, "disabled": 0 },
        { "id": 506, "name": "بيان", "parent_id": 5, "disabled": 0 },
        { "id": 507, "name": "آلبدع", "parent_id": 5, "disabled": 0 },
        { "id": 508, "name": "النقرة", "parent_id": 5, "disabled": 0 },
        { "id": 509, "name": "ميدان حولي", "parent_id": 5, "disabled": 0 },
        { "id": 510, "name": "ضاحية مبارك العبد الله الجابر", "parent_id": 5, "disabled": 0 },
        { "id": 511, "name": "سلوى", "parent_id": 5, "disabled": 0 },
        { "id": 512, "name": "جنوب السرة", "parent_id": 5, "disabled": 0 },
        { "id": 513, "name": "الزهراء", "parent_id": 5, "disabled": 0 },
        { "id": 514, "name": "الصديق", "parent_id": 5, "disabled": 0 },
        { "id": 515, "name": "حطين", "parent_id": 5, "disabled": 0 },
        { "id": 516, "name": "السلام", "parent_id": 5, "disabled": 0 },
        { "id": 517, "name": "الشهداء", "parent_id": 5, "disabled": 0 },

        # Mubarak Al Kabeer
        { "id": 600, "name": "العدان", "parent_id": 6, "disabled": 0 },
        { "id": 601, "name": "القصور", "parent_id": 6, "disabled": 0 },
        { "id": 602, "name": "القرين", "parent_id": 6, "disabled": 0 },
        { "id": 603, "name": "ضاحية صباح السالم", "parent_id": 6, "disabled": 0 },
        { "id": 604, "name": "المسيلة", "parent_id": 6, "disabled": 0 },
        { "id": 605, "name": "المسايل", "parent_id": 6, "disabled": 0 },
        { "id": 606, "name": "أبو فطيرة", "parent_id": 6, "disabled": 0 },
        { "id": 607, "name": "أبو الحصانية", "parent_id": 6, "disabled": 0 },
        { "id": 608, "name": "صبحان", "parent_id": 6, "disabled": 0 },
        { "id": 609, "name": "الفنيطيس", "parent_id": 6, "disabled": 0 },
        { "id": 610, "name": "ضاحية مبارك الكبير", "parent_id": 6, "disabled": 0 },
    ]

    kuwait = Areas.objects.create(id=0, name="kuwait", parent=None, is_deleted=False)

    for governorate in governorates:
        Areas.objects.create(id=governorate['id'], name=governorate['name'], parent=kuwait, is_deleted=False)

    for area in areas:
        parent = Areas.objects.get(id=area['parent_id'])
        Areas.objects.create(id=area['id'], name=area['name'], parent=parent, is_deleted=area['is_deleted'])

if __name__ == '__main__':
    print('Populating script!')
    populate()
    print('Populating complete!')

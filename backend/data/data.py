import os
import django
from django.db import models

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

import random
import datetime
from django.contrib.auth.models import User

from restapi.models import Elections, Candidates, Electioncandidates

def create_random_entries():
    # Create random candidates with real Arabic Kuwaiti Parliament names
    kuwaiti_parliament_names = [
        "أحمد السعدون",
        "عبد العزيز السعدون",
        "صفاء الهاشم",
        "محمد هايف",
        "فيصل المسلم",
        "أحمد الفضل",
        "محمد العيسى",
        "عبد الرحمن الحسين",
        "أحمد الحجي",
        "خالد الجابر",
        "يوسف الحمادي",
        "زياد الخليفة",
        "سلمان الفارسي",
        "حسن العتيبي",
        "تركي السهلي",
        "عبد الله العجلان",
        "سعود العبدالله",
        "فهد العمرو",
        "جابر القحطاني",
        "مشاري الراشد",
        "سامي الجارالله",
        "أسامة العواد",
        "وليد العلي",
        "راشد الخالد",
        "طارق البقمي",
        "نايف الثنيان",
        "مبارك الدوسري",
        "عادل الغامدي",
        "نواف الهاجري",
        "بدر الزيد",
        "طلال العمر",
        "ماجد الجهني",
        "أنور القرني",
        "رياض العزاوي",
        "عزام البلوي",
        "سليمان العبدالكريم",
        "عبد العزيز الحربي",
        "عماد الدوسري",
        "زهير الشهري",
        "غانم العمران",
        "ناصر الزهراني",
        "سعد القرشي",
        "فواز العيافي",
        "أيمن البوعينين",
        "علي الرميح",
        "حمود الصقير",
        "فرحان السلمي",
        "مازن القطب",
        "سامح العبدالجبار",
        "مروان الطالب",
        "صالح العرفج",
        "عثمان العيسى",
        "ياسر الرقيب",
        "خالد النعيم",
        "عاصم العثمان",
        "بشير العمري",
        "جمال الربيع",
        "خالد الجمعة",
        "فريد القصيمي",
        "علي الشمراني",
        "فهد العقيل",
        "رائد العمودي",
        "ماجد العتيبي",
        "مالك الدغيم",
        "راشد العجمي",
        "هاني القحطاني",
        "عبد الرحمن السلامة",
        "فاروق العسيري",
        "فيصل السهلي",
        "سلطان الدلبحي",
        "علاء الرشيدي",
        "صقر الزهراني",
        "عمر البقشي",
        "عادل العبدالله",
        "سعد العنزي",
        "عصام السلامة",
        "عزيز العثمان",
        "تركي العصيمي",
        "محمد البقمي",

        # Add more names here
    ]

    for name in kuwaiti_parliament_names:
        candidate = Candidates.objects.create(
            name=name,
            description="This is a random candidate.",
            status=random.randint(1, 5),
            birthdate=datetime.date(2000, 1, 1),
        )

    # Create random election_candidate
    for election in Elections.objects.all():
        for _ in range(random.randint(1, 5)):
            candidate = random.choice(Candidates.objects.all())
            result = random.randint(1, 100)
            Electioncandidates.objects.create(
                election_id=election.id,
                candidate_id=candidate.id,
                results=result,
            )

if __name__ == "__main__":
    create_random_entries()



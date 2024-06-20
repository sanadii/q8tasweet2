from apps.schemas.electors.models import Elector

from utils.normalize_arabic import generate_arabic_variants

from django.db.models import Q

def restructure_electors_by_search(request):
    search_type = request.data.get("search_type", "")
    query = Q()

    if search_type == "simple":
        fields = ["full_name", "family"]
    elif search_type == "advanced":
        fields = ["first_name", "second_name", "third_name"]
    elif search_type == "searchById":
        fields = ["id"]
    elif search_type == "searchByName":
        fields = ["full_name"]
    else:
        fields = []

    for field in fields:
        value = str(request.data.get(field, ""))
        if value:
            variants = generate_arabic_variants(value)
            field_query = Q()
            for variant in variants:
                field_query |= Q(**{f"{field}__icontains": variant})
            query &= field_query

    electors = Elector.objects.filter(query)
    return electors

def generate_arabic_variants(text):
    variant_mappings = {
        'ا': ['ا', 'أ', 'إ', 'آ', 'ء'],
        'أ': ['ا', 'أ', 'إ', 'آ', 'ء'],
        'إ': ['ا', 'أ', 'إ', 'آ', 'ء'],
        'آ': ['ا', 'أ', 'إ', 'آ', 'ء'],
        'ء': ['ا', 'أ', 'إ', 'آ', 'ء'],
        'ى': ['ى', 'ي', 'ئ'],
        'ي': ['ى', 'ي', 'ئ'],
        'ئ': ['ى', 'ي', 'ئ'],
        'ة': ['ة', 'ه']
    }

    def recursive_generate(current, index):
        if index == len(text):
            return [current]

        char = text[index]
        variants = variant_mappings.get(char, [char])
        results = []

        for variant in variants:
            results.extend(recursive_generate(current + variant, index + 1))

        return results

    return recursive_generate("", 0)

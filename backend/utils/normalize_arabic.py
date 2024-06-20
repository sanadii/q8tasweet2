import re


def generate_arabic_variants(text):
    # Define mappings for each character to its possible variants
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

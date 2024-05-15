from django.db.models import Q
from rest_framework.exceptions import NotFound
from .models import Elector
from apps.electors.serializers import ElectorSerializer

def restructure_elector_related_electors(request):
    # Retrieve the 'elector' field from the request data
    elector_id = str(request.data.get("elector", ""))

    # Initialize an empty list to store related electors
    related_electors = []

    try:
        # Retrieve the elector based on the provided elector_id
        elector = Elector.objects.get(id=elector_id)
    except Elector.DoesNotExist:
        raise NotFound("Elector not found")

    # Define queries for possible brothers and sisters, father, children, and address-based relationships
    siblings_query = Q(second_name=elector.second_name)
    if elector.third_name:
        siblings_query &= Q(third_name=elector.third_name)
    if elector.fourth_name:
        siblings_query &= Q(fourth_name=elector.fourth_name)

    if elector.family:
        siblings_query &= Q(family=elector.family)

    grand_father_query = Q(first_name=elector.third_name)
    if elector.third_name:
        grand_father_query &= Q(second_name=elector.fourth_name)
    if elector.family:
        grand_father_query &= Q(family=elector.family)

    father_query = Q(first_name=elector.second_name)
    if elector.third_name:
        father_query &= Q(second_name=elector.third_name)
    if elector.fourth_name:
        father_query &= Q(third_name=elector.fourth_name)

    if elector.family:
        father_query &= Q(family=elector.family)

    children_query = Q(second_name=elector.first_name)
    if elector.third_name:
        children_query &= Q(third_name=elector.second_name)
    if elector.fourth_name:
        children_query &= Q(fourth_name=elector.third_name)
    if elector.family:
        children_query &= Q(family=elector.family)

    grand_children_query = Q(third_name=elector.first_name)
    if elector.third_name:
        grand_children_query &= Q(fourth_name=elector.second_name)
    if elector.fourth_name:
        grand_children_query &= Q(fifth_name=elector.third_name)
    if elector.family:
        grand_children_query &= Q(family=elector.family)

    # Check if the elector has a complete address
    has_complete_address = elector.block and elector.street and elector.house

    if has_complete_address:
        address_query = Q(area=elector.area) & Q(block=elector.block) & Q(street=elector.street)
        if elector.lane:
            address_query &= Q(lane=elector.lane)
        address_query &= Q(house=elector.house)
    else:
        address_query = None

    # Retrieve lists of electors
    sibling_list = Elector.objects.filter(siblings_query).exclude(id=elector_id)
    grand_father_list = Elector.objects.filter(grand_father_query)
    father_list = Elector.objects.filter(father_query)
    children_list = Elector.objects.filter(children_query)
    grand_children_list = Elector.objects.filter(grand_children_query)
    
    address_list = Elector.objects.filter(address_query).exclude(id=elector_id) if address_query else []

    # Serialize the lists
    serialized_siblings = ElectorSerializer(sibling_list, many=True).data
    serialized_grand_father = ElectorSerializer(grand_father_list, many=True).data
    serialized_father = ElectorSerializer(father_list, many=True).data
    serialized_children = ElectorSerializer(children_list, many=True).data
    serialized_grand_children = ElectorSerializer(grand_children_list, many=True).data
    serialized_address = ElectorSerializer(address_list, many=True).data

    # Add relationship field to each serialized entry
    for electors in serialized_siblings:
        electors['relationship'] = "الأخ" if electors['gender'] == "1" else "الأخت"
    for electors in serialized_father:
        electors['relationship'] = "الأب"
    for electors in serialized_grand_father:
        electors['relationship'] = "الجد"
    for electors in serialized_children:
        electors['relationship'] = "الإبن" if electors['gender'] == "1" else "الإبنة"
    for electors in serialized_grand_children:
        electors['relationship'] = "الحفيد"

    # Use a dictionary to track added electors by ID and avoid duplicates
    added_electors = {}

    def add_or_update_electors(electors):
        for elector in electors:
            if elector['id'] in added_electors:
                if 'relationship' in added_electors[elector['id']]:
                    added_electors[elector['id']]['relationship'] += f", {elector['relationship']}"
                else:
                    added_electors[elector['id']]['relationship'] = elector['relationship']
            else:
                added_electors[elector['id']] = elector

    # Combine all related electors into a single list without duplicates
    add_or_update_electors(serialized_grand_father)
    add_or_update_electors(serialized_father)
    add_or_update_electors(serialized_siblings)
    add_or_update_electors(serialized_children)
    add_or_update_electors(serialized_grand_children)

    # Update address-based relationships if the elector has a complete address
    if has_complete_address:
        for address in serialized_address:
            if address['id'] in added_electors:
                if 'relationship' in added_electors[address['id']]:
                    added_electors[address['id']]['relationship'] += ", السكن"
                else:
                    added_electors[address['id']]['relationship'] = "السكن"
            else:
                address['relationship'] = "السكن"
                added_electors[address['id']] = address

    # Convert the dictionary values to a list
    related_electors = list(added_electors.values())

    return related_electors

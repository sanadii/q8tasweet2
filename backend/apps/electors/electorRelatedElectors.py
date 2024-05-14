from django.db.models import Q
from rest_framework.exceptions import NotFound
from .models import Elector
from apps.electors.serializers import ElectorSerializer

def restructure_elector_related_electors(request):
    # Retrieve the 'elector' field from the request data
    elector_id = str(request.data.get("elector", ""))

    # Initialize an empty dictionary to store related electors
    related_electors = {
        "siblings": {},
        "father": {},
        "children": {},
    }

    try:
        # Retrieve the elector based on the provided elector_id
        elector = Elector.objects.get(id=elector_id)
    except Elector.DoesNotExist:
        raise NotFound("Elector not found")

    # Possible brothers and sisters
    # Find electors with the same second name, and conditionally third and fourth names if they exist
    siblings_query = Q(second_name=elector.second_name)
    if elector.third_name:
        siblings_query &= Q(third_name=elector.third_name)
    if elector.fourth_name:
        siblings_query &= Q(fourth_name=elector.fourth_name)

    sibling_list = Elector.objects.filter(siblings_query).exclude(id=elector_id)
                     
    serialized_sibling = ElectorSerializer(sibling_list, many=True).data
    print("serialized_sibling: ", serialized_sibling)

    # Apply the siblings_query to the Elector model
    related_electors["siblings"] = serialized_sibling

    return related_electors

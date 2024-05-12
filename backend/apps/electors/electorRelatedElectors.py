from django.db.models import Q
from .models import Elector

def restructure_elector_related_electors(request):
    # Retrieve the 'elector' field from the request data
    elector_id = str(request.data.get("elector", ""))

    # Initialize an empty dictionary to store related electors
    related_electors = {
        "siblings": {},
        "father": {},
        "children": {},
    }

    # Retrieve the elector based on the provided elector_id
    elector = Elector.objects.get(id=elector_id)

    # Possible brothers and sisters
    # Find electors with the same second name, third name, fourth name
    siblings_query = Q(second_name=elector.second_name) & \
                     Q(third_name=elector.third_name) & \
                     Q(fourth_name=elector.fourth_name)

    # Apply the siblings_query to the Elector model
    related_electors["siblings"] = list(Elector.objects.filter(siblings_query).exclude(id=elector_id))

    return related_electors

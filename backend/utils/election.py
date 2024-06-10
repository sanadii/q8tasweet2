from apps.elections.models import Election


def get_election_by_slug(slug):
    try:
        return Election.objects.get(slug=slug)
    except Election.DoesNotExist:
        return None

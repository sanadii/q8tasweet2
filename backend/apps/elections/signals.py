from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
<<<<<<< HEAD
from .models import ElectionCommitteeResult

@receiver(post_save, sender=ElectionCommitteeResult)
def update_votes_on_save(sender, instance, **kwargs):
    if instance.election_candidate:
        instance.election_candidate.update_votes()

@receiver(post_delete, sender=ElectionCommitteeResult)
def update_votes_on_delete(sender, instance, **kwargs):
    if instance.election_candidate:
        instance.election_candidate.update_votes()
=======
# from .models import ElectionCommitteeResult

# @receiver(post_save, sender=ElectionCommitteeResult)
# def update_votes_on_save(sender, instance, **kwargs):
#     if instance.election_candidate:
#         instance.election_candidate.update_votes()

# @receiver(post_delete, sender=ElectionCommitteeResult)
# def update_votes_on_delete(sender, instance, **kwargs):
#     if instance.election_candidate:
#         instance.election_candidate.update_votes()
>>>>>>> sanad

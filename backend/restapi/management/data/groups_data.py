# backend/management/set_permissions.py
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType

# Define the permissions for each model

GROUPS = {
    "Core": [
        (1, 'مدير عام الموقع', 'superAdmin', 1),
        (2, 'مدير الموقع', 'admin', 1),
        (3, 'محرر', 'editor', 1),
        (4, 'مشرف الموقع', 'moderator', 1),
    ],
    "Election": [
        (20, 'مشرف إدارة الإنتخابات', 'electionModerator', 2),
    ],
    "Campaign": [
        (30, 'مشرف إدارة الحملة', 'campaignModerator', 3),
        (31, 'مرشح', 'campaignCandidate', 3),
        (32, 'مدير الحملة', 'campaignManager', 3),
        (33, 'مشرف', 'campaignSupervisor', 3),
        (34, 'ضامن', 'campaignGuarantor', 3),
        (35, 'محضر', 'campaignAttendant', 3),
        (36, 'فارز', 'campaignSorter', 3)
    ],
    "Party": [
        (41, 'مشرف إدارة القائمة', 'partyModerator', 4),
        (42, 'منسق القائمة', 'partyCoordinator', 4)
    ],
    "Subscriber": [
        (50, 'مشترك جديد', 'level1', 5),
        (51, 'مشترك مستوى 2', 'level2', 5),
        (52, 'مشترك مستوى 3', 'level3', 5),
        (53, 'مشترك مستوى 4', 'level4', 5),
        (54, 'مشترك مستوى 5', 'level5', 5),
        (55, 'مشترك مستوى 6', 'level6', 5),
        (56, 'مشترك مستوى 7', 'level7', 5),
        (57, 'مشترك مستوى 8', 'level8', 5),
        (58, 'مشترك مستوى 9', 'level9', 5),
        (59, 'مشترك متميز', 'premiumSubscriber', 5)
    ],
    "Contributor": [
        (60, 'مساهم نوع 1', 'contributorType1', 6),
        (61, 'مساهم نوع 2', 'contributorType2', 6),
        (62, 'مساهم نوع 3', 'contributorType3', 6),
        (63, 'مساهم نوع 4', 'contributorType4', 6),
        (64, 'مساهم نوع 5', 'contributorType5', 6),
        (65, 'مساهم نوع 6', 'contributorType6', 6),
        (66, 'مساهم نوع 7', 'contributorType7', 6),
        (67, 'مساهم نوع 8', 'contributorType8', 6),
        (68, 'مساهم نوع 9', 'contributorType9', 6),
        (69, 'مساهم نوع 10', 'contributorType10', 6)
    ],
}

def set_groups():
    for model, groups in GROUPS.items():
        print(f"Processing Groups for model: {model}")

        for group_item in groups:
            group_id, group_name, group_role, group_category = group_item

            # Assuming that the Group model has 'role' and 'category' fields
            group, created = Group.objects.update_or_create(
                id=group_id,
                defaults={
                    'name': group_name,
                    'role': group_role,
                    'category': group_category
                }
            )

            if created:
                print(f"Created Group: {group_name}")
            else:
                print(f"Updated Group: {group_name}")

set_groups()


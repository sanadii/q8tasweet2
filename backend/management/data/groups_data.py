# backend/management/set_permissions.py
from apps.auths.models import Group
from django.contrib.contenttypes.models import ContentType

# Define the permissions for each model

GROUPS = {
    "Core": [
        (1, 'superAdmin', 'مدير عام الموقع', 1),
        (2, 'admin', 'مدير الموقع', 1),
        (3, 'editor', 'محرر', 1),
        (4, 'moderator', 'مراقب الموقع', 1),
    ],
    "Election": [
        (20, 'electionModerator', 'مراقب', 2),
    ],
    "Campaign": [
        (30, 'campaignModerator', 'مراقب', 3),
        (31, 'campaignCandidate', 'مرشح', 3),
        (32, 'campaignCoordinator', 'منسق', 3),
        (33, 'campaignSupervisor', 'مشرف', 3),
        (34, 'campaignGuarantor', 'ضامن', 3),
        (35, 'campaignAttendant', 'محضر', 3),
        (36, 'campaignSorter', 'فارز', 3),
        (39, 'campaignMember', 'غير معرف', 3)
    ],
    "Party": [
        (41, 'partyModerator', 'مشرف إدارة القائمة', 4),
        (42, 'partyCoordinator', 'منسق القائمة', 4)
    ],
    "Subscriber": [
        (50, 'level1', 'مشترك جديد', 5),
        (51, 'level2', 'مشترك مستوى 2', 5),
        (52, 'level3', 'مشترك مستوى 3', 5),
        (53, 'level4', 'مشترك مستوى 4', 5),
        (54, 'level5', 'مشترك مستوى 5', 5),
        (55, 'level6', 'مشترك مستوى 6', 5),
        (56, 'level7', 'مشترك مستوى 7', 5),
        (57, 'level8', 'مشترك مستوى 8', 5),
        (58, 'level9', 'مشترك مستوى 9', 5),
        (59, 'premiumSubscriber', 'مشترك متميز', 5)
    ],
    "Contributor": [
        (60, 'contributorType1', 'مساهم نوع 1', 6),
        (61, 'contributorType2', 'مساهم نوع 2', 6),
        (62, 'contributorType3', 'مساهم نوع 3', 6),
        (63, 'contributorType4', 'مساهم نوع 4', 6),
        (64, 'contributorType5', 'مساهم نوع 5', 6),
        (65, 'contributorType6', 'مساهم نوع 6', 6),
        (66, 'contributorType7', 'مساهم نوع 7', 6),
        (67, 'contributorType8', 'مساهم نوع 8', 6),
        (68, 'contributorType9', 'مساهم نوع 9', 6),
        (69, 'contributorType10', 'مساهم نوع 10', 6)
    ],
}

def set_groups():
    for model, groups in GROUPS.items():
        print(f"Processing Groups for model: {model}")

        for group_item in groups:
            group_id, group_name, group_display_name, group_category = group_item

            # Check if a group with the same name already exists
            existing_group = Group.objects.filter(name=group_name).first()
            
            # If the group exists and its ID doesn't match the intended ID, then it's a duplicate
            if existing_group and existing_group.id != group_id:
                print(f"Error: Duplicate group name '{group_name}' detected with ID {existing_group.id}. Skipping.")
                continue

            # Assuming that the Group model has 'role' and 'category' fields
            group, created = Group.objects.update_or_create(
                id=group_id,
                defaults={
                    'name': group_name,
                    'display_name': group_display_name,
                    'category': group_category
                }
            )

            if created:
                print(f"Created Group: {group_name}")
            else:
                print(f"Updated Group: {group_name}")

set_groups()


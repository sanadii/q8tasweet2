import React from "react";
import { useSelector } from "react-redux";
import { Card, CardBody } from "reactstrap";
import { userSelector, campaignSelector } from 'Selectors';
import { usePermission, useCampaignMemberRoles, useCurrentCampaignMemberRole } from 'hooks';

const OverviewSidebar = () => {
    const {
        campaign,
        currentCampaignMember,
        campaignMembers,
        campaignRoles,
        campaignElectionCandidates,
        campaignElectionCommittees,
    } = useSelector(campaignSelector);
    const { currentUser } = useSelector(userSelector);

    // Permissions
    const { canChangeConfig } = usePermission();

    // Format role names
    // Get roles
    const campaignModerators = useCampaignMemberRoles('campaignModerator', campaignRoles, campaignMembers);
    const campaignCandidates = useCampaignMemberRoles('campaignCandidate', campaignRoles, campaignMembers);
    const campaignCoordinators = useCampaignMemberRoles('campaignCoordinator', campaignRoles, campaignMembers);
    const currentMemberRole = useCurrentCampaignMemberRole(canChangeConfig, campaignRoles, campaignMembers);

    // Format role names
    const formatRoleNames = (members) => members.map(member => member.name).join(' | ');


    const electionDetails = [
        {
            name: 'الانتخابات',
            data: campaign.election.name,
        },
        {
            name: 'المرشحين',
            data: `${campaignElectionCandidates?.length ?? 0} مرشح`,
        },
        {
            name: 'المقاعد',
            data: `${campaign.election.electSeats} مقعد`,
        },
        {
            name: 'الأصوات',
            data: `${campaign.election.electVotes} صوت`,
        },
        {
            name: 'اللجان',
            data: `${campaignElectionCommittees?.length ?? 0} لجنة`,
        },
    ];

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h5 className="card-title mb-3"><strong>الإنتخابات</strong></h5>
                    <ul>
                        {electionDetails.map((detail, index) => (
                            <li key={index}>{detail.name}: <strong className="text-info">{detail.data}</strong></li>
                        ))}
                    </ul>
                    <hr />
                    <h5 className="card-title mb-3"><strong>الإدارة</strong></h5>
                    <ul>
                        {campaignModerators.length > 0 && <li>المراقب: <strong className="text-info">{formatRoleNames(campaignModerators)}</strong></li>}
                        {campaignCandidates.length > 0 && <li>المرشح: <strong className="text-info">{formatRoleNames(campaignCandidates)}</strong></li>}
                        {campaignCoordinators.length > 0 && <li>المنسق: <strong className="text-info">{formatRoleNames(campaignCoordinators)}</strong></li>}
                    </ul>
                    <hr />
                    {canChangeConfig ?
                        <div>
                            <h5 className="card-title mb-3"><strong>الإدارة</strong></h5>
                            <ul className="text-danger">
                                <li>رمز الإنتخابات: <strong>{campaign.election.id}</strong></li>
                                <li>
                                    {campaign.candidate ? 'رمز المرشح: ' : 'رمز القائمة: '} 
                                    <strong>{campaign.id}</strong>
                                </li>
                                <li>رمز الحملة: <strong>{campaign.id}</strong></li>
                            </ul>
                        </div>
                        :
                        <div>
                            <h5 className="card-title mb-3"><strong>المستخدم</strong></h5>
                            <ul>
                                <li>الإسم: <strong>{currentCampaignMember.fullName}</strong></li>
                                <li>رمز المستخدم: <strong>{currentUser.id}</strong></li>
                                <li>العضوية: <strong>{currentMemberRole}</strong></li>
                                <li>رمز العضوية: <strong>{currentCampaignMember.id}</strong></li>
                                {/* <li>اللجنة: <strong> {committeeName}</strong></li> */}
                            </ul>
                        </div>
                    }
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default OverviewSidebar;
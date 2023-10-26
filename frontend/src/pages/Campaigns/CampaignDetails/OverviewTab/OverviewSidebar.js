// Pages/Campaigns/campaign/index.js
// React & Redux core
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Store & Selectors
import { userSelector, campaignSelector } from 'Selectors';
import usePermission from "Common/Hooks/usePermission";

// UI & Utilities
import { Card, CardBody, Col, Row } from "reactstrap";

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

    // Custom hook to get members with a specific role by role name
    function useMembersWithRole(roleName, campaignRoles = [], campaignMembers = []) {
        const [membersWithRole, setMembersWithRole] = useState([]);

        useEffect(() => {
            const foundRole = campaignRoles.find(roleObj => roleObj.name === roleName);
            const members = foundRole ? campaignMembers.filter(member => member.role === foundRole.id) : [];
            setMembersWithRole(members);
        }, [roleName, campaignRoles, campaignMembers]);

        return membersWithRole;
    }

    function useCurrentMemberRole(canChangeConfig, campaignRoles = [], currentCampaignMember = {}) {
        if (canChangeConfig) {
            return 'مدير النظام';
        } else {
            const roleObj = campaignRoles.find(role => role.id === currentCampaignMember.role);
            return roleObj?.name || 'مشترك';
        }
    }

    // Usage of custom hooks
    const campaignModerators = useMembersWithRole('campaignModerator', campaignRoles, campaignMembers);
    const campaigCoordinators = useMembersWithRole('campaignCoordinator', campaignRoles, campaignMembers);
    const currentMemberRole = useCurrentMemberRole(canChangeConfig, campaignRoles, currentCampaignMember);

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h5 className="card-title mb-3"><strong>الإنتخابات</strong></h5>
                    <ul>
                        <li>الانتخابات: <strong>{campaign.election.name}</strong></li>
                        <li>المرشحين: <strong>{(campaignElectionCandidates?.length ?? 0)} مرشح</strong></li>
                        <li>المقاعد: <strong>{campaign.election.electSeats} مقعد</strong></li>
                        <li>الأصوات: <strong>{campaign.election.electVotes} صوت</strong></li>
                        <li>اللجان: <strong>{(campaignElectionCommittees?.length ?? 0)} لجنة</strong></li>
                    </ul>
                    <hr />
                    <h5 className="card-title mb-3"><strong>الإدارة</strong></h5>
                    <ul>
                        {campaignModerators && campaignModerators.length > 0 && (
                            <li>
                                المراقب: <strong>{campaignModerators.map(moderator => moderator.fullName).join(' | ')}</strong>
                            </li>
                        )}
                        <li>المرشح: <strong>{campaign.candidate.name}</strong></li>
                        {campaigCoordinators && campaigCoordinators.length > 0 &&
                            <li>
                                المنسق: <strong>{campaigCoordinators.map(coordinator => coordinator.fullName).join(' | ')}</strong>
                            </li>
                        }
                    </ul>
                    <hr />
                    {canChangeConfig ?
                        <div>
                            <h5 className="card-title mb-3"><strong>الإدارة</strong></h5>
                            <ul className="text-danger">
                                <li>رمز الإنتخابات: <strong>{campaign.election.id}</strong></li>
                                <li>رمز المرشح: <strong>{campaign.candidate.id}</strong></li>
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
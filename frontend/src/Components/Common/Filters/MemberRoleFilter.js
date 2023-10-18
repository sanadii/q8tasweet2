// Components/Common/Filters/MemberRoleFilter.js
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { campaignSelector } from 'Selectors';
import { Nav, NavItem, NavLink } from "reactstrap";

export const MemberRoleFilter = ({ filters, setFilters, activeTab, setActiveTab }) => {
    const { campaignRoles, campaignMembers, currentCampaignMember } = useSelector(campaignSelector);

    // Get the IDs of roles that are in the managerial category
    const CampaignManagerRoles = useMemo(() => {
        return campaignRoles
            .filter(role =>
                ["campaignModerator", "campaignManager", "campaignCandidate"].includes(role.role)
            )
            .map(role => role.id);
    }, [campaignRoles]);

    // Compute the count of members with managerial roles
    const managerCounts = useMemo(() => {
        return campaignMembers.filter(member => CampaignManagerRoles.includes(member.role)).length;
    }, [CampaignManagerRoles, campaignMembers]);

    // Compute the count for each role
    const roleCounts = useMemo(() => {
        return campaignRoles.reduce((counts, role) => {
            counts[role.id] = campaignMembers.filter(item => item.role === role.id).length;
            return counts;
        }, {});
    }, [campaignRoles, campaignMembers]);

    // Handle Change Campaign Tab Click
    const ChangeCampaignRole = (e, tab, roleIds) => {
        e.preventDefault();

        if (activeTab !== tab) {
            setActiveTab(tab);
            // if (roleIds === "all") {
            //     setFilters(prevFilters => ({
            //         ...prevFilters,
            //         role: null
            //     }));
            // } else 
            if (Array.isArray(roleIds) && tab === "campaignManager") {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    role: CampaignManagerRoles
                }));
            } else {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    role: roleIds
                }));
            }
        }
    };

    return (
        <React.Fragment>
            <div>
                <Nav
                    className="nav-tabs-custom card-header-tabs border-bottom-0"
                    role="tablist"
                >
                    {/* <NavItem>
                        <NavLink
                            className={classnames(
                                { active: activeTab === "all" },
                                "fw-semibold"
                            )}
                            onClick={(e) => ChangeCampaignRole(e, "all", "all", null)}
                            href="#"
                        >
                            الكل
                        </NavLink>
                    </NavItem> */}

                    <NavLink
                        className={classnames(
                            { active: activeTab === "campaignManager" },
                            "fw-semibold"
                        )}
                        onClick={(e) => ChangeCampaignRole(e, "campaignManager", CampaignManagerRoles)}
                        href="#"
                    >
                        الإدارة
                        <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                            {managerCounts}
                        </span>
                    </NavLink>

                    {campaignRoles.filter(role => !CampaignManagerRoles.includes(role.id)).map((role) => (
                        <NavItem key={role.id}>
                            <NavLink
                                className={classnames(
                                    { active: activeTab === role.role.toString() },
                                    "fw-semibold"
                                )}
                                onClick={(e) => ChangeCampaignRole(e, role.role.toString(), role.id)}
                                href="#"
                            >
                                {role.name}
                                <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                                    {roleCounts[role.id]}
                                </span>
                            </NavLink>
                        </NavItem>
                    ))}
                </Nav>
            </div>
        </React.Fragment>
    );

};

export default MemberRoleFilter;

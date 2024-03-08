// Components/Common/Filters/MemberRoleFilter.js
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { campaignSelector } from 'Selectors';
import { Nav, NavItem, NavLink } from "reactstrap";

const MemberRoleFilter = ({ filters, setFilters, activeTab, setActiveTab }) => {
    const { campaignRoles, campaignMembers, currentCampaignMember } = useSelector(campaignSelector);

    // Get the IDs of roles that are in the managerial category
    const campaignManagerRoles = useMemo(() => {
        return campaignRoles
            .filter(role =>
                ["campaignModerator", "campaignCandidate", "campaignCoordinator", "campaignSupervisor"].includes(role.name)
            )
            .map(role => role.id);
    }, [campaignRoles]);

    // Compute the count of members with managerial roles
    const managerCounts = useMemo(() => {
        return campaignMembers.filter(member => campaignManagerRoles.includes(member.role)).length;
    }, [campaignManagerRoles, campaignMembers]);


    console.log("campaignManagerRoles: ", campaignManagerRoles)
    // Compute the count for each role
    const roleCounts = useMemo(() => {
        return campaignRoles.reduce((counts, role) => {
            counts[role.id] = campaignMembers.filter(item => item.role === role.id).length;
            return counts;
        }, {});
    }, [campaignRoles, campaignMembers]);

    console.log("All campaign roles:", campaignRoles);
    console.log("Manager roles:", campaignManagerRoles);

    // Handle Change Campaign Tab Click
    const ChangeCampaignRole = (e, tab, roleIds) => {
        e.preventDefault();

        if (activeTab !== tab) {
            setActiveTab(tab);
            if (tab === "all") {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    role: null
                }));
            } else if (tab === "campaignManagers") {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    role: campaignManagerRoles
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
                    <NavItem>
                        <NavLink
                            className={classnames(
                                { active: activeTab === "all" },
                                "fw-semibold"
                            )}
                            onClick={(e) => ChangeCampaignRole(e, "all", campaignManagerRoles)}
                            href="#"
                        >
                            الكل
                        </NavLink>
                    </NavItem>
                    <NavItem>

                        <NavLink
                            className={classnames(
                                { active: activeTab === "campaignManagers" },
                                "fw-semibold"
                            )}
                            onClick={(e) => ChangeCampaignRole(e, "campaignManagers", campaignManagerRoles)}
                            href="#"
                        >
                            الإدارة
                            <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                                {managerCounts}
                            </span>
                        </NavLink>
                    </NavItem>

                    {campaignRoles.filter(role => !campaignManagerRoles.includes(role.id)).map((role) => (
                        roleCounts[role.id] > 0 && ( // Only render if count is greater than 0
                            <NavItem key={role.id}>
                                <NavLink
                                    className={classnames(
                                        { active: activeTab === role.name.toString() },
                                        "fw-semibold"
                                    )}
                                    onClick={(e) => ChangeCampaignRole(e, role.name.toString(), role.id)}
                                    href="#"
                                >
                                    {role.displayName}
                                    <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                                        {roleCounts[role.id]}
                                    </span>
                                </NavLink>
                            </NavItem>
                        )
                    ))}

                </Nav>
            </div>
        </React.Fragment>
    );

};

export default MemberRoleFilter;

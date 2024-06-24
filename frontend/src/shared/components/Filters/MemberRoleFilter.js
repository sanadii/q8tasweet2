// Components/Common/Filters/MemberRoleFilter.js
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { campaignSelector } from 'selectors';
import { Nav, NavItem, NavLink } from "reactstrap";

const MemberRoleFilter = ({ filters, setFilters, activeTab, setActiveTab }) => {
    const { campaignRoles, campaignMembers, currentCampaignMember } = useSelector(campaignSelector);

    console.log("campaignRoles: ", campaignRoles)
    // Get the IDs of roles that are in the managerial category
    const campaignManagerRoles = useMemo(() => {
        return campaignRoles
            .filter(role =>
                ["campaignModerator", "campaignCandidate", "campaignAdmin", "campaignFieldAdmin", "campaignDigitalAdmin"].includes(role.codename)
            )
            .map(role => role.id) || [];
    }, [campaignRoles]);

    // Compute the count of members with managerial roles
    const managerCounts = useMemo(() => {
        return campaignMembers.filter(member => campaignManagerRoles.includes(member.role)).length;
    }, [campaignManagerRoles, campaignMembers]);


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
                    className="animation-nav profile-nav gap-1 gap-lg-2 flex-grow-1 fs-12"
                    role="tablist"
                >
                    <NavItem>
                        <NavLink
                            className={classnames(
                                { active: activeTab === "all" },
                                "fw-semibold p-1"
                            )}
                            onClick={(e) => ChangeCampaignRole(e, "all", campaignManagerRoles)}
                            href="#"
                        >
                            <i className="mdi mdi-account-multiple-outline me-1 align-bottom"></i>{" "}
                            الكل
                        </NavLink>
                    </NavItem>
                    <NavItem>

                        <NavLink
                            className={classnames(
                                { active: activeTab === "campaignManagers" },
                                "fw-semibold p-1"
                            )}
                            onClick={(e) => ChangeCampaignRole(e, "campaignManagers", campaignManagerRoles)}
                            href="#"
                        >
                            <i className="mdi mdi-account-multiple-outline me-1 align-bottom"></i>{" "}

                            الإدارة
                            <span className="badge bg-light text-primary align-middle ms-1">
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
                                        "fw-semibold p-1"
                                    )}
                                    onClick={(e) => ChangeCampaignRole(e, role.name.toString(), role.id)}
                                    href="#"
                                >
                                    <i className="mdi mdi-account-multiple-outline me-1 align-bottom"></i>{" "}

                                    {role.name}
                                    <span className="badge bg-light text-primary align-middle ms-1">
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

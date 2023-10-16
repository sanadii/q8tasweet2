// Components/Common/Filters/MemberRoleFilter.js
import React, { useMemo } from "react";
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
                ["CampaignDirector", "CampaignAssociate", "CampaignModerator", "CampaignCandidate"].includes(role.role)
            )
            .map(role => role.id);
    }, [campaignRoles]);
    console.log("CampaignManagerRoles:", CampaignManagerRoles);





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
            if (roleIds === "all") {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    role: null
                }));
            } else if (Array.isArray(roleId) && tab === "manager") {
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
        console.log("Changing Campaign Role to:", roleIds);
        console.log("New Tab:", tab);
    };

    useEffect(() => {
        console.log('Filters changed to:', filters);
    }, [filters]);

    // console.log("Role Counts:", roleCounts);
    console.log("Current Active Tab:", activeTab);
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
                                { active: activeTab === "0" },
                                "fw-semibold"
                            )}
                            onClick={(e) => ChangeCampaignRole(e, "0", "all", null)}
                            href="#"
                        >
                            الكل
                        </NavLink>
                    </NavItem>

                    <NavLink
                        className={classnames(
                            { active: activeTab === "manager" },
                            "fw-semibold"
                        )}
                        onClick={(e) => ChangeCampaignRole(e, "manager", CampaignManagerRoles)}
                        href="#"
                    >
                        الإدارة
                    </NavLink>


                    {campaignRoles.filter(role => !CampaignManagerRoles.includes(role.id)).map((role) => (
                        <NavItem key={role.id}>
                            <NavLink
                                className={classnames(
                                    { active: activeTab === role.id.toString() },
                                    "fw-semibold"
                                )}
                                onClick={(e) => ChangeCampaignRole(e, role.id.toString(), role.id)}
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

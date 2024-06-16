// Components/Common/Filters/MemberRoleFilter.js
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { campaignSelector } from 'selectors';
import { Nav, NavItem, NavLink } from "reactstrap";

const MemberRoleFilter = ({ filters, setFilters, activeTab, setActiveTab }) => {
    const { campaignRoles, campaignMembers, currentCampaignMember } = useSelector(campaignSelector);

<<<<<<< HEAD
=======
    console.log("campaignRoles: ", campaignRoles)
>>>>>>> sanad
    // Get the IDs of roles that are in the managerial category
    const campaignManagerRoles = useMemo(() => {
        return campaignRoles
            .filter(role =>
<<<<<<< HEAD
                ["campaignModerator", "campaignCandidate", "campaignCoordinator", "campaignSupervisor"].includes(role.name)
            )
            .map(role => role.id);
=======
                ["campaignModerator", "campaignCandidate", "campaignAdmin", "campaignFieldAdmin", "campaignDigitalAdmin"].includes(role.codename)
            )
            .map(role => role.id) || [];
>>>>>>> sanad
    }, [campaignRoles]);

    // Compute the count of members with managerial roles
    const managerCounts = useMemo(() => {
        return campaignMembers.filter(member => campaignManagerRoles.includes(member.role)).length;
    }, [campaignManagerRoles, campaignMembers]);


<<<<<<< HEAD
    console.log("campaignManagerRoles: ", campaignManagerRoles)
=======
>>>>>>> sanad
    // Compute the count for each role
    const roleCounts = useMemo(() => {
        return campaignRoles.reduce((counts, role) => {
            counts[role.id] = campaignMembers.filter(item => item.role === role.id).length;
            return counts;
        }, {});
    }, [campaignRoles, campaignMembers]);

<<<<<<< HEAD
    console.log("All campaign roles:", campaignRoles);
    console.log("Manager roles:", campaignManagerRoles);

=======
>>>>>>> sanad
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
<<<<<<< HEAD
                    className="nav-tabs-custom card-header-tabs border-bottom-0"
=======
                    className="animation-nav profile-nav gap-1 gap-lg-2 flex-grow-1 fs-12"
>>>>>>> sanad
                    role="tablist"
                >
                    <NavItem>
                        <NavLink
                            className={classnames(
                                { active: activeTab === "all" },
<<<<<<< HEAD
                                "fw-semibold"
=======
                                "fw-semibold p-1"
>>>>>>> sanad
                            )}
                            onClick={(e) => ChangeCampaignRole(e, "all", campaignManagerRoles)}
                            href="#"
                        >
<<<<<<< HEAD
=======
                            <i className="mdi mdi-account-multiple-outline me-1 align-bottom"></i>{" "}
>>>>>>> sanad
                            الكل
                        </NavLink>
                    </NavItem>
                    <NavItem>

                        <NavLink
                            className={classnames(
                                { active: activeTab === "campaignManagers" },
<<<<<<< HEAD
                                "fw-semibold"
=======
                                "fw-semibold p-1"
>>>>>>> sanad
                            )}
                            onClick={(e) => ChangeCampaignRole(e, "campaignManagers", campaignManagerRoles)}
                            href="#"
                        >
<<<<<<< HEAD
                            الإدارة
                            <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
=======
                            <i className="mdi mdi-account-multiple-outline me-1 align-bottom"></i>{" "}

                            الإدارة
                            <span className="badge bg-light text-primary align-middle ms-1">
>>>>>>> sanad
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
<<<<<<< HEAD
                                        "fw-semibold"
=======
                                        "fw-semibold p-1"
>>>>>>> sanad
                                    )}
                                    onClick={(e) => ChangeCampaignRole(e, role.name.toString(), role.id)}
                                    href="#"
                                >
<<<<<<< HEAD
                                    {role.displayName}
                                    <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
=======
                                    <i className="mdi mdi-account-multiple-outline me-1 align-bottom"></i>{" "}

                                    {role.name}
                                    <span className="badge bg-light text-primary align-middle ms-1">
>>>>>>> sanad
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

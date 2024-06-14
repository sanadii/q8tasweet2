import React from "react";
import { api } from "config";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { categorySelector } from 'selectors';

// Component, Constants & Hooks
import { getOptionBadge } from "shared/utils"
import { handleValidDate } from "shared/utils";
import { usePermission } from 'shared/hooks';


import { CheckboxHeader, CheckboxCell } from "./CheckBox"
import { Title, NameAvatar, SimpleName, Name, ResultCandidateName } from "./Titles"

import { SimpleNumber, CandidatePosition, CandidateVotes } from "./Numbers"
import Actions from "./Actions"


const Id = (cellProps) => {
    const { cell, urlDir } = cellProps
    return (
        <React.Fragment>
            <Link
                to={`/dashboard/${urlDir}/${cellProps.row.original.slug}`}
                className="fw-medium link-primary"
            >
                {cellProps.row.original.id}
            </Link>{" "}
        </React.Fragment>
    );
};



const CandidateCount = (cellProps) => {
    <b>{cellProps.value}</b>
};


const DateTime = ({ date }) => (
    handleValidDate(date)
);

const Category = ({ category }) => {
    const { categories } = useSelector(categorySelector);

    const categoryName =
        categories.find((cat) => cat.id === category)?.name || "";

    return (
        <React.Fragment>
            <b>{categoryName}</b>
        </React.Fragment>
    );
};

const Status = ({ status }) => {
    return getOptionBadge("StatusOptions", status)
};

const Badge = ({ option, value }) => {
    return getOptionBadge(option, value)
};

const Priority = ({ priority }) => {
    return getOptionBadge("PriorityOptions", priority)
};



// const Guarantees = (cellProps) => {
//     const numberOfVoters = cellProps.row.original.voters
//     return (
//         <p>{numberOfVoters ? numberOfVoters : '-'}</p>
//     );
// }

const NumberOfAttenance = (cellProps) => {
    const numberOfVoters = cellProps.row.original.voters
    return (
        <p>{numberOfVoters ? numberOfVoters : '-'}</p>
    );
}

// const Attended = (cellProps) => {
//     if (cellProps.row.original.attended) {
//         return <i className="ri-checkbox-circle-fill text-success"> حضر</i>;
//     } else {
//         return <i className="ri-close-circle-fill text-danger"> لم يحضر</i>;
//     }
// }



const Attended = ({ option, value }) => {
    return getOptionBadge(option, value, true)
};

const AttendedPercentage = (cellProps) => {
    const numberOfVoters = cellProps.row.original.voters
    return (
        <p>{numberOfVoters ? numberOfVoters : '0%'}</p>
    );
}

const Moderators = (cell) => {
    const moderators = Array.isArray(cell.value) ? cell.value : [];

    return (
        <React.Fragment>
            <div className="avatar-group">
                {moderators.map((moderator, index) => (
                    <Link key={index} to="#" className="avatar-group-item">
                        {moderator ? (
                            <img
                                src={process.env.REACT_APP_API_URL + moderator.img}
                                alt={moderator.name}
                                title={moderator.name} // Added title attribute for tooltip on hover
                                className="rounded-circle avatar-xxs"
                            />
                        ) : (
                            "No Moderator"
                        )}
                    </Link>
                ))}
            </div>
        </React.Fragment>
    );
};

const CreateBy = (cell) => {
    return <React.Fragment>{cell.value}</React.Fragment>;
};

const Phone = (cellProps) => {
    const phone = cellProps.row.original.phone;
    return (
        <span>{phone ? phone : '-'}</span>
    );
}



// Campaign Teams
const Role = ({ cellProps }) => {
    const roleName = cellProps.row.original.roleName;

    return (
        <span className="text-primary">
            <strong>{roleName}</strong>
        </span>
    );
}

const Team = ({ cellProps, campaignMembers }) => {
    const memberId = cellProps.row.original.id;
    const teamCountForMember = campaignMembers.filter(member => member.supervisor === memberId).length;

    return (
        <span>{teamCountForMember}</span>
    );
};

const CampaignMember = ({ memberId, campaignMembers }) => {

    if (memberId === null) {
        return (
            <span className="text-danger">
                <strong>N/A</strong>
            </span>
        );
    }

    const member = campaignMembers.find(
        (member) => member.id === memberId
    );
    return (
        <span className="text-success">
            <strong>{member ? member.name : "Not Found"}</strong>
        </span>
    );
}


const Guarantees = (cellProps) => {
    const { memberId, guaranteeGroupId, groupMemberId, campaignGuarantees, count } = cellProps;
    console.log("groups.... guaranteeGroupId: ", guaranteeGroupId, "groupMemberId: ", groupMemberId, "memberId: ", memberId)

    let guaranteeCountForMember = 0;

    if (count === "percentage") {
        let totalGuarantees = 0;
        let attendedGuarantees = 0;

        if (memberId && !guaranteeGroupId) {
            totalGuarantees = campaignGuarantees.filter(
                guarantee => guarantee?.member === memberId
            ).length || 0;

            attendedGuarantees = campaignGuarantees.filter(
                guarantee => guarantee?.member === memberId && guarantee?.attended === true
            ).length || 0;
        } else if (!memberId && guaranteeGroupId) {
            totalGuarantees = campaignGuarantees.filter(
                guarantee => guarantee?.guaranteeGroup === guaranteeGroupId
            ).length || 0;

            attendedGuarantees = campaignGuarantees.filter(
                guarantee => guarantee?.guaranteeGroup === guaranteeGroupId && guarantee?.attended === true
            ).length || 0;

        } else if (memberId && guaranteeGroupId) {
            console.log("The memberId: ", groupMemberId || "")

            totalGuarantees = campaignGuarantees.filter(
                guarantee => guarantee?.member === groupMemberId
            ).length || 0;

            attendedGuarantees = campaignGuarantees.filter(
                guarantee => guarantee?.member === groupMemberId && guarantee?.attended === true
            ).length || 0;

        }

        guaranteeCountForMember = totalGuarantees ? (attendedGuarantees / totalGuarantees * 100).toFixed(2) + '%' : '0%';
    } else {
        if (memberId) {
            guaranteeCountForMember = campaignGuarantees.filter(
                guarantee => guarantee?.member === memberId && (count === "attendees" ? guarantee?.attended === true : true)
            ).length || 0;
        } else if (guaranteeGroupId) {
            guaranteeCountForMember = campaignGuarantees.filter(
                guarantee => guarantee?.guaranteeGroup === guaranteeGroupId && (count === "attendees" ? guarantee?.attended === true : true)
            ).length || 0;
        }
    }

    return (
        <span><strong>{guaranteeCountForMember}</strong></span>
    );
};




// const Guarantees = (cellProps) => {
//     const { memberId, memberRole, campaignGuarantees, campaignRoles } = cellProps;

//     // Permission Hook
//     const {
//         canChangeCampaignModerator,
//         canChangeCampaignCoordinator,
//         canChangeCampaignSupervisor,
//         canChangeCampaignMember,
//         canChangeCampaign,
//     } = usePermission();

//     // const memberId = cell.row.original.id;
//     const guaranteeCountForMember = campaignGuarantees.filter(guarantee => guarantee.member === memberId).length;
//     // const campaignMemberId = cellProps.row.original.role;
//     const campaignRole = campaignRoles.find((option) => option.id === memberRole);
//     const campaignMemberRole = campaignRole?.name;
//     return (
//         (!canChangeCampaignCoordinator &&
//             !["campaignModerator", "campaignCandidate", "campaignCoordinator"].includes(campaignMemberRole))
//             || canChangeCampaignSupervisor
//             ? <span>{guaranteeCountForMember}</span>
//             : <span>-</span>
//     );
// }

const Attendees = ({ cellProps, campaignAttendees }) => {
    const userId = cellProps.row.original.user;
    const attendeeCountForMember = campaignAttendees.filter(attendee => attendee.member === userId).length;

    return (
        <span>{attendeeCountForMember}</span>
    );
};

const Sorted = ({ cellProps, campaignMembers }) => {
    return (
        <span>Sorted</span>
    );

}

const Committee = ({ cellProps, campaignElectionCommittees }) => {
    const committeeId = cellProps.row.original.committee;

    if (committeeId === null) {
        return (
            <p className="text-danger">
                <strong>N/A</strong>
            </p>
        );
    }

    const committee = campaignElectionCommittees.find(
        (committee) => committee.id === committeeId
    );
    return (
        <p className="text-success">
            <strong>{committee ? committee.name : "Not Found"}</strong>
        </p>
    );
};

const Supervisor = ({ cellProps, campaignMembers }) => {

    const supervisorId = cellProps.row.original.supervisor;
    if (supervisorId === null) {
        return (
            <span className="text-danger">
                <strong>N/A</strong>
            </span>
        );
    }

    const supervisor = campaignMembers.find(
        (member) => member.id === supervisorId
    );
    return (
        <span className="text-success">
            <strong>
                {supervisor ? supervisor.name : "Not Found"}
            </strong>
        </span>
    );
};

// Guarantees

const GuaranteeGroups = ({ cellProps, campaignGuaranteeGroups }) => {
    const guaranteeGroupId = cellProps.row.original.guaranteeGroup;
    const guaranteeGroup = campaignGuaranteeGroups.find(campaignGuaranteeGroup => campaignGuaranteeGroup.id === guaranteeGroupId);

    return (
        <span className="text-primary">
            <strong>{guaranteeGroup ? guaranteeGroup.name : "-"}</strong>
        </span>
    );
};



export {
    Id,

    // CheckBox
    CheckboxHeader,
    CheckboxCell,

    // Titles
    Title,
    NameAvatar,
    Name,
    SimpleName,
    ResultCandidateName,

    CandidateCount,
    DateTime,
    Badge,
    Status,
    Priority,
    Category,
    Moderators,
    CreateBy,

    // Election

    // Numbers
    SimpleNumber,
    CandidatePosition,
    CandidateVotes,

    // Campaign Team
    Role, Team, Guarantees, Attendees, Sorted, Committee, Supervisor,

    // Guarantees
    GuaranteeGroups,
    CampaignMember,
    Phone,
    Attended,
    AttendedPercentage,

    // Actions
    Actions,

};

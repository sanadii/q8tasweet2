import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { categorySelector } from 'selectors';
import { Link } from "react-router-dom";

// Component, Constants & Hooks
import { StatusOptions, getStatusBadge, PriorityOptions, GenderOptions } from "shared/constants/";

import { getOptionOptions, getOptionBadge } from "shared/utils"
import { AvatarList } from "shared/components";
import { handleValidDate } from "shared/utils";

import { addCampaignGuarantee, addCampaignAttendee } from "store/actions";
import { usePermission } from 'shared/hooks';

const CheckboxHeader = ({ handleCheckAllClick }) => (
    <input
        type="checkbox"
        id="checkBoxAll"
        className="form-check-input"
        onClick={handleCheckAllClick}
    />
);

const CheckboxCell = ({ row, handleCheckCellClick }) => (
    <input
        type="checkbox"
        className="checkboxSelector form-check-input"
        value={row.original.id}
        onChange={handleCheckCellClick}
    />
);

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


const NameAvatar = (cellProps) => {
    const { cell, urlDir } = cellProps
    return (
        < AvatarList
            {...cellProps}
            dirName={urlDir}
        />

    );
};

const Name = (cellProps) => {
    const { id, name, gender, handleClickedItem } = cellProps;
    // const campaignMember = cellProps.row.original;

    return (
        <div
            className="flex-grow-1 ms-2 name"
        // onClick={() => {
        //     handleClickedItem(campaignMember);
        // }}
        >
            <b>{name}</b>
        </div>
    );
};

const SimpleName = ({ name, slug, urlDir }) => {
    return (
        <React.Fragment>
            <Link
                to={`/dashboard/${urlDir}/${slug}`}
                className="fw-medium link-primary"
            >
                {name}
            </Link>{" "}
        </React.Fragment>
    );
};


const Title = (cellProps) => {
    const { title, subTitle, gender } = cellProps
    const getGenderIcon = (gender) => {
        const genderOption = GenderOptions.find(g => g.id === gender);
        if (genderOption) {
            const genderColorClass = `text-${genderOption.color}`;
            return <i className={`mdi mdi-circle align-middle ${genderColorClass} me-2`}></i>;
        }
        return null;
    };

    return (
        <div>
            {getGenderIcon(gender)}
            <b>{title}</b>
            <br />
            {subTitle}
        </div>
    );
};
const CandidateCount = (cellProps) => {
    <b>{cellProps.value}</b>
};


const DueDate = ({ date }) => (
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
    return getOptionBadge("status", status)
};

const Badge = ({ option, value }) => {
    return getOptionBadge(option, value)
};

const Priority = ({ priority }) => {
    return getOptionBadge("priority", priority)
};



// const Guarantees = (cellProps) => {
//     const numberOfVoters = cellProps.row.original.voters
//     return (
//         <p>{numberOfVoters ? numberOfVoters : '-'}</p>
//     );
// }

const Attended = (cellProps) => {
    const numberOfVoters = cellProps.row.original.voters
    return (
        <p>{numberOfVoters ? numberOfVoters : '-'}</p>
    );
}

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

// const Attended = (cellProps) => {
//     if (cellProps.row.original.attended) {
//         return <i className="ri-checkbox-circle-fill text-success"></i>;
//     } else {
//         return <i className="ri-close-circle-fill text-danger"></i>;
//     }
// }


// Campaign Teams
const Role = ({ cellProps, campaignRoles }) => {
    const roleName = cellProps.row.original.roleName;
    // const role = campaignRoles.find((option) => option.id === roleId);

    return (
        <p className="text-success">
            <strong>{roleName}</strong>
        </p>
    );
}

const Team = ({ cellProps, campaignMembers }) => {
    const memberId = cellProps.row.original.id;
    const teamCountForMember = campaignMembers.filter(member => member.supervisor === memberId).length;

    return (
        <p>{teamCountForMember}</p>
    );
};

const Guarantor = ({ cellProps, campaignMembers }) => {
    const memberId = cellProps.row.original.member;

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
    const { memberId, memberRole, campaignGuarantees, campaignRoles } = cellProps;
    console.log("cellcellcell: ", cellProps)

    // Permission Hook
    const {
        canChangeCampaignModerator,
        canChangeCampaignCoordinator,
        canChangeCampaignSupervisor,
        canChangeCampaignMember,
        canChangeCampaign,
    } = usePermission();

    // const memberId = cell.row.original.id;
    const guaranteeCountForMember = campaignGuarantees.filter(guarantee => guarantee.member === memberId).length;
    // const campaignMemberId = cellProps.row.original.role;
    const campaignRole = campaignRoles.find((option) => option.id === memberRole);
    const campaignMemberRole = campaignRole?.name;
    return (
        (!canChangeCampaignCoordinator &&
            !["campaignModerator", "campaignCandidate", "campaignCoordinator"].includes(campaignMemberRole))
            || canChangeCampaignSupervisor
            ? <p>{guaranteeCountForMember}</p>
            : <p>-</p>
    );
}

const Attendees = ({ cellProps, campaignAttendees }) => {
    const userId = cellProps.row.original.user;
    const attendeeCountForMember = campaignAttendees.filter(attendee => attendee.member === userId).length;

    return (
        <p>{attendeeCountForMember}</p>
    );
};

const Sorted = ({ cellProps, campaignMembers }) => {
    return (
        <p>Sorted</p>
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
            <p className="text-danger">
                <strong>N/A</strong>
            </p>
        );
    }

    const supervisor = campaignMembers.find(
        (member) => member.id === supervisorId
    );
    return (
        <p className="text-success">
            <strong>
                {supervisor ? supervisor.name : "Not Found"}
            </strong>
        </p>
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

const Actions = (cellProps) => {
    const dispatch = useDispatch();

    const {
        cell, handleItemClick, handleItemDeleteClick, options, schema,

        // guarantee
        selectedGuaranteeGroup,
        currentCampaignMember,
        campaignGuarantees,
        // campaignAttendees,
        // campaignDetails,
        // electors,


    } = cellProps

    let itemData
    if (schema) {
        itemData = {
            ...(cell.row.original),
            schema: schema,
        }
    }
    else {
        itemData = cell.row.original
    }

    // if user is not a member (eg Admin, SuperAdmin), to open a model to assign the Guarantor / Attendand (+ Committee)
    let campaignMember = currentCampaignMember ? currentCampaignMember.id : null;
    let campaignUser = currentCampaignMember ? currentCampaignMember.user : null;
    let campaignCommittee = currentCampaignMember ? currentCampaignMember.committee : null;
    const isElectorInGuarantees = campaignGuarantees.some(item => item.elector === cell.row.original.id);
    // const isElectorInAttendees = campaignAttendees.some(item => item.id === cellProps.row.original.id);

    const renderElectorGuaranteeButton = () => {
        if (isElectorInGuarantees) {
            return <span className="text-success">تمت الإضافة</span>;
        }

        return (
            <button
                type="button"
                className="btn btn-success btn-sm"
                id="add-btn"
                onClick={(e) => {
                    e.preventDefault();
                    const newCampaignGuarantee = {
                        schema: schema,
                        member: campaignMember,
                        guaranteeGroup: selectedGuaranteeGroup,
                        elector: cell.row.original.id,
                        status: 1,
                    };
                    dispatch(addCampaignGuarantee(newCampaignGuarantee));
                }}
            >
                إضف للمضامين
            </button>
        );
    };

    return (
        <React.Fragment>
            <div className="list-inline hstack gap-1 mb-0">
                {/* View */}
                {options.includes("view") && (
                    <button
                        to="#"
                        className="btn btn-sm btn-soft-warning edit-list"
                        onClick={() => { handleItemClick(itemData, "view"); }}
                    >
                        <i className="ri-eye-fill align-bottom" />
                    </button>
                )}
                {/* Update */}
                {options.includes("update") && (

                    <button
                        to="#"
                        className="btn btn-sm btn-soft-info edit-list"
                        onClick={() => { handleItemClick(itemData, "update"); }}
                    >
                        <i className="ri-pencil-fill align-bottom" />
                    </button>
                )}
                {/* Delete */}
                {options.includes("delete") && (

                    <button
                        to="#"
                        className="btn btn-sm btn-soft-danger remove-list"
                        onClick={() => { handleItemDeleteClick(itemData); }}
                    >
                        <i className="ri-delete-bin-5-fill align-bottom" />
                    </button>
                )}

                {/* AddGuarantee */}
                {options.includes("addGuarantee") && (
                    <div className="flex-shrink-0">
                        {renderElectorGuaranteeButton()}
                    </div>
                )}

            </div>
        </React.Fragment >
    );
};

export {
    Id,
    CheckboxHeader,
    CheckboxCell,
    Title,
    NameAvatar,
    Name,
    SimpleName,
    CandidateCount,
    DueDate,
    Badge,
    Status,
    Priority,
    Category,
    Moderators,
    CreateBy,

    // Campaign Team
    Role, Team, Guarantees, Attendees, Sorted, Committee, Supervisor,
    // Guarantees
    GuaranteeGroups,
    Guarantor,
    Phone,
    Attended,
    AttendedPercentage,

    // Actions
    Actions,

};

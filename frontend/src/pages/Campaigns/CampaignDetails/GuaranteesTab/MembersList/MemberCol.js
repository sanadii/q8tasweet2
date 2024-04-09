import React from "react";
import { usePermission, useDelete } from "shared/hooks";

const Id = (cellProps) => {
    return (
        <React.Fragment>
            {cellProps.row.original.id}
        </React.Fragment>
    );
};

const Name = (props) => {
    const { cellProps, handleSelectCampaignMember } = props;

    const campaignMember = cellProps.row.original;

    return (
        <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
            </div>
            <div
                onClick={() => {
                    handleSelectCampaignMember(campaignMember);
                }}
                className="flex-grow-1 ms-2 name"
            >
                {campaignMember.name}
                {campaignMember.status}
            </div>
        </div>

    );
};

const Mobile = (cellProps) => {
    return (
        <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
            </div>
            <div className="flex-grow-1 ms-2 name">
                {cellProps.row.original.mobile}
            </div>
        </div>

    );
};
const Role = ({ cellProps, campaignRoles }) => {
    const roleId = cellProps.row.original.role;
    const role = campaignRoles.find((option) => option.id === roleId);

    return (
        <p className="text-success">
            <strong>{role ? role.displayName : "غير معرف"}</strong>
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

const Guarantees = (props) => {
    const { cellProps, campaignGuarantees, campaignRoles } = props;

    // Permission Hook
    const {
        canChangeCampaignModerator,
        canChangeCampaignCoordinator,
        canChangeCampaignSupervisor,
        canChangeCampaignMember,
        canChangeCampaign,
    } = usePermission();

    const memberId = cellProps.row.original.id;
    const guaranteeCountForMember = campaignGuarantees.filter(guarantee => guarantee.member === memberId).length;
    const campaignMemberId = cellProps.row.original.role;
    const campaignRole = campaignRoles.find((option) => option.id === campaignMemberId);
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

const Actions = (props) => {
    const { cellProps, campaignMembers, campaignRoles, handleCampaignMemberClick, onClickDelete } = props;

    // Permission Hook
    const {
        canChangeCampaignModerator,
        canChangeCampaignCandidate,
        canChangeCampaignCoordinator,
        canChangeCampaignMember,
    } = usePermission();

    const campaignMemberId = cellProps.row.original.role;
    const campaignRole = campaignRoles.find((option) => option.id === campaignMemberId);
    const campaignMemberRole = campaignRole?.name;


    return (
        <div className="list-inline hstack gap-2 mb-0">
            <button
                to="#"
                title="مراسلة المتعهد"
                className="btn btn-sm btn-soft-success edit-list"
                onClick={() => {
                    const campaignMember = cellProps.row.original;
                    handleCampaignMemberClick(campaignMember, "MessageModal");
                }}
            >
                <i class="ri-question-answer-line align-bottom"></i>
            </button>

            <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                    const campaignMember = cellProps.row.original;
                    handleCampaignMemberClick(campaignMember, "ViewModal");
                }}
            >
                <i className="ri-eye-fill align-bottom" />
            </button>
            {
                (canChangeCampaignCandidate
                    || (canChangeCampaignMember
                        && campaignMemberRole !== "campaignModerator"
                        && campaignMemberRole !== "campaignCandidate"
                        && campaignMemberRole !== "campaignCoordinator"
                    ))
                && (
                    <button
                        to="#"
                        className="btn btn-sm btn-soft-info edit-list"
                        onClick={() => {
                            const campaignMember = cellProps.row.original;
                            handleCampaignMemberClick(campaignMember, "UpdateModal");
                        }}
                    >
                        <i className="ri-pencil-fill align-bottom" />
                    </button>
                )
            }


            {
                (canChangeCampaignModerator
                    || (canChangeCampaignCandidate
                        && campaignMemberRole !== "campaignModerator"
                        && campaignMemberRole !== "campaignCandidate"
                        && campaignMemberRole !== "campaignCoordinator"
                    ))
                && (
                    <button
                        to="#"
                        className="btn btn-sm btn-soft-danger remove-list"
                        onClick={() => {
                            const campaignMember = cellProps.row.original;
                            onClickDelete(campaignMember);
                        }}
                    >
                        <i className="ri-delete-bin-5-fill align-bottom" />
                    </button>
                )
            }

        </div>
    );
};

export {
    Id,
    Name,
    Mobile,
    Role,
    Team,
    Guarantees,
    Attendees,
    Sorted,
    Committee,
    Supervisor,
    Actions,

};

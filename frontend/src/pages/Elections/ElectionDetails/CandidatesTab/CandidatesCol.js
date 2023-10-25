import React from "react";
import { usePermission, useDelete } from "Common/Hooks";
import { ImageCandidateWinnerCircle, Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "Common/Components";


// // Functions
// const getUserRoleById = (userId, campaignMembers, campaignRoles) => {
//     const user = campaignMembers.find(user => user.id === userId);
//     const role = campaignRoles.find(role => role.id === user.role);
//     return role.role;
// };


const Id = (cellProps) => {
    return (
        <React.Fragment>
            {cellProps.row.original.id}
        </React.Fragment>
    );
};

const CheckboxHeader = ({ checkedAll }) => (
    <input
        type="checkbox"
        id="checkBoxAll"
        className="form-check-input"
        onClick={checkedAll}
    />
);

const CheckboxCell = ({ row, deleteCheckbox }) => (
    <input
        type="checkbox"
        className="electionCandidateCheckBox form-check-input"
        value={row.original.id}
        onChange={deleteCheckbox}
    />
);

const Position = (cellProps) => {
    return <p>{cellProps.row.original.position}</p>;
}

const Name = ({ row }) => {
    return (
        <ImageCandidateWinnerCircle
            gender={row.original.gender}
            name={row.original.name}
            imagePath={row.original.image}
            is_winner={row.original.is_winner}
        />
    );
};


const Votes = (cellProps) => {
    return <p>{cellProps.row.original.votes}</p>;
}


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
    const campaignMemberRole = campaignRole.name;
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
                {supervisor ? supervisor.fullName : "Not Found"}
            </strong>
        </p>
    );
};

const Actions = (cellProps) => {
    const { setElectionCandidate, handleElectionCandidateClick, onClickDelete } = cellProps;

    return (
        <div className="list-inline hstack gap-2 mb-0">
            <button
                to="#"
                className="btn btn-sm btn-soft-primary edit-list"
                onClick={() => {
                    const electionCandidate = cellProps.row.original;
                    setElectionCandidate(electionCandidate);
                }}
            >
                <i className="ri-phone-line align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-success edit-list"
                onClick={() => {
                    const electionCandidate = cellProps.row.original;
                    setElectionCandidate(electionCandidate);
                }}
            >
                <i className="ri-question-answer-line align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                    const electionCandidate = cellProps.row.original;
                    setElectionCandidate(electionCandidate);
                }}
            >
                <i className="ri-eye-fill align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-info edit-list"
                onClick={() => {
                    const electionCandidate = cellProps.row.original;
                    handleElectionCandidateClick(electionCandidate);
                }}
            >
                <i className="ri-pencil-fill align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                    const electionCandidate = cellProps.row.original;
                    onClickDelete(electionCandidate);
                }}
            >
                <i className="ri-delete-bin-5-fill align-bottom" />
            </button>
        </div>
    );

};

export {
    Id,
    CheckboxHeader,
    CheckboxCell, 
    Votes,
    Name,
    Position,
    Guarantees,
    Attendees,
    Sorted,
    Committee,
    Supervisor,
    Actions,

};

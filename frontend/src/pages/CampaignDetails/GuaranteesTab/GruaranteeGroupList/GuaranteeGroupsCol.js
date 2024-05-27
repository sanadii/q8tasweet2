import React from "react";
import { CampaignGuaranteeStatusOptions, GenderOptions } from "shared/constants";

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
        className="checkboxSelector form-check-input"
        value={row.original.id}
        onChange={deleteCheckbox}
    />
);


const Id = (cellProps) => {
    return (
        <React.Fragment>
            {cellProps.row.original.id}
        </React.Fragment>
    );
};

// const Name = (props) => {
//     const { cellProps, handleSelectCampaignMember } = props;

//     const campaignMember = cellProps.row.original;

//     return (
//         <div className="d-flex align-items-center">
//             <div className="flex-shrink-0">
//             </div>
//             <div
//                 onClick={() => {
//                     handleSelectCampaignMember(campaignMember);
//                 }}
//                 className="flex-grow-1 ms-2 name"
//             >
//                 {campaignMember.name}
//                 {campaignMember.status}
//             </div>
//         </div>
//     );
// };

const Name = (props) => {
    const { cellProps, handleSelectCampaignGuaranteeGroup } = props;

    const campaignMember = cellProps.row.original;

    return (
        <div
            onClick={() => {
                handleSelectCampaignGuaranteeGroup(campaignMember);
            }}
            className="flex-grow-1 ms-2 name"
        >
            <b>{campaignMember.name}</b>
        </div>
    );
};

const Phone = (cellProps) => {
    const phone = cellProps.row.original.phone;
    return (
        <p>{phone ? phone : '-'}</p>
    );
}

const Guarantees = (cellProps) => {
    const numberOfVoters = cellProps.row.original.voters
    return (
        <p>{numberOfVoters ? numberOfVoters : '-'}</p>
    );
}

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


const Status = (cellProps) => {
    const statusId = cellProps.row.original.status;

    // Find the corresponding status object in the CampaignGuaranteeStatusOptions
    const statusOption = CampaignGuaranteeStatusOptions.find(
        (option) => option.id === statusId
    );

    if (statusOption) {
        return (
            <span className={`${statusOption.badgeClass} text-uppercase`}>
                {statusOption.name}
            </span>
        );
    } else {
        // Fallback for unknown statuses
        return (
            <span className="badge bg-primary text-uppercase">Unknown</span>
        );
    }
}


const Guarantor = ({ cellProps, campaignMembers }) => {
    const memberId = cellProps.row.original.member;

    if (memberId === null) {
        return (
            <p className="text-danger">
                <strong>N/A</strong>
            </p>
        );
    }

    const member = campaignMembers.find(
        (member) => member.id === memberId
    );
    return (
        <p className="text-success">
            <strong>{member ? member.name : "Not Found"}</strong>
        </p>
    );
}


const Actions = (props) => {
    const { cellProps, handleElectionClick, handleItemDeleteClick, isAdmin } = props;

    return (
        <div className="list-inline hstack gap-2 mb-0">
            <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                    const campaignGuaranteeGroup = cellProps.row.original;
                    handleElectionClick(
                        campaignGuaranteeGroup,
                        "viewGuaranteeGroup"
                    );
                }}
            >
                <i className="ri-eye-fill align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-info edit-list"
                onClick={() => {
                    const campaignGuaranteeGroup = cellProps.row.original;
                    handleElectionClick(
                        campaignGuaranteeGroup,
                        "updateGuaranteeGroup"
                    );
                }}
            >
                <i className="ri-pencil-fill align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                    const campaignGuaranteeGroup = cellProps.row.original;
                    handleItemDeleteClick(campaignGuaranteeGroup);
                }}
            >
                <i className="ri-delete-bin-5-fill align-bottom" />
            </button>
        </div>
    );
};

export {
    CheckboxHeader,
    CheckboxCell,
    Id,
    Name,
    Phone,
    Guarantees,
    Attended,
    AttendedPercentage,
    Status,
    Guarantor,
    Actions,

};

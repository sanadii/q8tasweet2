import React from "react";
import { GuaranteeStatusOptions, GenderOptions } from "constants";

const Id = (cellProps) => {
    return (
        <React.Fragment>
            {cellProps.row.original.id}
        </React.Fragment>
    );
};

const Name = (cellProps) => {
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
            {getGenderIcon(cellProps.row.original.gender)}
            <b>{cellProps.row.original.fullName}</b>
            <br />
            {cellProps.row.original.civil}
        </div>
    );
};

const Phone = (cellProps) => {
    const phone = cellProps.row.original.phone;
    return (
        <p>{phone ? phone : '-'}</p>
    );
}

const Attended = (cellProps) => {
    if (cellProps.row.original.attended) {
        return <i className="ri-checkbox-circle-fill text-success"></i>;
    } else {
        return <i className="ri-close-circle-fill text-danger"></i>;
    }
}


const Status = (cellProps) => {
    const statusId = cellProps.row.original.status;

    // Find the corresponding status object in the GuaranteeStatusOptions
    const statusOption = GuaranteeStatusOptions.find(
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
    const { cellProps, handleCampaignGuaranteeClick, onClickDelete, isAdmin } = props;

    return (
        <div className="list-inline hstack gap-2 mb-0">
            <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                    const campaignGuarantee = cellProps.row.original;
                    handleCampaignGuaranteeClick(
                        campaignGuarantee,
                        "GuaranteeViewModal"
                    );
                }}
            >
                <i className="ri-eye-fill align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-info edit-list"
                onClick={() => {
                    const campaignGuarantee = cellProps.row.original;
                    handleCampaignGuaranteeClick(
                        campaignGuarantee,
                        "GuaranteeUpdateModal"
                    );
                }}
            >
                <i className="ri-pencil-fill align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                    const campaignGuarantee = cellProps.row.original;
                    onClickDelete(campaignGuarantee);
                }}
            >
                <i className="ri-delete-bin-5-fill align-bottom" />
            </button>
        </div>
    );
};

export {
    Id,
    Name,
    Phone,
    Attended,
    Status,
    Guarantor,
    Actions,

};

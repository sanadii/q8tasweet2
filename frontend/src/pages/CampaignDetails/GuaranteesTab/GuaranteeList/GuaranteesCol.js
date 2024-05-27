import React from "react";
import { CampaignGuaranteeStatusOptions, GenderOptions } from "shared/constants";
import Tooltip from 'react-bootstrap/Tooltip';  // Import Tooltip from your UI library
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';  // Import OverlayTrigger
import { getOptionOptions, getOptionBadge } from "shared/utils"

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
    return getOptionBadge("CampaignGuaranteeStatus", cellProps.row.original.status)
  };


// const Status = (cellProps) => {
//     const statusId = cellProps.row.original.status;

//     // Find the corresponding status object in the CampaignGuaranteeStatusOptions
//     const statusOption = CampaignGuaranteeStatusOptions.find(
//         (option) => option.id === statusId
//     );

//     if (statusOption) {
//         return (
//             <span className={`${statusOption.badgeClass} text-uppercase`}>
//                 {statusOption.name}
//             </span>
//         );
//     } else {
//         // Fallback for unknown statuses
//         return (
//             <span className="badge bg-primary text-uppercase">Unknown</span>
//         );
//     }
// }


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

const GuaranteeGroups = ({ cellProps, campaignGuaranteeGroups }) => {
    const guaranteeGroupId = cellProps.row.original.guaranteeGroup;
    const guaranteeGroup = campaignGuaranteeGroups.find(campaignGuaranteeGroup => campaignGuaranteeGroup.id === guaranteeGroupId);

    return (
        <span className="text-primary">
            <strong>{guaranteeGroup ? guaranteeGroup.name : "-"}</strong>
        </span>
    );
};



// const guaranteeGroupNames = guaranteeGroupIds.map(groupId => {
//     const group = campaignGuaranteeGroups.find(g => g.id === groupId);
//     return group ? group.name : "-";
// });

// const renderTooltip = (props) => (
//     <Tooltip id="button-tooltip" {...props}>
//         <ul>
//             {guaranteeGroupNames.map((name, index) => (
//                 <li key={index} onClick={() => {/* handle click event here */ }}>
//                     {name}
//                 </li>
//             ))}
//         </ul>
//     </Tooltip>
// );

// if (guaranteeGroupNames.length > 1) {
//     return (
//         <OverlayTrigger
//             placement="top"
//             delay={{ show: 250, hide: 400 }}
//             overlay={renderTooltip}
//         >
//             <span>
//                 {guaranteeGroupNames[0]}
//                 <span class="badge bg-success align-middle ms-1">
//                     +{guaranteeGroupNames.length - 1}
//                 </span>
//             </span>
//         </OverlayTrigger >
//     );
// } else {
//     return <span>{guaranteeGroupNames[0] || "-"}</span>;
// }
// };




const Actions = (props) => {
    const { cellProps, handleCampaignGuaranteeClick, onDeleteCheckBoxClick, isAdmin } = props;

    return (
        <div className="list-inline hstack gap-2 mb-0">
            <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                    const campaignGuarantee = cellProps.row.original;
                    handleCampaignGuaranteeClick(
                        campaignGuarantee,
                        "guaranteeView"
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
                        "guaranteeUpdate"
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
                    onDeleteCheckBoxClick(campaignGuarantee);
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
    Attended,
    Status,
    Guarantor,
    GuaranteeGroups,
    Actions,
};

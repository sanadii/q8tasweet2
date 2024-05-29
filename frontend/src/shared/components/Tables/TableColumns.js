import React from "react";
import { useSelector } from "react-redux";
import { categorySelector } from 'selectors';
import { Link } from "react-router-dom";

// Component, Constants & Hooks
import { StatusOptions, getStatusBadge, PriorityOptions } from "shared/constants/";
import { getOptionOptions, getOptionBadge } from "shared/utils"
import { AvatarList } from "shared/components";
import { handleValidDate } from "shared/utils";

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
        < AvatarList {...cellProps} dirName={urlDir} />

    );
};

const Name = (props) => {
    const { cellProps, handleClickedItem } = props;
    const campaignMember = cellProps.row.original;

    return (
        <div
            className="flex-grow-1 ms-2 name"
            onClick={() => {
                handleClickedItem(campaignMember);
            }}
        >
            <b>{campaignMember.name}</b>
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
        <p>{phone ? phone : '-'}</p>
    );
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
    const { cell, handleItemClick, handleItemDeleteClick } = props;
    const itemData = cell.row.original;

    return (
        <React.Fragment>
            <div className="d-flex">
                <div className="flex-grow-1 elections_name">{cell.value}</div>
                <div className="hstack gap-2">
                    <button
                        to="#"
                        className="btn btn-sm btn-soft-info edit-list"
                        onClick={() => {
                            handleItemClick(itemData);
                        }}
                    >
                        <i className="ri-pencil-fill align-bottom" />
                    </button>
                    <button
                        to="#"
                        className="btn btn-sm btn-soft-danger remove-list"
                        onClick={() => {
                            handleItemDeleteClick(itemData);
                        }}
                    >
                        <i className="ri-delete-bin-5-fill align-bottom" />
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
};
export {
    Id,
    CheckboxHeader,
    CheckboxCell,
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
    Actions,


    // Guarantees
    Guarantor,
    Phone,
    Guarantees,
    Attended,
    AttendedPercentage,
};

import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { categorySelector } from 'Selectors';

import { Link } from "react-router-dom";

const Id = (cellProps) => {
    return (
        <React.Fragment>
            {cellProps.row.original.id}
        </React.Fragment>
    );
};

const Name = (cellProps) => {
    return (
        <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
            </div>
            <div className="flex-grow-1 ms-2 name">
                {cellProps.row.original.fullName}{" "}
                {cellProps.row.original.status}
            </div>
        </div>

    );
};

const Rank = ({ cellProps, campaignRanks }) => {
    const rankId = cellProps.row.original.rank;
    const rank = campaignRanks.find((option) => option.id === rankId);

    return (
        <p className="text-success">
            <strong>{rank ? rank.name : "غير معرف"}</strong>
        </p>
    );
}

const Team = ({ campaignMembers }) => {
    return (
        <p>{campaignMembers.length}</p>
    );
};
const Guarantees = ({ cellProps, campaignGuarantees }) => {
    const getGuaranteeCountForMember = useCallback((memberId) => {
        return campaignGuarantees.filter(guarantee => guarantee.member === memberId).length;
    }, [campaignGuarantees]);

    return (
        <p>{getGuaranteeCountForMember(cellProps.row.original.id)}</p>
    );
};

const Attendees = ({ cellProps, campaignAttendees }) => {
    const getAttendeeCountForMember = useCallback((memberId) => {
        return campaignAttendees.filter(attendee => attendee.member === memberId).length;
    }, [campaignAttendees]);

    return (
        <p>{getAttendeeCountForMember(cellProps.row.original.id)}</p>
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

const Actions = (props) => {
    const { cellProps, handleCampaignMemberClick, onClickDelete, isAdmin } = props;

    return (
        <div className="list-inline hstack gap-2 mb-0">
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
            {isAdmin && (
                <>
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
                </>
            )}
        </div>
    );
};

export {
    Id,
    Name,
    Rank,
    Team,
    Guarantees,
    Attendees,
    Sorted,
    Committee,
    Supervisor,
    Actions,

};

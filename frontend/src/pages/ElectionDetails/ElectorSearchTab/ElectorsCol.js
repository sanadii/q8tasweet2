import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { GuaranteeStatusOptions, GenderOptions } from "shared/constants";
import { addCampaignGuarantee, addCampaignAttendee } from "store/actions";
import { usePermission } from 'shared/hooks';

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
            {cellProps.row.original.id}
        </div>
    );
};

const Area = (cellProps) => {
    return (
        <div>
            <b>{cellProps.row.original.areaName}</b>
            <br />
            ق{cellProps.row.original.block},
            ش{cellProps.row.original.street},
            ج{cellProps.row.original.lane},
            م{cellProps.row.original.house}

        </div>
    );
};

const Committee = (cellProps) => {
    return (
        <div>
            {cellProps.row.original.committeeSiteName}
            <br />
            <b>{cellProps.row.original.committee}</b>
        </div>
    );
};

const Actions = (props) => {
    const dispatch = useDispatch();
    const {
        canChangeConfig,
        canaddCampaignGuarantee,
        canViewCampaignAttendee,
    } = usePermission();

    const {
        cellProps,
        currentCampaignMember,
        handleElectorClick,
        campaignGuarantees,
        campaignAttendees,
        campaignDetails,
        voters,
    } = props;

    // if user is not a member (eg Admin, SuperAdmin), to open a model to assign the Guarantor / Attendand (+ Committee)
    let campaignMember = currentCampaignMember ? currentCampaignMember.id : '';
    let campaignUser = currentCampaignMember ? currentCampaignMember.user : '';
    let campaignCommittee = currentCampaignMember ? currentCampaignMember.committee : '';
    const isElectorInGuarantees = campaignGuarantees.some(item => item.civil === cellProps.row.original.civil);
    const isElectorInAttendees = campaignAttendees.some(item => item.civil === cellProps.row.original.civil);

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
                        campaign: campaignDetails.id,
                        member: campaignMember,
                        civil: cellProps.row.original.civil,
                        status: 1,
                    };
                    dispatch(addCampaignGuarantee(newCampaignGuarantee));
                }}
            >
                إضف للمضامين
            </button>
        );
    };

    const renderElectorAttendeeButton = () => {
        if (isElectorInAttendees) {
            return <span className="text-success">تم التحضير</span>;
        }

        return (
            <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={(e) => {
                    e.preventDefault();
                    const newCampaignAttendee = {
                        user: campaignUser,
                        election: campaignDetails.election.id,
                        committee: campaignCommittee,
                        civil: cellProps.row.original.civil,
                        status: 1,
                    };
                    dispatch(addCampaignAttendee(newCampaignAttendee));
                }}
            >
                تسجيل حضور
            </button>
        );
    };
    return (
        <div className="list-inline hstack gap-2 mb-0">
            <div className="list-inline hstack gap-2 mb-0">
                <button
                    to="#"
                    className="btn btn-sm btn-soft-warning edit-list"
                    onClick={() => {
                        const selectedElector = cellProps.row.original;
                        handleElectorClick(selectedElector, "CampaignElectorViewModal");
                    }}
                >
                    <i className="ri-eye-fill align-bottom" />
                </button>
            </div>
            {canaddCampaignGuarantee &&
                <div className="flex-shrink-0">
                    {renderElectorGuaranteeButton()}
                </div>
            }

            {(canChangeConfig || canViewCampaignAttendee) &&
                <div className="flex-shrink-0">
                    {renderElectorAttendeeButton()}
                </div>
            }
        </div>
    );
};


export {
    Id,
    Name,
    Area,
    Committee,
    Actions,
};

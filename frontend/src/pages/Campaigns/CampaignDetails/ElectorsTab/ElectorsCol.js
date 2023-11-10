import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { GuaranteeStatusOptions, GenderOptions } from "constants";
import { addNewCampaignGuarantee, addNewCampaignAttendee } from "store/actions";
import { usePermission } from 'hooks';

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

const Actions = (props) => {
    const dispatch = useDispatch();
    const {
        canChangeConfig,
        canAddCampaignGuarantee,
        canViewCampaignAttendee,
    } = usePermission();

    const {
        cellProps,
        currentCampaignMember,
        handleElectorClick,
        campaignGuarantees,
        campaignAttendees,
        campaignDetails,
        electors,
    } = props;

    // if user is not a member (eg Admin, SuperAdmin), to open a model to assign the Guarantor / Attendand (+ Committee)
    let campaignMember = currentCampaignMember ? currentCampaignMember.id : '';
    let campaignUser = currentCampaignMember ? currentCampaignMember.user.id : '';
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
                    dispatch(addNewCampaignGuarantee(newCampaignGuarantee));
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
                    dispatch(addNewCampaignAttendee(newCampaignAttendee));
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
                        const elector = cellProps.row.original;
                        handleElectorClick(elector, "CampaignElectorViewModal");
                    }}
                >
                    <i className="ri-eye-fill align-bottom" />
                </button>
            </div>
            {canAddCampaignGuarantee &&
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
    Actions,
};

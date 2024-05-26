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
        canAddCampaignGuarantee,
        canViewCampaignAttendee,
    } = usePermission();

    const {
        cellProps,
        campaignGroup,
        electionSchema,
        currentCampaignMember,
        handleElectorClick,
        campaignGuarantees,
        campaignAttendees,
        campaignDetails,
        electors,
    } = props;

    console.log("cellProps: ", cellProps.row.original)
    // if user is not a member (eg Admin, SuperAdmin), to open a model to assign the Guarantor / Attendand (+ Committee)
    let campaignMember = currentCampaignMember ? currentCampaignMember.id : null;
    let campaignUser = currentCampaignMember ? currentCampaignMember.user : null;
    let campaignCommittee = currentCampaignMember ? currentCampaignMember.committee : null;
    console.log("campaignGroup: ", campaignGroup,)
    // console.log("campaignMember: ", campaignMember, "campaignUser: ", campaignUser, "campaignCommittee: ", campaignCommittee)
    const isElectorInGuarantees = campaignGuarantees.some(item => item.elector === cellProps.row.original.id);
    console.log("campaignGuaranteescampaignGuarantees: ", campaignGuarantees)
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
                        campaign: campaignDetails.id,
                        member: campaignMember,
                        guaranteeGroup: campaignGroup,
                        elector: cellProps.row.original.id,
                        status: 1,
                        schema: electionSchema,

                    };
                    dispatch(addCampaignGuarantee(newCampaignGuarantee));
                }}
            >
                إضف للمضامين
            </button>
        );
    };

    // const renderElectorAttendeeButton = () => {
    //     if (isElectorInAttendees) {
    //         return <span className="text-success">تم التحضير</span>;
    //     }

    //     return (
    //         <button
    //             type="button"
    //             className="btn btn-success btn-sm"
    //             onClick={(e) => {
    //                 e.preventDefault();
    //                 const newCampaignAttendee = {
    //                     user: campaignUser,
    //                     election: campaignDetails.election.id,
    //                     committee: campaignCommittee,
    //                     id: cellProps.row.original.id,
    //                     status: 1,
    //                 };
    //                 dispatch(addCampaignAttendee(newCampaignAttendee));
    //             }}
    //         >
    //             تسجيل حضور
    //         </button>
    //     );
    // };

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
            {canAddCampaignGuarantee &&
                <div className="flex-shrink-0">
                    {renderElectorGuaranteeButton()}
                </div>
            }

            {(canChangeConfig || canViewCampaignAttendee) &&
                <div className="flex-shrink-0">
                    {/* {renderElectorAttendeeButton()} */}
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

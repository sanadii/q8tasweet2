import React from "react";
import { useDispatch } from "react-redux";
import { addCampaignGuarantee, addCampaignAttendee } from "store/actions";


const Actions = (cellProps) => {
    const dispatch = useDispatch();

    const {
        cell, handleItemClicks, handleItemDeleteClick, options, schema,

        // guarantee
        selectedGuaranteeGroup,
        currentCampaignMember,
        campaignGuarantees,
        campaignAttendees,
        // campaignDetails,
        // electors,


    } = cellProps

    let itemData
    if (schema) {
        itemData = {
            ...(cell.row.original),
            schema: schema,
        }
    }
    else {
        itemData = cell.row.original
    }

    // if user is not a member (eg Admin, SuperAdmin), to open a model to assign the Guarantor / Attendand (+ Committee)
    let campaignMember = currentCampaignMember ? currentCampaignMember.id : null;
    let campaignUser = currentCampaignMember ? currentCampaignMember.user : null;
    let campaignCommittee = currentCampaignMember ? currentCampaignMember.committee : null;
    const isElectorInGuarantees = campaignGuarantees && campaignGuarantees.some(item => item.elector === cell.row.original.id);
    const isElectorInAttendees = campaignAttendees && campaignAttendees.some(item => item.elector === cell.row.original.id);

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
                        schema: schema,
                        member: campaignMember,
                        guaranteeGroup: selectedGuaranteeGroup,
                        elector: cell.row.original.id,
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
                        schema: schema,
                        member: campaignMember,
                        // committee: campaignCommittee.id,
                        elector: cell.row.original.id,
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
        <React.Fragment>
            <div className="list-inline hstack gap-1 mb-0">
                {/* View */}
                {options.includes("view") && (
                    <button
                        to="#"
                        className="btn btn-sm btn-soft-warning edit-list"
                        onClick={() => { handleItemClicks(itemData, "view"); }}
                    >
                        <i className="ri-eye-fill align-bottom" />
                    </button>
                )}
                {/* Update */}
                {options.includes("update") && (

                    <button
                        to="#"
                        className="btn btn-sm btn-soft-info edit-list"
                        onClick={() => { handleItemClicks(itemData, "update"); }}
                    >
                        <i className="ri-pencil-fill align-bottom" />
                    </button>
                )}
                {/* Delete */}
                {options.includes("delete") && (

                    <button
                        to="#"
                        className="btn btn-sm btn-soft-danger remove-list"
                        onClick={() => { handleItemDeleteClick(itemData); }}
                    >
                        <i className="ri-delete-bin-5-fill align-bottom" />
                    </button>
                )}

                {/* AddGuarantee */}
                {options.includes("addGuarantee") && (
                    <div className="flex-shrink-0">
                        {renderElectorGuaranteeButton()}
                    </div>
                )}
                {options.includes("addAttendee") && (
                    <div className="flex-shrink-0">
                        {renderElectorAttendeeButton()}
                    </div>
                )}
            </div>
        </React.Fragment >
    );
};

export default Actions;
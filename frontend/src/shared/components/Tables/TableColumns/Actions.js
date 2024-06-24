import React from "react";
import { useDispatch } from "react-redux";
import { addCampaign, addCampaignGuarantee, addCampaignAttendee } from "store/actions";


const Actions = (cellProps) => {
    const dispatch = useDispatch();

    const {
        cell, handleItemClicks, handleItemDeleteClick, options, schema,

        // guarantee
        selectedGuaranteeGroup, currentCampaignMember, campaignGuarantees, campaignAttendees,
        // campaignDetails,
        // electors,

    } = cellProps

    const cellPropId = cell.row.original.id


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


    // Checking members vs committees
    const isCommitteeDelegate = !!currentCampaignMember?.committee;
    const currentCampaignMemberCommittee = currentCampaignMember ? currentCampaignMember?.committee?.id : {};
    console.log("currentCampaignMemberCommittee: ", currentCampaignMemberCommittee)

    // if user is not a member (eg Admin, SuperAdmin), to open a model to assign the Guarantor / Attendand (+ Committee)
    let campaignMember = currentCampaignMember ? currentCampaignMember.id : null;
    let campaignUser = currentCampaignMember ? currentCampaignMember.user : null;
    let campaignCommittee = currentCampaignMember ? currentCampaignMember.committee : null;
    const isElectorInGuarantees = campaignGuarantees && campaignGuarantees.some(item => item.elector === cell.row.original.id);
    const isElectorInAttendees = campaignAttendees && campaignAttendees.some(item => item.elector === cell.row.original.id);


    // Conditional Display
    const isSuperiorCampaignMember = currentCampaignMember ?
        cell.row.original?.roleId < currentCampaignMember?.roleId : false;

    const isActualCampaignMember = currentCampaignMember ?
        cell.row.original.roleId === currentCampaignMember.roleId : false;

    let conditionalEditDisplay = true;
    let conditionalDeleteDisplay = true;
    if (campaignMember) {
        if (isSuperiorCampaignMember && !isActualCampaignMember) {
            conditionalEditDisplay = false;
            conditionalDeleteDisplay = false
        } else if (isActualCampaignMember) {
            conditionalEditDisplay = true;
            conditionalDeleteDisplay = false
        } else {
            conditionalEditDisplay = true;
            conditionalDeleteDisplay = true
        }
    }


    // const electionCandidateHasCampaign = 


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
                        committee: currentCampaignMemberCommittee,
                        elector: cell.row.original.id,
                        attended: true,
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

                {/* View Item*/}
                {options.includes("view") && (
                    <button
                        to="#"
                        className="btn btn-sm btn-soft-warning edit-list"
                        onClick={() => { handleItemClicks(itemData, "view"); }}
                    >
                        <i className="ri-eye-fill align-bottom" />
                    </button>
                )}

                {/* Update Item*/}
                {options.includes("update") && cellPropId && conditionalEditDisplay && (

                    <button
                        to="#"
                        className="btn btn-sm btn-soft-info edit-list"
                        onClick={() => { handleItemClicks(itemData, "update"); }}
                    >
                        <i className="ri-pencil-fill align-bottom" />
                    </button>
                )}

                {/* Delete Item */}
                {options.includes("delete") && cellPropId && conditionalDeleteDisplay && (
                    <button
                        to="#"
                        className="btn btn-sm btn-soft-danger remove-list"
                        onClick={() => { handleItemDeleteClick(itemData); }}
                    >
                        <i className="ri-delete-bin-5-fill align-bottom" />
                    </button>
                )}


                {options.includes("addCampaign") && (
                    <button
                        to="#"
                        className={`btn btn-sm ${cell.row.original.campaign || null
                            ? "btn-success" : "btn-soft-success"} remove-list`}
                        onClick={() => { handleItemClicks(itemData, "addCampaign"); }}
                    >
                        <i className="mdi mdi-police-badge align-bottom" />
                    </button>
                )}

                {/* AddGuarantee */}
                {options.includes("addGuarantee") && (
                    <div className="flex-shrink-0">
                        {renderElectorGuaranteeButton()}
                    </div>
                )}

                {/* AddAttendee */}

                {options.includes("addAttendee") && isCommitteeDelegate && (
                    <div className="flex-shrink-0">
                        {renderElectorAttendeeButton()}
                    </div>
                )}
            </div>
        </React.Fragment >
    );
};

export default Actions;
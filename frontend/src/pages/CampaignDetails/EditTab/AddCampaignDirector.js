// React & Redux core imports
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Action & Selector imports
import { addCampaignMember, deleteCampaignMember } from "store/actions";
import { userSelector, campaignSelector } from 'selectors';

// Components & Constants
import { DeleteModal } from "shared/components";
import { useDelete } from "shared/hooks";

// UI Components & styling imports
import { Card, Form, CardBody } from "reactstrap";
import SimpleBar from "simplebar-react";


const ADD_CAMPAIGNDirector = () => {
    const dispatch = useDispatch();

    const { campaignId, campaignMembers } = useSelector(campaignSelector);
    const { campaignDirectors } = useSelector(userSelector);

    const {
        handleDeleteItem,
        onDeleteCheckBoxClick,
        setDeleteModal,
        deleteModal,
    } = useDelete(deleteCampaignMember);


    return (
        <React.Fragment>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteItem}
                onCloseClick={() => setDeleteModal(false)}
            />
            {/* <Card>
                <CardBody>
                    <h5>إضافة وكيل للحملة</h5>
                    <SimpleBar className="mx-n4 px-4" data-simplebar="init" style={{ maxHeight: "225px" }}>
                        <div className="vstack gap-3">
                            {campaignDirectors.map((user) => (
                                <div key={user.id}>
                                    <Form
                                        className="tablelist-form"
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h5 className="fs-13 mb-0">
                                                    <Link to="#" className="text-body d-block">
                                                        {user.fullName}
                                                    </Link>
                                                </h5>
                                            </div>
                                            <div className="flex-shrink-0">
                                                {campaignMembers.some((item) => item.user === user.id) ? (
                                                    <p className="text-success">
                                                        {campaignMembers.some((item) => item.user === user.id) && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-soft-danger remove-list"
                                                                onClick={(e) => {
                                                                    const campaignMember = campaignMembers.find(item => item.user === user.id);
                                                                    onDeleteCheckBoxClick(campaignMember);
                                                                }}
                                                            >
                                                                <i className="ri-delete-bin-5-fill align-bottom" />
                                                            </button>
                                                        )}
                                                    </p>
                                                ) : (
                                                    <button
                                                        type="submit"
                                                        className="btn btn-light btn-sm"
                                                        id="add-btn"
                                                        onClick={(e) => {
                                                            const newCampaignDirector = {
                                                                campaign: campaignId,
                                                                user: user.id,
                                                                role: 14,
                                                            };
                                                            dispatch(addCampaignMember(newCampaignDirector));
                                                        }}
                                                    >إضافة</button>
                                                )}
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            ))}
                        </div>
                    </SimpleBar>
                </CardBody>
            </Card> */}
        </React.Fragment>
    );

};

export default ADD_CAMPAIGNDirector;

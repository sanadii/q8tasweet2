import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { ImageGenderCircle, } from "Common/Components";
import { electionSelector } from 'Selectors';

//SimpleBar
import SimpleBar from "simplebar-react";

const ElectionCampaigns = () => {

    const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);

    const moderators = Array.isArray(election.moderators)
        ? election.moderators
        : [];

    return (
        <React.Fragment>
            <Card>
                <CardHeader className="align-items-center d-flex border-bottom-dashed">
                    <h4 className="card-title mb-0 flex-grow-1">الحملات الإنتخابية</h4>
                    <div className="flex-shrink-0">
                        <button
                            type="button"
                            className="btn btn-soft-danger btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#inviteMembersModal"
                        >
                            <i className="ri-add-line me-1 align-bottom"></i>إضافة
                        </button>
                    </div>
                </CardHeader>

                <CardBody>
                    <SimpleBar
                        data-simplebar
                        style={{ height: "235px" }}
                        className="mx-n3 px-3"
                    >
                        {electionCampaigns && electionCampaigns.length ? (
                            electionCampaigns.map((campaign, index) => (

                                <div className="vstack gap-3"
                                    key={campaign.id || index}  // Assuming campaign.id is a unique identifier for each campaign
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-xs flex-shrink-0 me-3">
                                            {campaign.candidate.image ? (
                                                // Use the ImageCircle component here
                                                <ImageGenderCircle
                                                    genderValue={campaign.candidate.gender}
                                                    imagePath={campaign.candidate.image}
                                                />
                                            ) : (
                                                <div className="flex-shrink-0 avatar-xs me-2">
                                                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                                                        {campaign.candidate.name.charAt(0)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="fs-13 mb-0">
                                                <Link to="#" className="text-body d-block">
                                                    {campaign.candidate.name}
                                                </Link>
                                            </h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="d-flex align-items-center gap-1">
                                                <button type="button" className="btn btn-light btn-sm">
                                                    رسالة
                                                </button>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle
                                                        type="button"
                                                        className="btn btn-icon btn-sm fs-16 text-muted dropdown"
                                                        tag="button"
                                                    >
                                                        <i className="ri-more-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <li>
                                                            <DropdownItem>
                                                                <i className="ri-eye-fill text-muted me-2 align-bottom"></i>
                                                                مشاهده
                                                            </DropdownItem>
                                                        </li>
                                                        <li>
                                                            <DropdownItem>
                                                                <i className="ri-star-fill text-muted me-2 align-bottom"></i>
                                                                مفضلة
                                                            </DropdownItem>
                                                        </li>
                                                        <li>
                                                            <DropdownItem>
                                                                <i className="ri-delete-bin-5-fill text-muted me-2 align-bottom"></i>
                                                                حذف
                                                            </DropdownItem>
                                                        </li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>لا توجد حملات إنتخابية</p>
                        )}
                    </SimpleBar>

                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default ElectionCampaigns;

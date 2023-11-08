import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteElectionCampaign } from "store/actions";
import { Link } from "react-router-dom";
import { electionSelector } from 'Selectors';

import { Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import CampaignModal from "./CampaignModal";
import { ImageCandidateCampaign, DeleteModal } from "components";

const CampaignsTab = () => {
  const dispatch = useDispatch();
  const { electionCampaigns } = useSelector(electionSelector);

  const [campaign, setCampaign] = useState([]);
  const [isBookmarkClick, setIsBookmarkClick] = useState(false);
  const [electionCampaignList, setElectionCampaignList] = useState(electionCampaigns);

  const [electionCampaign, setElectionCampaign] = useState([]);

  useEffect(() => {
    setElectionCampaignList(electionCampaigns);
  }, [electionCampaigns]);

  // const [CampaignModal, setCampaignModal] = useState(false);
  // const toggleElectionCampaign = () => {
  //   setCampaignModal(!CampaignModal);
  // };


  // Toggle Profile View

  const [viewedProfileId, setViewedProfileId] = useState(null);
  const [isProfileView, setIsProfileView] = useState(false);

  const toggleProfileView = (campaignId) => {
    setViewedProfileId(viewedProfileId === campaignId ? null : campaignId);
  };




  // Modals: Delete, Set, Edit
  const [deleteModal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Toggle for Add / Edit Models
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElectionCampaign(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteElectionCampaign = () => {
    if (electionCampaign) {
      dispatch(deleteElectionCampaign(electionCampaign.id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (electionCampaign) => {
    setElectionCampaign(electionCampaign);
    setDeleteModal(true);
  };

  return (
    <React.Fragment>
      <CampaignModal
        modal={modal} // boolean to control modal visibility
        setModal={setModal}
        isEdit={isEdit} // boolean to determine if editing
        toggle={toggle}
        electionCampaign={electionCampaign}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteElectionCampaign}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Card className="p-4 g-4">
        <Row className="g-4 mb-3">
          <div className="col-sm">
            <div className="d-flex">
              <div className="search-box me-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search member..."
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
          <div className="col-sm-auto">
            <div>
              <button type="button" className="btn btn-danger" onClick={toggle}>
                <i className="ri-share-line me-1 align-bottom"></i> Add Campaign
              </button>
            </div>
          </div>
        </Row>

        <Row className="gy-2 mb-2" id="campaign-list">
          <div className="team-list list-view-filter">
            {electionCampaigns && electionCampaigns.length > 0 ? (
              electionCampaigns.map((campaign, index) => (
                <Card key={campaign.id} className="team-box">
                  <CardBody className="px-4">
                    <Row className="align-items-center team-row">
                      <div className="col team-settings">
                        <Row className="align-items-center">
                          <div className="col">
                            <div className="flex-shrink-0 me-2">
                              <button
                                type="button"
                                className="btn fs-16 p-0 favourite-btn"
                              >
                                <i className="ri-star-fill"></i>
                              </button>
                            </div>
                          </div>
                          <UncontrolledDropdown className="col text-end">
                            <DropdownToggle tag="a" role="button">
                              <i className="ri-more-fill fs-17"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                              <li>
                                <DropdownItem>
                                  <i className="ri-eye-fill text-muted me-2 align-bottom"></i>
                                  View
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem>
                                  <i className="ri-star-fill text-muted me-2 align-bottom"></i>
                                  Favourite
                                </DropdownItem>
                              </li>

                              <li>
                                <DropdownItem
                                  className="d-flex align-items-center"
                                  onClick={() => onClickDelete(campaign)}
                                >
                                  <i className="ri-delete-bin-5-fill text-muted me-2"></i>
                                  Delete
                                </DropdownItem>
                              </li>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Row>
                      </div>
                      <Col lg={3}>
                        <div className="team-profile-img">
                          <div className="avatar-sm rounded">
                            <ImageCandidateCampaign
                              imagePath={campaign.candidate.image}
                            />
                          </div>

                          <div className="team-content">
                            <Link to="#" className="d-block">
                              <h5 className="fs-16 mb-1">
                                <b>{campaign.candidate.name}</b>
                              </h5>
                            </Link>
                            <p className="text-muted mb-0">
                              رمز المرشح: {campaign.candidate.id}
                            </p>
                            <p className="text-muted mb-0 text-danger">
                              رمز مرشح الإنتخابات: {campaign.electionCandidate}
                            </p>
                            <p className="text-muted mb-0">
                              رمز الحملة: {campaign.id}
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <Row className="text-muted text-center">
                          <Col xs={4} className="border-end border-end-dashed">
                            <h5 className="mb-1">{campaign.id}</h5>
                            <p className="text-muted mb-0">الأعضاء</p>
                          </Col>
                          <Col xs={4}>
                            <h5 className="mb-1">{campaign.id}</h5>
                            <p className="text-muted mb-0">المضامين</p>
                          </Col>
                          <Col xs={4}>
                            <h5 className="mb-1">{campaign.id}</h5>
                            <p className="text-muted mb-0">المؤكدين</p>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} className="col" key={campaign.id}>
                        <div className="text-end">
                          <Link
                            to={`/campaigns/${campaign.id}`} // Dynamic link to campaign details page
                            className="btn btn-soft-success me-1"
                            onClick={() => toggleProfileView(campaign.id)} // toggling the view
                          >
                            {viewedProfileId === campaign.id
                              ? "Hide Profile"
                              : "مشاهدة الحملة"}
                          </Link>

                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              ))
            ) : (
              <p>No campaigns available.</p>
            )}
          </div>
        </Row>
      </Card>
    </React.Fragment>
  );
};

export default CampaignsTab;

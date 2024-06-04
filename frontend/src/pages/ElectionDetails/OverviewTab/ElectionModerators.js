import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import { ImageGenderCircle, Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "shared/components";
import { electionSelector } from 'selectors';

// Components
import ElectionDetailsWidget from "./Widgets";
//SimpleBar
import SimpleBar from "simplebar-react";

const ElectionModerators = () => {

  const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);

  const moderators = Array.isArray(election.moderators)
    ? election.moderators
    : [];

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="align-items-center d-flex border-bottom-dashed">
          <h5 className="card-title mb-0 flex-grow-1">Moderators</h5>
          <div className="flex-shrink-0">
            <button
              type="button"
              className="btn btn-soft-danger btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#inviteMembersModal"
            >
              <i className="ri-add-line me-1 align-bottom"></i>Add
            </button>
          </div>
        </CardHeader>
        <CardBody>
          <SimpleBar
            data-simplebar
            style={{ height: "235px" }}
            className="mx-n3 px-3"
          >
            <div className="vstack gap-3">
              {moderators.map((moderator, index) => (
                <Link key={index} to="#" className="avatar-group-item">
                  {moderator ? (
                    <div className="d-flex align-items-center">
                      <div className="avatar-xs flex-shrink-0 me-3">
                        <img
                          src={
                            process.env.REACT_APP_API_URL + moderator.img
                          }
                          alt={moderator.name}
                          title={moderator.name}
                          alt=""
                          className="img-fluid rounded-circle"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fs-13 mb-0">{moderator.name}</h5>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="d-flex align-items-center gap-1">
                          <button
                            type="button"
                            className="btn btn-light btn-sm"
                          >
                            Message
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
                                <DropdownItem>
                                  <i className="ri-delete-bin-5-fill text-muted me-2 align-bottom"></i>
                                  Delete
                                </DropdownItem>
                              </li>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </div>
                    </div>
                  ) : (
                    "No Moderator"
                  )}
                </Link>
              ))}
            </div>
          </SimpleBar>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ElectionModerators;

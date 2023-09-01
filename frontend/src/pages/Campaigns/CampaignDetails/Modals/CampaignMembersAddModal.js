// --------------- React & Redux imports ---------------
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { getUsers, addNewCampaignMember, updateCampaignMember } from "../../../../store/actions";

// --------------- Reactstrap (UI) imports ---------------
import { Input, ModalBody, Form } from "reactstrap";

// --------------- Utility imports ---------------
import SimpleBar from "simplebar-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CampaignMembersAddModal = ({ campaignId }) => {
  const dispatch = useDispatch();

  const { users, campaignMembers } = useSelector((state) => ({
    users: state.Users.users,
    campaignMembers: state.Campaigns.campaignMembers,
  }));

  const [campaignMemberList, setCampaignMemberList] = useState(campaignMembers);

  useEffect(() => {
    setCampaignMemberList(campaignMembers);
  }, [campaignMembers]);

  // Dispatch getMember TODO: MOVE TO ELECTION DETAILS
  useEffect(() => {
    if (users && !users.length) {
      dispatch(getUsers());
    }
  }, [dispatch, users]);

  // Add New CampaignMember Search & Filter
  const [searchUserInput, setSearchUserInput] = useState("");
  const [userList, setUserList] = useState(users);

  const campaign_id = useSelector(
    (state) => state.Campaigns.campaignDetails.id
  );

  useEffect(() => {
    setUserList(
      users.filter((users) =>
        users.first_name.toLowerCase().includes(searchUserInput.toLowerCase())
      )
    );
  }, [users, searchUserInput]);

  const { electionCommittees } = useSelector((state) => ({
    electionCommittees: state.Campaigns.electionCommittees,
  }));

  const [electionCommitteeList, setElectionCommitteeList] =
    useState(electionCommittees);

  useEffect(() => {
    setElectionCommitteeList(electionCommittees);
  }, [electionCommittees]);

  const supervisorMembers = campaignMembers.filter(
    (member) => member.rank === 3
  );

  return (
    <ModalBody className="p-4">
      <div className="search-box mb-3">
        <Input
          type="text"
          className="form-control bg-light border-light"
          placeholder="Search here..."
          value={searchUserInput}
          onChange={(e) => setSearchUserInput(e.target.value)}
        />
        <i className="ri-search-line search-icon"></i>
      </div>

      <SimpleBar
        className="mx-n4 px-4"
        data-simplebar="init"
        style={{ maxHeight: "225px" }}
      >
        <div className="vstack gap-3">
          {users.map((user) => (
            <Form
              key={user.id} // Add key prop here to resolve the react/jsx-key error
              className="tablelist-form"
              onSubmit={(e) => {
                e.preventDefault(); // Prevent page refresh
                console.log(
                  "Submitting form for user ID:",
                  user.id
                );
                const newCampaignMember = {
                  id: (
                    Math.floor(Math.random() * (100 - 20)) + 20
                  ).toString(),
                  campaignId: campaign_id,
                  userId: user.id,
                };
                console.log(
                  "New campaign member:",
                  newCampaignMember
                );
                dispatch(addNewCampaignMember(newCampaignMember));
              }}
            >
              <div className="d-flex align-items-center">
                <input
                  type="hidden"
                  id="id-field"
                  name="id"
                  value={user.id}
                />
                {user.id}
                <div className="avatar-xs flex-shrink-0 me-3">
                  <img
                    src={user.image}
                    alt=""
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div className="flex-grow-1">
                  <h5 className="fs-13 mb-0">
                    <Link to="#" className="text-body d-block">
                      {user.username}
                    </Link>
                  </h5>
                </div>
                <div className="flex-shrink-0">
                  {campaignMembers.some(
                    (item) => item.user.id === user.id
                  ) ? (
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      disabled
                    >
                      ADDED
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-light btn-sm"
                      id="add-btn"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </Form>
          ))}
        </div>
      </SimpleBar>
    </ModalBody>
  );
};

export default CampaignMembersAddModal;

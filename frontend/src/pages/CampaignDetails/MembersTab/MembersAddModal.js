// React & Redux core imports
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Action & Selector imports
import { getUsers, addCampaignMember } from "store/actions";
import { userSelector, campaignSelector } from 'selectors';

// UI Components & styling imports
import { Input, ModalBody, Form } from "reactstrap";
import SimpleBar from "simplebar-react";

const MembersAddModal = () => {
  const dispatch = useDispatch();

  const { campaignId, campaignMembers, campaignElectionCommittees } = useSelector(campaignSelector);
  const { users } = useSelector(userSelector);

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
      users.filter((user) =>
        user.fullName ? user.fullName
          .toLowerCase().includes(searchUserInput
            .toLowerCase()) : false
      )
    );
  }, [users, searchUserInput]);



  const [electionCommitteeList, setElectionCommitteeList] =
    useState(campaignElectionCommittees);

  useEffect(() => {
    setElectionCommitteeList(campaignElectionCommittees);
  }, [campaignElectionCommittees]);

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
                const newCampaignMember = {
                  campaign: campaignId,
                  user: user.id,
                  role: 3900, // campaignDelegate
                };
                dispatch(addCampaignMember(newCampaignMember));
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
                      {user.fullName}
                    </Link>
                  </h5>
                </div>
                <div className="flex-shrink-0">
                  {campaignMembers.some(
                    (item) => item.user === user.id
                  ) ? (
                    <p
                      className="text-success"
                    >
                      تمت الإضافة
                    </p>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-light btn-sm"
                      id="add-btn"
                    >
                      إضافة
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

export default MembersAddModal;

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

  // Fetch users if not available
  useEffect(() => {
    if (!users.length) {
      dispatch(getUsers());
    }
  }, [dispatch, users]);

  // Search state and filtered users
  const [searchUserInput, setSearchUserInput] = useState("");
  const filteredUsers = users.filter((user) =>
    user.fullName ? user.fullName.toLowerCase().includes(searchUserInput.toLowerCase()) : false
  );

  // Election committee list (unchanged)
  const [electionCommitteeList, setElectionCommitteeList] = useState(campaignElectionCommittees);
  useEffect(() => {
    setElectionCommitteeList(campaignElectionCommittees);
  }, [campaignElectionCommittees]);

  // Reusable function to check user membership
  const isMember = (userId) => campaignMembers.some((item) => item.user === userId);

  const handleUserSubmit = (user) => {
    const newCampaignMember = {
      campaign: campaignId,
      user: user.id,
      role: 3320, // Assuming role is constant
    };
    dispatch(addCampaignMember(newCampaignMember));
  };

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

      <SimpleBar className="mx-n4 px-4" data-simplebar="init" style={{ maxHeight: "225px" }}>
        <div className="vstack gap-3">
          {filteredUsers.map((user) => (
            <Form key={user.id} className="tablelist-form" onSubmit={(e) => e.preventDefault()}>
              <div className="d-flex align-items-center">
                <input type="hidden" id="id-field" name="id" value={user.id} />
                {user.id}
                <div className="avatar-xs flex-shrink-0 me-3">
                  <img src={user.image} alt="" className="img-fluid rounded-circle" />
                </div>
                <div className="flex-grow-1">
                  <h5 className="fs-13 mb-0">
                    <Link to="#" className="text-body d-block">
                      {user.fullName}
                    </Link>
                  </h5>
                </div>
                <div className="flex-shrink-0">
                  {isMember(user.id) ? (
                    <p className="text-success">تمت الإضافة</p>
                  ) : (
                    <button type="submit" className="btn btn-light btn-sm" id="add-btn" onClick={() => handleUserSubmit(user)}>
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

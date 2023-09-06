import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  StatusOptions,
  PriorityOptions,
  MemberRankOptions,
  GenderOptions,
  GuaranteeStatusOptions,
} from "../../Components/constants";
import classnames from "classnames";
// ADD ONGOING ELECTION FILTER

import { Nav, NavItem, NavLink, Input } from "reactstrap";
// import { ElectionCategoryFilter } from "../../Components/Hooks/CategoryHooks";

export const Filter = ({ column }) => {
  return (
    <div style={{ marginTop: 5 }}>
      {column.canFilter && column.render("Filter")}
    </div>
  );
};

const DefaultColumnFilter = ({
  column: {
    filterValue,
    setFilter,
    preFilteredRows: { length },
  },
}) => {
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`search (${length}) ...`}
    />
  );
};

const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <select
      id="custom-select"
      className="form-select"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const PriorityFilter = ({ setElectionList }) => {
  const elections = useSelector((state) => state.Elections.elections);

  const ChangeElectionPriority = (e) => {
    const selectedPriorityId = parseInt(e, 10); // Convert string to integer
    if (selectedPriorityId || selectedPriorityId === 0) {
      setElectionList(
        elections.filter((item) => item.priority === selectedPriorityId)
      );
    } else {
      setElectionList(elections);
    }
  };

  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            name="choices-select-priority"
            id="choices-select-priority"
            onChange={(e) => ChangeElectionPriority(e.target.value)}
          >
            <option value="">- All Priorities - </option>
            {PriorityOptions.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};

const StatusFilter = ({ setElectionList }) => {
  const elections = useSelector((state) => state.Elections.elections);

  const ChangeElectionStatus = (e) => {
    const selectedStatusId = parseInt(e, 10); // Convert string to integer
    if (selectedStatusId || selectedStatusId === 0) {
      setElectionList(
        elections.filter((item) => item.status === selectedStatusId)
      );
    } else {
      setElectionList(elections);
    }
  };

  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            name="choices-select-status"
            id="choices-select-status"
            onChange={(e) => ChangeElectionStatus(e.target.value)}
          >
            <option value="">- All Statuses - </option>
            {StatusOptions.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};

const GuaranteeStatusFilter = ({ setCampaignGuaranteeList }) => {
  const campaignGuarantees = useSelector(
    (state) => state.Campaigns.campaignGuarantees
  );

  const ChangeCampaignGuaranteeStatus = (e) => {
    const selectedStatusId = parseInt(e, 10); // Convert string to integer
    if (selectedStatusId || selectedStatusId === 0) {
      setCampaignGuaranteeList(
        campaignGuarantees.filter((item) => item.status === selectedStatusId)
      );
    } else {
      setCampaignGuaranteeList(campaignGuarantees);
    }
  };

  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            name="choices-select-status"
            id="choices-select-status"
            onChange={(e) => ChangeCampaignGuaranteeStatus(e.target.value)}
          >
            <option value="">- All Statuses - </option>
            {GuaranteeStatusOptions.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};

const CandidateGenderFilter = ({ setElectionCandidateList }) => {
  const electionCandidates = useSelector(
    (state) => state.Elections.electionCandidates
  );

  const ChangeCandidateGender = (e) => {
    const selectedGender = e ? Number(e) : null; // Convert to number

    if (selectedGender) {
      setElectionCandidateList(
        electionCandidates.filter((item) => item.gender === selectedGender)
      );
    } else {
      setElectionCandidateList(electionCandidates); // Reset to original list if no gender selected
    }
  };

  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            name="choices-select-gender"
            id="choices-select-gender"
            onChange={(e) => ChangeCandidateGender(e.target.value)}
          >
            <option value="">- All Genders - </option>
            {GenderOptions.map((gender) => (
              <option key={gender.id} value={gender.id}>
                {gender.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};

const CampaignRankFilter = ({ onTabChange, setCampaignMemberList }) => {
  const campaignMembers = useSelector(
    (state) => state.Campaigns.campaignMembers
  );
  const currentCampaignMemberRank = useSelector(
    (state) => state.Campaigns.currentCampaignMember.rank
  );

  const ranks = MemberRankOptions.filter((rank) =>
    rank.showTo.includes(currentCampaignMemberRank)
  );

  // // const ranks = MemberRankOptions;
  // const ranks = MemberRankOptions.filter((rank) => rank.id !== 1);

  const [activeTab, setActiveTab] = useState("all");

  // Compute the count for each rank
  const rankCounts = ranks.reduce((counts, rank) => {
    counts[rank.id] = campaignMembers.filter(
      (item) => item.rank === rank.id
    ).length;
    return counts;
  }, {});

  const ChangeCampaignRank = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      onTabChange(tab);

      const filteredCampaignMembers =
        tab === "all"
          ? campaignMembers
          : campaignMembers.filter((item) => item.rank === tab);

      setCampaignMemberList(filteredCampaignMembers);
    }
  };

  return (
    <React.Fragment>
      <div>
        <Nav
          className="nav-tabs-custom card-header-tabs border-bottom-0"
          role="tablist"
        >
          <NavItem>
            <NavLink
              className={classnames(
                { active: activeTab === "all" },
                "fw-semibold"
              )}
              onClick={() => ChangeCampaignRank("all")}
              href="#"
            >
              All
            </NavLink>
          </NavItem>
          {ranks.map((rank) => (
            <NavItem key={rank.id}>
              <NavLink
                className={classnames(
                  { active: activeTab === rank.id },
                  "fw-semibold"
                )} // Compare with rank.id directly
                onClick={() => ChangeCampaignRank(rank.id)} // Pass rank.id directly
                href="#"
              >
                {rank.name}
                <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                  {rankCounts[rank.id]}
                </span>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
    </React.Fragment>
  );
};

const GuaranteeGenderFilter = ({ setCampaignGuaranteeList }) => {
  const campaignGuarantees = useSelector(
    (state) => state.Campaigns.campaignGuarantees
  );

  const ChangeGuaranteeGender = (e) => {
    const selectedGender = e ? Number(e) : null; // Convert to number

    if (selectedGender) {
      setCampaignGuaranteeList(
        campaignGuarantees.filter((item) => item.gender === selectedGender)
      );
    } else {
      setCampaignGuaranteeList(campaignGuarantees); // Reset to original list if no gender selected
    }
  };

  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            name="choices-select-gender"
            id="choices-select-gender"
            onChange={(e) => ChangeGuaranteeGender(e.target.value)}
          >
            <option value="">- All Genders - </option>
            {GenderOptions.map((gender) => (
              <option key={gender.id} value={gender.id}>
                {gender.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};

const GuaranteeAttendanceFilter = ({ setCampaignGuaranteeList }) => {
  const campaignGuarantees = useSelector(
    (state) => state.Campaigns.campaignGuarantees
  );

  const AttendanceOptions = [
    { id: true, name: "Attended" },
    { id: false, name: "Not Attended" },
  ];

  const ChangeGuaranteeAttendance = (e) => {
    const selectedAttendance = e === "true" ? true : e === "false" ? false : null;
  
    console.log("Selected Attendance:", selectedAttendance);
  
    if (selectedAttendance !== null) {
      console.log("Filtering campaignGuarantees based on attendance:", selectedAttendance);
      setCampaignGuaranteeList(
        campaignGuarantees.filter((item) => item.attended === selectedAttendance)
      );
    } else {
      console.log("Resetting campaignGuarantees to original list.");
      setCampaignGuaranteeList(campaignGuarantees); // Reset to original list if no attendance selected
    }
  };
  
  

  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            name="choices-select-attendeed"
            id="choices-select-attendeed"
            onChange={(e) => ChangeGuaranteeAttendance(e.target.value)}
          >
            <option value="">- All Attendances - </option>
            {AttendanceOptions.map((attendeed) => (
              <option key={attendeed.id} value={attendeed.id}>
                {attendeed.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};

const AttendeeGenderFilter = ({ setElectionAttendeeList }) => {
  const electionAttendees = useSelector(
    (state) => state.Campaigns.electionAttendees
  );

  const ChangeAttendeeGender = (e) => {
    const selectedGender = e ? Number(e) : null; // Convert to number

    if (selectedGender) {
      setElectionAttendeeList(
        electionAttendees.filter((item) => item.gender === selectedGender)
      );
    } else {
      setElectionAttendeeList(electionAttendees); // Reset to original list if no gender selected
    }
  };

  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            name="choices-select-gender"
            id="choices-select-gender"
            onChange={(e) => ChangeAttendeeGender(e.target.value)}
          >
            <option value="">- All Genders - </option>
            {GenderOptions.map((gender) => (
              <option key={gender.id} value={gender.id}>
                {gender.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};

const GuarantorFilter = ({ setCampaignGuaranteeList }) => {
  const { campaignMembers, campaignGuarantees } = useSelector((state) => ({
    campaignMembers: state.Campaigns.campaignMembers,
    campaignGuarantees: state.Campaigns.campaignGuarantees,
  }));

  const [sortedGurantorOptions, setSortedGuarantorOptions] = useState([]);

  useEffect(() => {
    const GurantorOptions = campaignMembers.filter(
      (member) => member.rank === 2 || member.rank === 3 || member.rank === 4
    );

    // console.log("Filtered Gurantor Options:", GurantorOptions); // Check the filtered guarantor options

    setSortedGuarantorOptions(GurantorOptions.sort((a, b) => a.rank - b.rank));
  }, [campaignMembers]);

  const ChangeGuaranteeRank = (selectedRank) => {
    // console.log("Selected Rank:", selectedRank); // Check which rank is selected

    if (selectedRank) {
      const filteredGuarantees = campaignGuarantees.filter(
        (item) => item.member === parseInt(selectedRank)
      );
      // console.log("Filtered Guarantees:", filteredGuarantees); // Check the results of the filtering
      setCampaignGuaranteeList(filteredGuarantees);
    } else {
      setCampaignGuaranteeList(campaignGuarantees);
    }
  };
  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            name="choices-select-guarantor"
            id="choices-select-guarantor"
            onChange={(e) => ChangeGuaranteeRank(e.target.value)}
          >
            <option value="">- All Ranks - </option>
            {sortedGurantorOptions.map((guarantor) => (
              <option key={guarantor.id} value={guarantor.id}>
                {guarantor.user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};

const ElectionCategoryFilter = ({ setElectionList }) => {
  const elections = useSelector((state) => state.Elections.elections);
  const categories = useSelector((state) => state.Categories.categories);

  const [activeTab, setActiveTab] = useState("0");

  // Compute the count for each category
  const categoryCounts = categories.reduce((counts, category) => {
    counts[category.id] = elections.filter(
      (item) => item.category === category.id
    ).length;
    return counts;
  }, {});

  const ChangeElectionCategory = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredElections = elections;
      if (type !== "all") {
        filteredElections = elections.filter((item) => item.category === type);
      }
      setElectionList(filteredElections);
    }
  };

  return (
    <React.Fragment>
      <div>
        <Nav
          className="nav-tabs-custom card-header-tabs border-bottom-0"
          role="tablist"
        >
          <NavItem>
            <NavLink
              className={classnames(
                { active: activeTab === "0" },
                "fw-semibold"
              )}
              onClick={() => {
                // console.log("Tab 'All' clicked.");
                ChangeElectionCategory("0", "all");
              }}
              href="#"
            >
              All
            </NavLink>
          </NavItem>
          {categories.map((category, index) => (
            <NavItem key={category.id}>
              <NavLink
                className={classnames(
                  { active: activeTab === String(index + 1) },
                  "fw-semibold"
                )}
                onClick={() => {
                  // console.log(`Tab with category ID: ${category.id} clicked.`);
                  ChangeElectionCategory(String(index + 1), category.id);
                }}
                href="#"
              >
                {category.name}
                <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                  {categoryCounts[category.id]}{" "}
                  {/* Replace with actual badge count */}
                </span>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
    </React.Fragment>
  );
};

const ElectionCommitteeFilter = ({ setElectionAttendeeList }) => {
  const { electionAttendees, electionCommittees } = useSelector((state) => ({
    electionAttendees: state.Campaigns.electionAttendees,
    electionCommittees: state.Campaigns.electionCommittees,
  }));

  // We removed useMemo, sorting directly
  const sortedCommitteeOptions = [...electionCommittees].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const ChangeCommitteeOption = (selectedCommittee) => {
    if (selectedCommittee) {
      const filteredAttendees = electionAttendees.filter(
        (item) => item.committee === parseInt(selectedCommittee)
      );
      setElectionAttendeeList(filteredAttendees);
    } else {
      // Reset to all attendees when no committee is selected
      setElectionAttendeeList(electionAttendees);
    }
  };

  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select
            className="form-control"
            name="choices-select-committee"
            id="choices-select-committee"
            onChange={(e) => ChangeCommitteeOption(e.target.value)}
          >
            <option value="">- All Committees - </option>
            {sortedCommitteeOptions.map((committee) => (
              <option key={committee.id} value={committee.id}>
                {committee.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};

const ResetFilters = () => {
  return (
    <React.Fragment>
      <button type="button" className="btn btn-danger">
        <i className="ri-filter-2-line me-1 align-bottom"></i> Reset
      </button>
    </React.Fragment>
  );
};

export {
  DefaultColumnFilter,
  SelectColumnFilter,

  // Election Filters
  StatusFilter,
  PriorityFilter,
  ElectionCategoryFilter,
  CandidateGenderFilter,
  GuaranteeGenderFilter,
  AttendeeGenderFilter,
  GuaranteeAttendanceFilter,
  GuaranteeStatusFilter,
  // CampaignRankFilter,
  CampaignRankFilter,
  GuarantorFilter,
  // Reset Filters
  ResetFilters,
  ElectionCommitteeFilter,
};

import React from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';

const ElectionCommitteeFilter = ({ filters, setFilters }) => {
    const { electionAttendees, electionCommittees } = useSelector(electionSelector);

    // Directly sorting the committees
    const sortedCommitteeOptions = [...electionCommittees].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    const ChangeCommitteeOption = (e) => {
        const selectedCommittee = e.target.value ? parseInt(e.target.value, 10) : null;

        // Update the filters
        setFilters(prev => ({
            ...prev,
            committee: selectedCommittee,
        }));
    };

    return (
        <React.Fragment>
            <div className="col-lg-3 col-sm-2">
                <strong>اللجان</strong>
                <div className="input-light">
                    <select
                        className="form-select form-control"
                        name="choices-select-committee"
                        id="choices-select-committee"
                        onChange={ChangeCommitteeOption}
                        value={filters.committee || ''}
                    >
                        <option value="">- جميع اللجان - </option>
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

export default ElectionCommitteeFilter;

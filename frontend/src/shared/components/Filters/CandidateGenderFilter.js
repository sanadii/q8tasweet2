import React from "react";
import { useSelector } from "react-redux";
import { GenderOptions } from "shared/constants";
import { electionSelector } from 'Selectors';

const CandidateGenderFilter = ({ setElectionCandidateList }) => {
    const electionCandidates = useSelector(electionSelector);

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
            <div className="col-lg-3 col-sm-2">
                <div className="input-light">
                    <select
                        className="form-select form-control"
                        name="choices-select-gender"
                        id="choices-select-gender"
                        onChange={(e) => ChangeCandidateGender(e.target.value)}
                    >
                        <option value="">- الكل - </option>
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

export default CandidateGenderFilter;

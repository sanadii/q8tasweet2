// React & Redux core imports
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Action & Selector imports
import { getCandidates, addElectionCandidate } from "store/actions";
import { electionSelector, candidateSelector } from 'selectors';

// UI Components & styling imports
import { Input, Form } from "reactstrap";
import SimpleBar from "simplebar-react";

// Component for election candidate search
const ElectionCandidateSearch = ({ value, onChange }) => (
    <div className="search-box mb-3">
        <Input
            type="text"
            className="form-control bg-light border-light"
            placeholder="البحث عن المرشحين..."
            value={value}
            onChange={onChange}
        />
        <i className="ri-search-line search-icon"></i>
    </div>
);

// Component for election party input field
const ElectionPartyInputField = ({ value, onChange, parties }) => (
    <select
        id="id-field"
        name="id"
        onChange={onChange}
        value={value}
    >
        <option key={0} value={null}>
            - اختر القائمة -
        </option>
        {parties.map((item, index) => (
            <option
                key={index}
                value={parseInt(item.id, 10)}>
                {item.name}
            </option>
        ))}
    </select>
);

const AddElectionCandidate = () => {
    const dispatch = useDispatch();
    const { electionId, electionMethod, electionCandidates, electionParties } = useSelector(electionSelector);
    const { candidates } = useSelector(candidateSelector);
    const electionCandidateList = electionCandidates;

    // Dispatch getCandidates TODO: MOVE TO ELECTION DETAILS
    useEffect(() => {
        if (candidates && !candidates.length) {
            dispatch(getCandidates());
        }
    }, [dispatch, candidates]);

    // Add New ElectionCandidate Search & Filter
    const [searchCandidateInput, setSearchCandidateInput] = useState("");
    const [candidateList, setCandidateList] = useState(candidates);
    const [selectedParty, setSelectedParty] = useState(null);

    // Handler for when the selection changes
    const setElectionParty = useCallback((event) => {
        setSelectedParty(event.target.value);
        // Additional actions can be performed here if needed
    }, []);

    useEffect(() => {
        setCandidateList(
            candidates.filter((candidate) =>
                candidate.name ? candidate.name
                    .toLowerCase().includes(searchCandidateInput
                        .toLowerCase()) : false
            )
        );
    }, [candidates, searchCandidateInput]);

    return (
        <React.Fragment>
            <ElectionCandidateSearch
                value={searchCandidateInput}
                onChange={(e) => setSearchCandidateInput(e.target.value)}
            />
            {electionMethod !== "candidateOnly" && (
                <ElectionPartyInputField
                    value={selectedParty}
                    onChange={setElectionParty}
                    parties={electionParties}
                />
            )}

            <SimpleBar
                className="mx-n4 px-4"
                data-simplebar="init"
                style={{ maxHeight: "225px" }}
            >
                <div className="vstack gap-3">
                    {candidateList.map((candidate) => (
                        <Form
                            key={candidate.id}
                            className="tablelist-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const newElectionCandidate = {
                                    ...(electionMethod !== "candidateOnly") && { electionParty: selectedParty ? parseInt(selectedParty, 10) : null },
                                    candidate: candidate.id,
                                    election: electionId
                                };
                                dispatch(addElectionCandidate(newElectionCandidate));
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <input
                                    type="hidden"
                                    id="id-field"
                                    name="id"
                                    value={candidate.id}
                                />
                                <div className="avatar-xs flex-shrink-0 me-3">
                                    <img src={candidate.image} alt="" className="img-fluid rounded-circle" />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-13 mb-0">
                                        {candidate.name}
                                    </h5>
                                </div>
                                <div className="flex-shrink-0">
                                    {electionCandidateList.some(
                                        (item) => item.candidate === candidate.id
                                    ) ? (
                                        <p className="text-success">
                                            تمت الإضافة
                                        </p>
                                    ) : (
                                        <button type="submit" className="btn btn-light btn-sm" id="add-btn">
                                            أضف
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Form>
                    ))}
                </div>
            </SimpleBar>
        </React.Fragment>
    );
};

export default AddElectionCandidate;

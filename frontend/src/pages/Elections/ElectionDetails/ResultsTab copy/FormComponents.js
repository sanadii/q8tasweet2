import React, { useState, useEffect } from 'react';

const VotesInputField = ({ candidateId, committeeId, votes, handleEditCell }) => {
    const [localVote, setLocalVotes] = useState(votes);

    useEffect(() => {
        setLocalVotes(votes); // This will sync the local state with the prop when it changes
    }, [votes]);

    const handleBlur = () => {
        handleEditCell(candidateId, committeeId, localVote);
    };

    return (
        <input
            key={`${candidateId}-${committeeId}`}
            type="text"
            maxLength="3"
            pattern="\d*"
            inputMode="numeric"
            style={{ width: "3em" }}
            value={localVote}
            onChange={(e) => setLocalVotes(e.target.value)}
            onBlur={handleBlur}
        />
    );
};


const CommitteeButton = ({ committeeId, committee, isEdited, hasChanges, handleSaveCommitteeResults, toggleCommitteeToEdit }) => {
    const buttonText = isEdited ? (hasChanges ? 'حفظ' : 'اغلاق') : (committee ? committee.name : `Committee ${committeeId}`);
    const buttonClass = isEdited ? (hasChanges ? 'btn-success' : 'btn-danger') : 'btn-info';

    const handleClick = () => {
        if (isEdited && hasChanges) {
            handleSaveCommitteeResults(committeeId);
        }
        toggleCommitteeToEdit(committeeId);
    };

    return (
        <button onClick={handleClick} className={`btn btn-sm ml-2 ${buttonClass}`}>
            {buttonText}
        </button>
    );
};


export {
    VotesInputField,
    CommitteeButton,
};

import React, { useState, useEffect } from 'react';


const CommitteeVoteButton = ({ committeeId, committee, isEdited, hasChanges, handleSaveCommitteeResults, toggleCommitteeToEdit }) => {
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
    CommitteeVoteButton,
};

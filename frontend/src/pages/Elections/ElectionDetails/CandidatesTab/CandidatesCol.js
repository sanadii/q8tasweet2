import React from "react";
import { ImageCandidateWinnerCircle } from "shared/components";


const Id = (cellProps) => {
    return (
        <React.Fragment>
            {cellProps.row.original.id}
        </React.Fragment>
    );
};

const CheckboxHeader = ({ checkedAll }) => (
    <input
        type="checkbox"
        id="checkBoxAll"
        className="form-check-input"
        onClick={checkedAll}
    />
);

const CheckboxCell = ({ row, deleteCheckbox }) => (
    <input
        type="checkbox"
        className="checkboxSelector form-check-input"
        value={row.original.id}
        onChange={deleteCheckbox}
    />
);

const Position = (cellProps) => {
    return <p>{cellProps.row.original.position}</p>;
}

const Name = ({ row }) => {
    return (
        <ImageCandidateWinnerCircle
            gender={row.original.gender}
            name={row.original.name}
            imagePath={row.original.image}
            isWinner={row.original.isWinner}
        />
    );
};


const Votes = (cellProps) => {
    return <p>{cellProps.row.original.votes}</p>;
}

const Actions = (cellProps) => {
    const { setElectionCandidate, handleElectionCandidateClick, setIsElectionPartyAction, onDeleteCheckBoxClick } = cellProps;
    const electionCandidate = cellProps.row.original;

    return (
        <div className="list-inline hstack gap-2 mb-0">
            {/* <button
                to="#"
                className="btn btn-sm btn-soft-primary edit-list"
                onClick={() => {
                    setElectionCandidate(electionCandidate);
                }}
            >
                <i className="ri-phone-line align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-success edit-list"
                onClick={() => {
                    setElectionCandidate(electionCandidate);
                }}
            >
                <i className="ri-question-answer-line align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                    setElectionCandidate(electionCandidate);
                }}
            >
                <i className="ri-eye-fill align-bottom" />
            </button> */}
            <button
                to="#"
                className="btn btn-sm btn-soft-info edit-list"
                onClick={() => {
                    handleElectionCandidateClick(electionCandidate);
                }}
            >
                <i className="ri-pencil-fill align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                    setIsElectionPartyAction(false); // Set isPartyAction to true when this button is clicked
                    onDeleteCheckBoxClick(electionCandidate);
                }}
            >
                <i className="ri-delete-bin-5-fill align-bottom" />
            </button>
        </div>
    );

};

export {
    Id,
    CheckboxHeader,
    CheckboxCell,
    Votes,
    Name,
    Position,
    Actions,
};

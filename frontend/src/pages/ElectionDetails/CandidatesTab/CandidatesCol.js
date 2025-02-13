import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ImageCandidateWinnerCircle } from "shared/components";
import { addCampaign, deleteCampaign } from "store/actions";





const Id = (cellProps) => {
    return (
        <React.Fragment>
            {cellProps.row.original.id}
        </React.Fragment>
    );
};

const CheckboxHeader = ({ handleCheckAllClick }) => (
    <input
        type="checkbox"
        id="checkBoxAll"
        className="form-check-input"
        onClick={handleCheckAllClick}
    />
);

const CheckboxCell = ({ row, handleCheckCellClick }) => (
    <input
        type="checkbox"
        className="checkboxSelector form-check-input"
        value={row.original.id}
        onChange={handleCheckCellClick}
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
    const dispatch = useDispatch();

    const { setElectionCandidate, handleElectionCandidateClick, setIsElectionPartyAction, handleItemDeleteClick } = cellProps;
    const electionCandidate = cellProps.row.original;

    const handleAddNewCampaign = (electionCandidateId) => {
        const newCampaign = {
            election_candidate: electionCandidateId,
        };
        dispatch(addCampaign(newCampaign));
    };

    const hasCampaign = electionCandidate.campaign

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
                    handleAddNewCampaign(electionCandidate?.id);
                }}
            >
                <i className="ri-delete-bin-5-fill align-bottom" />
            </button>
            <button
                className={`btn btn-sm ${hasCampaign ? "btn-success" : "btn-soft-success"} remove-list`}
                onClick={() => {
                    // if (!hasCampaign) {
                        handleAddNewCampaign(electionCandidate?.id);
                    // }
                }}
            >
                <i className="mdi mdi-police-badge align-bottom" />
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

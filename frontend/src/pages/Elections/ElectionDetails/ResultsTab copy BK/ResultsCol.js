import React from "react";
import { ImageCandidateWinnerCircle } from "Common/Components";


const Id = (cellProps) => {
    return (
        <React.Fragment>
            {cellProps.row.original.id}
        </React.Fragment>
    );
};


const Position = (cellProps) => {
    const { electionCandidates } = cellProps;
    const candidateId = cellProps.row.original['candidate.id'];
    const candidate = electionCandidates.find((candidate) => candidate.id === candidateId);

    if (!candidate) {
        return <p className="text-danger"><strong>Not Found (ID: {candidateId})</strong></p>;
    }

    return (
        <>
            {candidate.position}
        </>
    );
};





const Name = (cellProps) => {
    const { electionCandidates } = cellProps;
    const candidateId = cellProps.row.original['candidate.id'];
    const candidate = electionCandidates.find((candidate) => candidate.id === candidateId);
    return (
        <ImageCandidateWinnerCircle
            gender={candidate.gender}
            name={candidate.name}
            imagePath={candidate.image}
            isWinner={candidate.isWinner}
        />
    );
};



const Total = (cellProps) => {
    return <p>{cellProps.row.original.votes}</p>;
}

const Actions = (cellProps) => {
    const { setElectionCandidate, handleElectionCandidateClick, onClickDelete } = cellProps;
    const electionCandidate = cellProps.row.original;

    return (
        <div className="list-inline hstack gap-2 mb-0">
            <button
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
            </button>
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
                    onClickDelete(electionCandidate);
                }}
            >
                <i className="ri-delete-bin-5-fill align-bottom" />
            </button>
        </div>
    );

};

export {
    Id,
    Name,
    Total,
    Position,
    Actions,
};

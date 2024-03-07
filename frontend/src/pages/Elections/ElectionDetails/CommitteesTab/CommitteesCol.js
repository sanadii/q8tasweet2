import React from "react";
import { ImageCandidateWinnerCircle } from "shared/components";
import { GenderOptions } from "shared/constants/";


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
        <p>
            {row.original.name}
        </p>
    );
};

const Gender = ({ row }) => {
    const gender = GenderOptions.find(g => g.id === row.original.gender);

    return (
        <p>
            {gender.pleural}
        </p>
    );
};

const Sorter = ({ cellProps, electionSorters, electionCampaigns }) => {
    // console.log("22 electionSorters: ", electionSorters);
    const sorter = electionSorters.find(s => s.user === cellProps.row.original.sorter);
    const campaign = electionCampaigns.find(c => c.id === sorter?.campaign )

    return (
        <p>
            {sorter ? sorter.name : 'No Sorter'} <br/>
            {campaign ? campaign.name : 'No Campaign'}

        </p>

    );
};

const Votes = (cellProps) => {
    return <p>{cellProps.row.original.votes}</p>;
}

const Actions = (cellProps) => {
    const { setElectionCommittee, handleElectionCommitteeClick, onClickDelete } = cellProps;
    const electionCommittee = cellProps.row.original;

    return (
        <div className="list-inline hstack gap-2 mb-0">
            <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                    setElectionCommittee(electionCommittee);
                }}
            >
                <i className="ri-eye-fill align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-info edit-list"
                onClick={() => {
                    handleElectionCommitteeClick(electionCommittee);
                }}
            >
                <i className="ri-pencil-fill align-bottom" />
            </button>
            <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                    onClickDelete(electionCommittee);
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
    Gender,
    Sorter,
    Position,
    Actions,
};

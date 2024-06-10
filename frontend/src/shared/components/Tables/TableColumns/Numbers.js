const SimpleNumber = ({ number }) => {
    return (
        <strong>{number}</strong>
    );
};

const CandidatePosition = ({ position }) => {
    return (
        <strong>{position}</strong>
    );
};

const CandidateVotes = ({ candidateVotes }) => {
    return (
        <strong className="text-success">
            {candidateVotes ? candidateVotes : '-'}
        </strong>
    );
}


export { SimpleNumber, CandidatePosition, CandidateVotes }
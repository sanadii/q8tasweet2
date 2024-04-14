const VotesInputField = ({
    candidateId,
    committeeId,
    votes,
    modifiedData,
    handleEditCell,
  }) => (
    <input
      key={`${candidateId}-${committeeId}`}
      type="text"
      maxLength="5"
      pattern="\d*"
      inputMode="numeric"
      style={{ width: "3em" }}
      value={votes}
      onChange={(e) => handleEditCell(candidateId, committeeId, e.target.value)}
    />
  );
  
  export default VotesInputField;
  
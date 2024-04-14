import React from "react";
import { useSelector } from "react-redux";
import { categorySelector } from 'selectors';
import { Link } from "react-router-dom";

// Component, Constants & Hooks
import { StatusOptions, PriorityOptions } from "shared/constants/";
import { ResultCandidateName } from "shared/components";
import { handleValidDate } from "shared/utils";

const Id = (cellProps) => {
  return (
    <React.Fragment>
      <Link
        to={`/dashboard/elections/${cellProps.row.original.slug}`}
        className="fw-medium link-primary"
      >
        {cellProps.row.original.id}
      </Link>{" "}
    </React.Fragment>
  );
};


const Position = (cellProps) => {
  const candidatePosition = cellProps.row.original.position;

  return (
    <strong>{candidatePosition}</strong>
  );
};


const CandidateName = (cellProps) => (
  <ResultCandidateName cellProps={cellProps} />
);

const Votes = (cellProps) => {
  const candidateVotes = cellProps.row.original.votes;

  // if winnder, green, if not, red
  return (
    <strong className="text-success">{candidateVotes}</strong>
  );
};

export {
  Id,
  Position,
  CandidateName,
  Votes,
};

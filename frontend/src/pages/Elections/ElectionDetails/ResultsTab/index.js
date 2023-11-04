// React Core and Hooks
import React from "react";

// Redux Related Imports
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';

// Component and UI Library Imports
import ResultsFinal from "./ResultsFinal";
import ResultsDetailed from "./ResultsDetailed";


const ResultsTab = () => {
  const { election } = useSelector(electionSelector);

  return (
    <>
      {election.electResult === 1 ? <ResultsFinal /> : <ResultsDetailed />}
    </>
  );
};

export default ResultsTab;
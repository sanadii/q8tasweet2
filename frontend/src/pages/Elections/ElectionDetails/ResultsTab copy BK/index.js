// React Core and Hooks
import React, { useState, useMemo, useEffect } from "react";

// Redux Related Imports
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';

import ResultsFinal from "./ResultsFinal";
import ResultsDetailed from "./ResultsDetailed";



const ResultsTab = () => {
  const { election } = useSelector(electionSelector);

  const electionResult = election.electResult;

  return (
    <React.Fragment>
      {electionResult === 1 ?
        <ResultsFinal />
        :
        <ResultsDetailed />
      }
    </React.Fragment>
  );
};

export default ResultsTab;

// WE ARE FINE HERE

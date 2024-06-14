import React from "react";
import { Card, CardHeader, } from "reactstrap";
import { ElectionCandidatesByGender, ElectorsByGender } from './OverviewCharts'

const ElectionDetailsWidget = ({ election, electionCandidates }) => {

  // Voters
  const electionVoters = election.voters;
  const electionMaleVoters = election?.votersMales;
  const electionFemaleVoters = election?.votersFemales;

  const moderators = Array.isArray(election.moderators)
    ? election.moderators
    : [];

  const calculateRemainingDays = (duedate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(duedate);
    dueDate.setHours(0, 0, 0, 0);
    const differenceInTime = dueDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  };

  const remainingDays = calculateRemainingDays(election.duedate);
  let status = "";
  if (remainingDays === 0) {
    status = "today";
  } else if (remainingDays === 1) {
    status = "tomorrow";
  } else if (remainingDays === -1) {
    status = "yesterday";
  } else if (remainingDays < -1) {
    status = "finished";
  } else {
    status = `${Math.ceil(remainingDays)} days remaining`;
  }

  return (
    <React.Fragment>

      <Card className="card-animate overflow-hidden">
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">المرشحين</h4>
          <span>{electionCandidates.length} مرشح</span>
        </CardHeader>

        <div className="card-body">
          <ElectionCandidatesByGender electionCandidates={electionCandidates} />

        </div>
      </Card>

      {/* Election Electors */}
      {(electionMaleVoters > 0 || electionFemaleVoters > 0) &&
        <Card className="card-animate overflow-hidden">
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">الناخبين</h4>
            <span>{electionVoters} ناخب</span>
          </CardHeader>

          <div className="card-body">
            < ElectorsByGender
              electionMaleVoters={electionMaleVoters}
              electionFemaleVoters={electionFemaleVoters}
            />

          </div>
        </Card>
      }
    </React.Fragment >
  );
};

export default ElectionDetailsWidget;

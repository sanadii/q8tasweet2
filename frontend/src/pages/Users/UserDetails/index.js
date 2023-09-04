import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getElectionDetails,
  // getUserElections,
  getElectionCampaigns,
} from "../../../store/actions";
import { isEmpty } from "lodash";
import Section from "./Section";

const ElectionDetails = () => {
  useEffect(() => {
    document.title =
      "User Details | Q8Tasweet - React Admin & Dashboard Template";
  }, []);

  const [user, setElection] = useState({
    id: useParams().id,
  });

  const { electionDetails, userElections, electionCampaigns } =
    useSelector((state) => ({
      electionDetails: state.Elections.electionDetails,
      userElections: state.Elections.userElections,
      electionCampaigns: state.Elections.electionCampaigns,
      // error: state.Elections.error,
    }));

  const dispatch = useDispatch();

  useEffect(() => {
    if (user.id && !isEmpty(user)) {
      dispatch(getElectionDetails(user));
    }
  }, [dispatch, user, user.id]);

  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Section
            user={electionDetails}
            userElections={userElections}
            electionCampaigns={electionCampaigns}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ElectionDetails;

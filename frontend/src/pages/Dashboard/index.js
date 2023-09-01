import React from "react";
import { useSelector } from "react-redux"; // Don't forget to import useSelector

import ElectionList from "../Elections/ElectionList";
import CampaignGrid from "../Campaigns/CampaignList/CampaignGrid";


const Dashboard = () => {
    document.title = "Elections List | Q8Tasweet - React Admin & Dashboard Template";

    const currentUser = useSelector(state => state.Users.currentUser);
    const isStaff = currentUser?.is_staff;

    return (
        <React.Fragment>
            {isStaff ? <ElectionList /> : <CampaignGrid />}
        </React.Fragment>
    );
};

export default Dashboard;
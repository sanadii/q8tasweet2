import { combineReducers } from "redux";




// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";
import Users from "./auth/users/reducer";
import Groups from "./groups/reducer";
import GroupPermissions from "./groupPermissions/reducer";


// Elections
import Elections from "./elections/reducer";
import Candidates from "./candidates/reducer";
import Parties from "./parties/reducer";
import Campaigns from "./campaigns/reducer";
// import ElectionCandidates from "./electionCandidate/reducer";

// Electors
import Electors from "./electors/reducer";
// import Guarantees from "./guarantees/reducer";
// import Attendees from "./attendees/reducer";

// System
import UploadImage from "./uploadImage/reducer";


// Front
import Layout from "./layouts/reducer";


// Settings
import Categories from "./categories/reducer";
import Notifications from "./notifications/reducer";

//API Key
const rootReducer = combineReducers({

    // Theme
    Layout,
    Login,
    Account,
    ForgetPassword,
    Profile,
    Users,
    Groups,
    GroupPermissions,
    
    // Project
    Elections,
    Candidates,
    Parties,
    Campaigns,
    Electors,
    // Guarantees,
    // Attendees,
    
    // System / Settings
    UploadImage,
    Categories,

});

export default rootReducer;